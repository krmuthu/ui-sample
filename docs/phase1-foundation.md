# Phase 1: Foundation — Database & Worker Threads

> **Navigation:** [← Overview](./OVERVIEW.md) · [Ingestion →](./phase1-ingestion.md) · [Search & MCP](./phase1-search-and-mcp.md)

---

## 4. DATABASE ARCHITECTURE (SQLite + sqlite-vec + FTS5)

### 4.1 Complete Schema

```sql
-- ============================================================
-- METADATA TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  repo_slug TEXT NOT NULL,
  file_path TEXT NOT NULL,
  commit_hash TEXT NOT NULL,
  language TEXT,
  updated_at INTEGER NOT NULL,
  UNIQUE(repo_slug, file_path)
);
CREATE INDEX IF NOT EXISTS idx_files_repo ON files(repo_slug);
CREATE INDEX IF NOT EXISTS idx_files_updated ON files(updated_at);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  repo_slug TEXT NOT NULL UNIQUE,
  project_key TEXT,
  description TEXT,
  primary_language TEXT,
  tech_stack TEXT,
  project_type TEXT,                       -- 'microservice' | 'micro-frontend' | 'library' | 'monolith' | 'unknown'
  repo_url TEXT,
  default_branch TEXT DEFAULT 'main',
  last_synced_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS dependencies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  repo_slug TEXT NOT NULL,
  library_name TEXT NOT NULL,
  version TEXT,
  is_dev_dependency INTEGER DEFAULT 0,
  UNIQUE(repo_slug, library_name)
);

CREATE TABLE IF NOT EXISTS file_imports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  repo_slug TEXT NOT NULL,
  source_file TEXT NOT NULL,
  target_file TEXT NOT NULL,
  UNIQUE(repo_slug, source_file, target_file)
);

-- ============================================================
-- CONTENT TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS chunks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_id INTEGER NOT NULL,
  chunk_index INTEGER NOT NULL,
  start_line INTEGER,
  end_line INTEGER,
  content TEXT NOT NULL,
  context_header TEXT,
  ast_type TEXT,
  FOREIGN KEY(file_id) REFERENCES files(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_chunks_file ON chunks(file_id);

-- ============================================================
-- FULL-TEXT SEARCH (FTS5 external content)
-- ============================================================

CREATE VIRTUAL TABLE IF NOT EXISTS fts_chunks USING fts5(
  content,
  context_header,
  content='chunks',
  content_rowid='id'
);

-- FTS sync triggers
CREATE TRIGGER IF NOT EXISTS chunks_ai AFTER INSERT ON chunks BEGIN
  INSERT INTO fts_chunks(rowid, content, context_header)
  VALUES (new.id, new.content, new.context_header);
END;

CREATE TRIGGER IF NOT EXISTS chunks_ad AFTER DELETE ON chunks BEGIN
  INSERT INTO fts_chunks(fts_chunks, rowid, content, context_header)
  VALUES('delete', old.id, old.content, old.context_header);
END;

CREATE TRIGGER IF NOT EXISTS chunks_au AFTER UPDATE ON chunks BEGIN
  INSERT INTO fts_chunks(fts_chunks, rowid, content, context_header)
  VALUES('delete', old.id, old.content, old.context_header);
  INSERT INTO fts_chunks(rowid, content, context_header)
  VALUES (new.id, new.content, new.context_header);
END;

-- ============================================================
-- VECTOR SEARCH (sqlite-vec) — 768d for nomic-embed-text-v1.5
-- ============================================================

CREATE VIRTUAL TABLE IF NOT EXISTS vec_chunks USING vec0(
  chunk_id INTEGER PRIMARY KEY,
  embedding float[768]
);

-- CRITICAL: Virtual tables don't support FK cascades.
-- Explicit trigger to delete vectors when chunks are deleted.
CREATE TRIGGER IF NOT EXISTS chunks_vec_ad AFTER DELETE ON chunks BEGIN
  DELETE FROM vec_chunks WHERE chunk_id = old.id;
END;

-- ============================================================
-- OBSERVABILITY
-- ============================================================

CREATE TABLE IF NOT EXISTS search_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query TEXT NOT NULL,
  vector_ms INTEGER,
  fts_ms INTEGER,
  rerank_ms INTEGER,
  total_ms INTEGER NOT NULL,
  result_count INTEGER,
  timestamp INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_metrics_ts ON search_metrics(timestamp);

-- ============================================================
-- QUERY EMBEDDING CACHE (skip inference for repeated queries)
-- ============================================================

CREATE TABLE IF NOT EXISTS query_embedding_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query_hash TEXT NOT NULL UNIQUE,      -- SHA-256 of normalized query
  query_text TEXT NOT NULL,
  embedding BLOB NOT NULL,              -- 768d Float32Array as raw bytes
  created_at INTEGER NOT NULL,
  hit_count INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_qec_hash ON query_embedding_cache(query_hash);

-- ============================================================
-- PULL REQUEST CACHE (Phase 2 — tables created but not populated)
-- ============================================================

CREATE TABLE IF NOT EXISTS pull_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  repo_slug TEXT NOT NULL,
  pr_number INTEGER NOT NULL,
  title TEXT,
  description TEXT,
  summary TEXT,               -- Phase 2: AI-generated summary
  author TEXT,
  state TEXT,
  created_at INTEGER,
  updated_at INTEGER,
  source_branch TEXT,
  dest_branch TEXT,
  UNIQUE(repo_slug, pr_number)
);
CREATE INDEX IF NOT EXISTS idx_pr_repo ON pull_requests(repo_slug);

CREATE TABLE IF NOT EXISTS pr_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pr_id INTEGER NOT NULL,
  author TEXT,
  content TEXT,
  created_at INTEGER,
  FOREIGN KEY(pr_id) REFERENCES pull_requests(id) ON DELETE CASCADE
);
```

