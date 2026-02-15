# Phase 1: Hybrid Search & MCP Server

> **Navigation:** [← Ingestion](./phase1-ingestion.md) · [Phase 2: Webhooks →](./phase2-webhooks.md) · [Overview](./OVERVIEW.md)

---

## 6. HYBRID SEARCH (Vector + FTS5 + RRF + Rerank)

### 6.1 Pipeline

```
Query → Embed (AI Worker)
         │
    ┌────┴────┐
    ▼         ▼
 Vector    FTS5       ← Parallel
 Top 50   Top 50
    └────┬────┘
         ▼
    RRF Fusion (k=60)
         ▼
    Top 25 candidates
         ▼
    Cross-Encoder Rerank (AI Worker)
         ▼
    Top K results → LLM
```

### 6.2 Implementation

```typescript
// src/lib/hybrid_search.ts
import { getDB } from './db.js';
import { getAIPool } from './worker_pool.js';
import { createHash } from 'crypto';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/** Cache-first query embedding: skip inference for repeated queries */
async function getOrComputeQueryEmbedding(
  db: any, ai: any, query: string
): Promise<Float32Array> {
  const normalized = query.trim().toLowerCase();
  const hash = createHash('sha256').update(normalized).digest('hex');

  // 1. Check cache
  const cached = db.prepare(
    `SELECT embedding FROM query_embedding_cache WHERE query_hash = ? AND created_at > ?`
  ).get(hash, Date.now() - CACHE_TTL_MS) as any;

  if (cached) {
    db.prepare(`UPDATE query_embedding_cache SET hit_count = hit_count + 1 WHERE query_hash = ?`).run(hash);
    // IMPORTANT: Node Buffer may have byteOffset > 0 from the shared ArrayBuffer pool.
    // Must use (buffer, byteOffset, length) constructor to avoid reading wrong memory.
    const buf = cached.embedding;
    return new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
  }

  // 2. Compute + cache
  const { embedding } = await ai.execute({ type: 'embed', text: query, isQuery: true });
  db.prepare(`
    INSERT INTO query_embedding_cache (query_hash, query_text, embedding, created_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(query_hash) DO UPDATE SET embedding = excluded.embedding, created_at = excluded.created_at
  `).run(hash, query, Buffer.from(embedding.buffer), Date.now());

  // 3. Evict stale entries (non-blocking housekeeping)
  db.prepare(`DELETE FROM query_embedding_cache WHERE created_at < ?`).run(Date.now() - CACHE_TTL_MS);

  return embedding;
}

export interface SearchResult {
  content: string;
  file_path: string;
  repo: string;
  context: string;
  start_line: number;
  end_line: number;
  score: number;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  metrics: { vectorMs: number; ftsMs: number; rerankMs: number; totalMs: number };
}

export async function hybridSearch(query: string, topK = 10): Promise<SearchResponse> {
  const db = getDB();
  const ai = getAIPool();
  const t0 = Date.now();

  // 1. Embed query (cache-first)
  const qEmb = await getOrComputeQueryEmbedding(db, ai, query);

  // 2a. Vector search
  const t1 = Date.now();
  const vecResults = db.prepare(`
    SELECT chunk_id, distance
    FROM vec_chunks
    WHERE embedding MATCH ? AND k = 50
    ORDER BY distance
  `).all(Buffer.from(qEmb.buffer));
  const vectorMs = Date.now() - t1;

  // 2b. FTS5 search (parallel-safe since sync)
  const t2 = Date.now();
  // Escape FTS5 special chars by quoting the query
  const safeQuery = '"' + query.replace(/"/g, '""') + '"';
  const ftsResults = db.prepare(`
    SELECT rowid as chunk_id, rank
    FROM fts_chunks
    WHERE fts_chunks MATCH ?
    ORDER BY rank
    LIMIT 50
  `).all(safeQuery);
  const ftsMs = Date.now() - t2;

  // 3. Reciprocal Rank Fusion
  const K = 60;
  const scores = new Map<number, number>();

  vecResults.forEach((r: any, i: number) => {
    scores.set(r.chunk_id, (scores.get(r.chunk_id) ?? 0) + 1 / (K + i + 1));
  });
  ftsResults.forEach((r: any, i: number) => {
    scores.set(r.chunk_id, (scores.get(r.chunk_id) ?? 0) + 1 / (K + i + 1));
  });

  const candidateIds = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([id]) => id);

  if (candidateIds.length === 0) {
    return { query, results: [], metrics: { vectorMs, ftsMs, rerankMs: 0, totalMs: Date.now() - t0 } };
  }

  // 4. Fetch chunk content
  const ph = candidateIds.map(() => '?').join(',');
  const docs = db.prepare(`
    SELECT c.id, c.content, c.context_header, c.start_line, c.end_line,
           f.file_path, f.repo_slug
    FROM chunks c JOIN files f ON c.file_id = f.id
    WHERE c.id IN (${ph})
  `).all(...candidateIds) as any[];

  // 5. Cross-encoder rerank
  const t3 = Date.now();
  const { scores: reranked } = await ai.execute({
    type: 'rerank',
    query,
    docs: docs.map(d => ({ id: d.id, text: d.content }))
  });
  const rerankMs = Date.now() - t3;

  // 6. Format final results
  const results: SearchResult[] = reranked
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, topK)
    .map(({ id, score }: any) => {
      const d = docs.find(x => x.id === id)!;
      return {
        content: d.content, file_path: d.file_path, repo: d.repo_slug,
        context: d.context_header, start_line: d.start_line,
        end_line: d.end_line, score,
      };
    });

  const totalMs = Date.now() - t0;

  // 7. Log metrics
  db.prepare(`
    INSERT INTO search_metrics (query, vector_ms, fts_ms, rerank_ms, total_ms, result_count, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(query, vectorMs, ftsMs, rerankMs, totalMs, results.length, Date.now());

  return { query, results, metrics: { vectorMs, ftsMs, rerankMs, totalMs } };
}
```

---

## 8. MCP SERVER (6 Tools)

```typescript
// src/server/mcp_server.ts
import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { hybridSearch } from '../lib/hybrid_search.js';
import { getDB } from '../lib/db.js';

const server = new Server(
  { name: 'internal-code-brain', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

const TOOLS = [
  {
    name: 'search_semantic_code',
    description: `Search across all indexed repositories using semantic (meaning-based) and keyword matching combined with AI re-ranking.
USE THIS TOOL WHEN:
- You need to find code by describing what it does (e.g., "function that validates JWT tokens")
- You want to understand how a concept is implemented (e.g., "error handling middleware")
- You're looking for code related to a feature or pattern (e.g., "database connection pooling")
- You need to find implementations similar to a concept (e.g., "rate limiting logic")
DO NOT USE when searching for an exact variable name, function name, or string literal — use search_exact_match instead.
RETURNS: Ranked list of code chunks with file paths, line numbers, repo slugs, and relevance scores. Each result includes surrounding context (breadcrumbs showing class/function hierarchy).`,
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Natural language description of what you are looking for. Be specific and descriptive. Good: "middleware that checks authentication and attaches user to request". Bad: "auth".',
        },
        top_k: {
          type: 'number',
          description: 'Number of results to return. Default: 10. Use 5 for focused queries, 20 for broad exploration. Max: 50.',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'search_exact_match',
    description: `Search for an exact string or pattern across all indexed code. Uses literal substring matching (case-sensitive).
USE THIS TOOL WHEN:
- Looking for a specific function/class/variable name (e.g., "validateToken", "UserService")
- Searching for error codes or constants (e.g., "ERR_INVALID_TOKEN", "MAX_RETRIES")
- Finding usages of a specific API endpoint (e.g., "/api/v2/users")
- Locating environment variable references (e.g., "DATABASE_URL")
- Tracing where a specific string appears across repos
DO NOT USE for conceptual/meaning-based searches — use search_semantic_code instead.
RETURNS: Up to 50 matching code chunks with file paths, line numbers, and repo slugs.`,
    inputSchema: {
      type: 'object' as const,
      properties: {
        pattern: {
          type: 'string',
          description: 'The exact string to search for (case-sensitive). Can be a function name, variable, error code, API path, or any literal string. Examples: "handleWebhook", "process.env.API_KEY", "SELECT * FROM users".',
        },
        repo: {
          type: 'string',
          description: 'Optional. Filter results to a specific repository. Use the full repo slug format: "workspace/repo-name". Omit to search across all repos.',
        },
        file_ext: {
          type: 'string',
          description: 'Optional. Filter by file extension (without dot). Examples: "ts", "py", "go". Omit to search all file types.',
        },
      },
      required: ['pattern'],
    },
  },
  {
    name: 'read_full_file',
    description: `Retrieve the complete source code of a specific file from the index. Reconstructs the full file from its indexed chunks.
USE THIS TOOL WHEN:
- You found a relevant file via search and need to see its full implementation
- You need to understand the complete context of a file (all imports, exports, classes)
- You want to review or analyze a specific file's code in detail
IMPORTANT: You must know the exact repo_slug and file_path. If unsure, use search_semantic_code or search_exact_match first to discover the correct path.
RETURNS: The complete file content as a single text block with the file path.`,
    inputSchema: {
      type: 'object' as const,
      properties: {
        repo_slug: {
          type: 'string',
          description: 'Full repository slug in "workspace/repo-name" format. You can find this from search results or get_project_info.',
        },
        file_path: {
          type: 'string',
          description: 'Relative file path within the repo (from repo root). Examples: "src/auth/middleware.ts", "pkg/handlers/user.go", "app/models/user.py". Must match exactly as stored.',
        },
      },
      required: ['repo_slug', 'file_path'],
    },
  },
  // Phase 2: get_pr_details tool (PR backfill + webhook)
  {
    name: 'get_file_dependencies',
    description: `Explore the import/dependency graph for a specific file. Shows what a file imports or which files import it.
USE THIS TOOL WHEN:
- You need to understand a file's dependencies before making changes
- You want to assess the blast radius of modifying a file (who imports it?)
- You're tracing how modules are connected in a codebase
- You need to find related files that work together
RETURNS: List of file paths that the target file imports (direction="imports") or that import the target file (direction="imported_by").`,
    inputSchema: {
      type: 'object' as const,
      properties: {
        file_path: {
          type: 'string',
          description: 'Relative file path within the repo. Examples: "src/lib/db.ts", "internal/auth/jwt.go".',
        },
        repo_slug: {
          type: 'string',
          description: 'Full repository slug in "workspace/repo-name" format.',
        },
        direction: {
          type: 'string',
          enum: ['imports', 'imported_by'],
          description: '"imports" = what does this file depend on? "imported_by" = what files depend on this file? Default: "imports".',
        },
      },
      required: ['file_path', 'repo_slug'],
    },
  },
  {
    name: 'check_dependency_usage',
    description: `Check which repositories use a specific third-party library/package and what version they are on.
USE THIS TOOL WHEN:
- You need to audit which repos depend on a specific package (e.g., "express", "lodash")
- You want to check for version inconsistencies across repos
- You need to find all repos affected by a library vulnerability
- You want to know if a package is used as a dev or production dependency
RETURNS: List of repos using the library with version numbers and whether it's a dev dependency.`,
    inputSchema: {
      type: 'object' as const,
      properties: {
        library_name: {
          type: 'string',
          description: 'The exact package/library name as it appears in package.json, requirements.txt, go.mod, etc. Examples: "express", "react", "lodash", "axios", "pytest".',
        },
      },
      required: ['library_name'],
    },
  },
  {
    name: 'get_project_info',
    description: `Get metadata about indexed repositories including tech stack, project type, file counts, and sync status.
USE THIS TOOL WHEN:
- You need to discover what projects/repos are available to search
- You want to know the primary language, tech stack, or project type (microservice/micro-frontend/library)
- You need to find the correct repo_slug to use with other tools
- You want an overview of the entire codebase landscape
ALWAYS CALL THIS FIRST if you don't know the exact repo_slug for other tools.
RETURNS: Project metadata including repo_slug, description, primary_language, tech_stack, project_type, default_branch, repo_url, file count, and last_synced_at.`,
    inputSchema: {
      type: 'object' as const,
      properties: {
        repo_slug: {
          type: 'string',
          description: 'Optional. Specific repo slug in "workspace/repo-name" format. Omit to list ALL indexed projects — useful for discovering available repositories.',
        },
      },
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  try {
    const result = await dispatch(name, args ?? {});
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  } catch (err: any) {
    return { content: [{ type: 'text', text: JSON.stringify({ error: err.message }) }], isError: true };
  }
});

async function dispatch(name: string, args: any): Promise<any> {
  const db = getDB();

  switch (name) {
    case 'search_semantic_code':
      return hybridSearch(args.query, args.top_k ?? 10);

    case 'search_exact_match': {
      // Use FTS5 for fast full-text search instead of LIKE %pattern% (avoids full table scan)
      const ftsResults = db.prepare(`
        SELECT c.content, c.start_line, c.end_line, c.context_header, f.file_path, f.repo_slug
        FROM fts_chunks fts
        JOIN chunks c ON c.id = fts.rowid
        JOIN files f ON c.file_id = f.id
        WHERE fts_chunks MATCH ?
        ${args.repo ? 'AND f.repo_slug = ?' : ''}
        ${args.file_ext ? 'AND f.file_path LIKE ?' : ''}
        LIMIT 50
      `);
      const params: any[] = [`"${args.pattern.replace(/"/g, '""')}"`];
      if (args.repo) params.push(args.repo);
      if (args.file_ext) params.push(`%.${args.file_ext}`);
      return { pattern: args.pattern, results: ftsResults.all(...params) };
    }

    case 'read_full_file': {
      const chunks = db.prepare(`
        SELECT c.content FROM chunks c JOIN files f ON c.file_id = f.id
        WHERE f.repo_slug = ? AND f.file_path = ? ORDER BY c.chunk_index
      `).all(args.repo_slug, args.file_path) as any[];
      if (!chunks.length) throw new Error('File not found');
      return { file_path: args.file_path, content: chunks.map(c => c.content).join('\n\n') };
    }

    // Phase 2: case 'get_pr_details'

    case 'get_file_dependencies': {
      const dir = args.direction ?? 'imports';
      const sql = dir === 'imports'
        ? 'SELECT target_file FROM file_imports WHERE repo_slug = ? AND source_file = ?'
        : 'SELECT source_file FROM file_imports WHERE repo_slug = ? AND target_file = ?';
      return { file_path: args.file_path, direction: dir, deps: db.prepare(sql).all(args.repo_slug, args.file_path) };
    }

    case 'check_dependency_usage':
      return {
        library_name: args.library_name,
        usage: db.prepare(`SELECT repo_slug, version, is_dev_dependency FROM dependencies WHERE library_name = ?`)
          .all(args.library_name),
      };

    case 'get_project_info':
      return args.repo_slug
        ? db.prepare('SELECT * FROM projects WHERE repo_slug = ?').get(args.repo_slug)
        : db.prepare('SELECT * FROM projects ORDER BY repo_slug').all();

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ── Environment validation ──────────────────────────────────
const REQUIRED_ENV = ['DATABASE_PATH', 'EMBEDDING_MODEL_PATH'] as const;
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`FATAL: Missing required env var: ${key}`);
    process.exit(1);
  }
}

// ── Graceful shutdown ───────────────────────────────────────
async function shutdown(signal: string) {
  console.log(`\n${signal} received, shutting down...`);
  try {
    const { getAIPool, getParserPool } = await import('../lib/worker_pool.js');
    await getAIPool().terminate();
    await getParserPool().terminate();
    getDB().close();
    console.log('✓ Clean shutdown complete');
  } catch (err: any) {
    console.error('Shutdown error:', err.message);
  }
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

const transport = new StdioServerTransport();
server.connect(transport).then(() => console.log('✓ MCP server running on stdio'));
```