### 4.2 Database Initialization

```typescript
// src/lib/db.ts
// IMPORTANT: better-sqlite3 is NOT thread-safe. This module must ONLY be used
// from the MAIN THREAD. Worker threads (ai.worker, parser.worker) must never
// import or instantiate this module. All DB writes happen on the main thread.
import Database from 'better-sqlite3';
import * as sqliteVec from 'sqlite-vec';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

class CodeBrainDB {
  private db: Database.Database;
  private stmtCache = new Map<string, Database.Statement>();

  constructor(dbPath: string = './code_brain.db') {
    this.db = new Database(dbPath);
    this.initOptimizations();
    this.loadVectorExtension();
    this.initSchema();
  }

  private initOptimizations(): void {
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = NORMAL');
    this.db.pragma('cache_size = -64000');     // 64MB
    this.db.pragma('mmap_size = 268435456');   // 256MB
    this.db.pragma('foreign_keys = ON');
    this.db.pragma('busy_timeout = 5000');     // 5s retry on SQLITE_BUSY
    this.db.pragma('temp_store = MEMORY');     // FTS5/vec temp tables in RAM
  }

  private loadVectorExtension(): void {
    sqliteVec.load(this.db);
    const row = this.db.prepare('SELECT vec_version() as v').get() as any;
    console.log(`✓ sqlite-vec loaded: v${row.v}`);
  }

  private initSchema(): void {
    const schemaPath = join(__dirname, '../../schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    this.db.exec(schema);
    console.log('✓ Database schema initialized');
  }

  prepare(sql: string): Database.Statement {
    if (!this.stmtCache.has(sql)) {
      this.stmtCache.set(sql, this.db.prepare(sql));
    }
    return this.stmtCache.get(sql)!;
  }

  transaction<T>(fn: () => T): T {
    return this.db.transaction(fn)();
  }

  close(): void { this.db.close(); }
}

let instance: CodeBrainDB | null = null;

export function getDB(): CodeBrainDB {
  if (!instance) {
    instance = new CodeBrainDB(process.env.DATABASE_PATH || './code_brain.db');
  }
  return instance;
}
```

---

## 5. WORKER THREAD CONCURRENCY MODEL

### 5.1 Architecture

```
MAIN THREAD (never blocks)
├── Express Server (webhooks)
├── MCP Server (JSON-RPC stdio)
├── SQLite queries (sync, fast)
│
├──► AI WORKER POOL (4 threads)
│    ├── nomic-embed-text-v1.5.Q8_0.gguf (768d via node-llama-cpp)
│    └── ms-marco-MiniLM-L-6-v2 (reranking via HF transformers)
│
└──► PARSER WORKER POOL (2 threads)
     └── Tree-sitter CAST chunker
```

### 5.2 Worker Pool Implementation

```typescript
// src/lib/worker_pool.ts
import { Worker } from 'worker_threads';
import { EventEmitter } from 'events';

interface PendingTask {
  resolve: (value: any) => void;
  reject: (error: Error) => void;
  startTime: number;
}

export class WorkerPool extends EventEmitter {
  private workers: Worker[] = [];
  private available: Worker[] = [];
  private queue: any[] = [];
  private pending = new Map<number, PendingTask>();
  private nextId = 0;

  constructor(private script: string, private size: number = 4) {
    super();
    for (let i = 0; i < size; i++) this.spawnWorker(i);
    console.log(`✓ Worker pool: ${size} workers from ${script}`);
  }

  private spawnWorker(index: number): Worker {
    const w = new Worker(this.script);
    w.on('message', (msg) => this.onMessage(w, msg));
    w.on('error', (err) => this.onError(w, err));
    w.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker crashed (code ${code}), restarting...`);
        const replacement = this.spawnWorker(index);
        this.workers[index] = replacement;
      }
    });
    this.workers[index] = w;
    this.available.push(w);
    return w;
  }

  execute<T = any>(task: any): Promise<T> {
    return new Promise((resolve, reject) => {
      const taskId = this.nextId++;
      this.pending.set(taskId, { resolve, reject, startTime: Date.now() });

      const msg = { ...task, taskId };
      const worker = this.available.pop();
      if (worker) {
        worker.postMessage(msg);
      } else {
        this.queue.push(msg);
      }

      setTimeout(() => {
        if (this.pending.has(taskId)) {
          this.pending.delete(taskId);
          reject(new Error(`Task ${taskId} timed out (30s)`));
        }
      }, 30_000);
    });
  }

  private onMessage(worker: Worker, msg: any): void {
    if (msg.type === 'status') return;
    const p = this.pending.get(msg.taskId);
    if (!p) return;
    this.pending.delete(msg.taskId);
    msg.error ? p.reject(new Error(msg.error)) : p.resolve(msg);

    const next = this.queue.shift();
    if (next) worker.postMessage(next);
    else this.available.push(worker);
  }

  private onError(worker: Worker, err: Error): void {
    console.error('Worker error:', err);
    for (const [id, p] of this.pending) {
      p.reject(new Error(`Worker crashed: ${err.message}`));
      this.pending.delete(id);
    }
  }

  async terminate(): Promise<void> {
    await Promise.all(this.workers.map(w => w.terminate()));
  }
}

// Singleton pools
let aiPool: WorkerPool | null = null;
let parserPool: WorkerPool | null = null;

export function getAIPool(): WorkerPool {
  if (!aiPool) {
    aiPool = new WorkerPool(
      new URL('../workers/ai.worker.ts', import.meta.url).href, 4
    );
  }
  return aiPool;
}

export function getParserPool(): WorkerPool {
  if (!parserPool) {
    parserPool = new WorkerPool(
      new URL('../workers/parser.worker.ts', import.meta.url).href, 2
    );
  }
  return parserPool;
}
```

### 5.3 AI Worker

```typescript
// src/workers/ai.worker.ts
import { parentPort } from 'worker_threads';
import { getLlama } from 'node-llama-cpp';
import { pipeline, env } from '@huggingface/transformers';

// Prevent ONNX thread contention (for reranker only)
env.backends.onnx.wasm.numThreads = 1;

let embeddingContext: any = null;
let reranker: any = null;

const MODEL_PATH = process.env.EMBEDDING_MODEL_PATH || './models/nomic-embed-text-v1.5.Q8_0.gguf';

async function init() {
  console.log('[AI Worker] Loading models...');

  // 1. Load GGUF embedding model via node-llama-cpp
  const llama = await getLlama();
  const model = await llama.loadModel({ modelPath: MODEL_PATH });
  embeddingContext = await model.createEmbeddingContext();
  console.log('[AI Worker] Embedding model loaded (GGUF)');

  // 2. Load reranker via HuggingFace Transformers (ONNX)
  reranker = await pipeline(
    'text-classification',
    'Xenova/ms-marco-MiniLM-L-6-v2',
    { dtype: 'q8' }
  );
  console.log('[AI Worker] Reranker loaded (ONNX)');

  parentPort!.postMessage({ type: 'status', status: 'ready' });
}

init();

parentPort!.on('message', async (task) => {
  try {
    if (task.type === 'embed') {
      // Prepend search prefix per nomic-embed-text spec
      const prefix = task.isQuery ? 'search_query: ' : 'search_document: ';
      const result = await embeddingContext.getEmbeddingFor(prefix + task.text);
      const embedding = new Float32Array(result.vector);
      parentPort!.postMessage(
        { taskId: task.taskId, embedding },
        [embedding.buffer]  // Zero-copy transfer
      );
    } else if (task.type === 'rerank') {
      const scores: Array<{ id: number; score: number }> = [];
      for (const doc of task.docs) {
        const result = await reranker([task.query, doc.text]);
        scores.push({ id: doc.id, score: result[0]?.score ?? 0 });
      }
      parentPort!.postMessage({ taskId: task.taskId, scores });
    }
  } catch (error: any) {
    parentPort!.postMessage({ taskId: task.taskId, error: error.message });
  }
});
```

### 5.4 Parser Worker (CAST Algorithm — Multi-Language)

#### Language Support Table

| Language | Entry Node | Logic Blocks | Child Split Points | Grammar Package |
|---|---|---|---|---|
| JavaScript/TS | `program` | `class_declaration`, `function_declaration`, `method_definition` | `if_statement`, `for_statement` | `tree-sitter-javascript`, `tree-sitter-typescript` |
| Python | `module` | `class_definition`, `function_definition` | `if_statement`, `for_statement` | `tree-sitter-python` |
| Go | `source_file` | `method_declaration`, `function_declaration` | `block`, `if_statement` | `tree-sitter-go` |
| Java | `program` | `class_declaration`, `method_declaration` | `block`, `try_statement` | `tree-sitter-java` |
| C++ | `translation_unit` | `class_specifier`, `function_definition` | `compound_statement` | `tree-sitter-cpp` |
| *Unsupported* | N/A | N/A | N/A | **Fallback: empty-line splitting** |

```typescript
// src/workers/parser.worker.ts
import { parentPort } from 'worker_threads';
import Parser from 'web-tree-sitter';
import { createRequire } from 'module';

// Use createRequire for robust WASM path resolution (works in ESM + compiled output)
const require = createRequire(import.meta.url);

let parser: Parser;
const langCache = new Map<string, Parser.Language>();

interface Chunk {
  content: string;
  start_line: number;
  end_line: number;
  context_header: string;
  ast_type: string;
}

// ── Multi-language grammars ─────────────────────────────────
const GRAMMARS: Record<string, string> = {
  javascript: 'tree-sitter-javascript',
  typescript: 'tree-sitter-typescript',
  python: 'tree-sitter-python',
  go: 'tree-sitter-go',
  java: 'tree-sitter-java',
  cpp: 'tree-sitter-cpp',
};

// ── Breadcrumb node types (language-agnostic superset) ──────
const BREADCRUMB_NODES = new Set([
  // JS/TS
  'class_declaration', 'function_declaration', 'method_definition',
  'arrow_function', 'lexical_declaration',
  // Python
  'class_definition', 'function_definition',
  // Go
  'method_declaration', 'type_declaration',
  // Java
  'class_declaration', 'method_declaration', 'interface_declaration',
  // C++
  'class_specifier', 'function_definition', 'namespace_definition',
]);

async function init() {
  await Parser.init();
  parser = new Parser();

  for (const [lang, pkg] of Object.entries(GRAMMARS)) {
    try {
      // Resolve WASM path robustly — works regardless of dist/ layout
      const wasmPath = require.resolve(`${pkg}/${pkg}.wasm`);
      const language = await Parser.Language.load(wasmPath);
      langCache.set(lang, language);
      console.log(`[Parser] ✓ Loaded ${lang}`);
    } catch (e: any) {
      console.warn(`[Parser] ✗ Failed to load ${lang}: ${e.message}`);
    }
  }

  parentPort!.postMessage({ type: 'status', status: 'ready' });
}

init();

parentPort!.on('message', async (task) => {
  try {
    const lang = langCache.get(task.language);
    let chunks: Chunk[];

    if (lang) {
      // AST-based CAST chunking (preferred)
      parser.setLanguage(lang);
      const tree = parser.parse(task.code);
      chunks = castChunk(tree.rootNode, task.maxChunkSize ?? 500);
    } else {
      // Fallback: empty-line splitting for unsupported languages
      console.warn(`[Parser] No grammar for "${task.language}", using fallback`);
      chunks = fallbackChunk(task.code, task.maxChunkSize ?? 500, task.filePath ?? '');
    }

    parentPort!.postMessage({ taskId: task.taskId, chunks });
  } catch (error: any) {
    parentPort!.postMessage({ taskId: task.taskId, error: error.message });
  }
});

// ── CAST Algorithm ──────────────────────────────────────────

function castChunk(root: Parser.SyntaxNode, maxSize: number): Chunk[] {
  const chunks: Chunk[] = [];
  const stack: Parser.SyntaxNode[] = [];

  function visit(node: Parser.SyntaxNode) {
    stack.push(node);
    const size = nonWhitespaceSize(node);

    // Node fits → emit as chunk
    if (size <= maxSize) {
      chunks.push({
        content: node.text,
        start_line: node.startPosition.row,
        end_line: node.endPosition.row,
        context_header: buildBreadcrumb(stack),
        ast_type: node.type,
      });
      stack.pop();
      return;
    }

    // Node too large → group children
    let group: Parser.SyntaxNode[] = [];
    let groupSize = 0;

    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i)!;
      const childSize = nonWhitespaceSize(child);

      if (childSize > maxSize) {
        if (group.length) { flushGroup(group, chunks, stack); group = []; groupSize = 0; }
        visit(child);
      } else if (groupSize + childSize > maxSize) {
        flushGroup(group, chunks, stack);
        group = [child]; groupSize = childSize;
      } else {
        group.push(child); groupSize += childSize;
      }
    }
    if (group.length) flushGroup(group, chunks, stack);
    stack.pop();
  }

  visit(root);
  return chunks;
}

function nonWhitespaceSize(node: Parser.SyntaxNode): number {
  return node.text.replace(/\s/g, '').length;
}

function buildBreadcrumb(stack: Parser.SyntaxNode[]): string {
  return stack
    .filter(n => BREADCRUMB_NODES.has(n.type))
    .map(n => `${n.type}:${n.text.split('\n')[0].slice(0, 50)}`)
    .join(' > ');
}

function flushGroup(nodes: Parser.SyntaxNode[], chunks: Chunk[], stack: Parser.SyntaxNode[]) {
  chunks.push({
    content: nodes.map(n => n.text).join('\n'),
    start_line: nodes[0].startPosition.row,
    end_line: nodes[nodes.length - 1].endPosition.row,
    context_header: buildBreadcrumb(stack),
    ast_type: 'merged_block',
  });
}

// ── Fallback: Empty-Line Splitting ──────────────────────────
// For languages without a Tree-sitter grammar or when parsing fails.
// Splits on double newlines (logical block boundaries), then greedy-merges.

function fallbackChunk(code: string, maxSize: number, filePath: string): Chunk[] {
  const blocks = code.split(/\n\s*\n/);
  const chunks: Chunk[] = [];
  let current = '';
  let startLine = 0;
  let lineOffset = 0;

  for (const block of blocks) {
    const blockLines = block.split('\n').length;

    if (current.length + block.length > maxSize && current.length > 0) {
      chunks.push({
        content: current.trim(),
        start_line: startLine,
        end_line: lineOffset - 1,
        context_header: `File: ${filePath}`,
        ast_type: 'fallback_block',
      });
      current = block;
      startLine = lineOffset;
    } else {
      current += (current ? '\n\n' : '') + block;
    }
    lineOffset += blockLines + 1; // +1 for the empty line separator
  }

  if (current.trim()) {
    chunks.push({
      content: current.trim(),
      start_line: startLine,
      end_line: lineOffset - 1,
      context_header: `File: ${filePath}`,
      ast_type: 'fallback_block',
    });
  }

  return chunks;
}
```
