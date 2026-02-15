# Internal Code Brain — Overview

## SQLite-Only Hybrid RAG | Node.js 24 LTS | TypeScript ESM

> **Navigation:** [Foundation](./phase1-foundation.md) · [Ingestion](./phase1-ingestion.md) · [Search & MCP](./phase1-search-and-mcp.md) · [Phase 2: Webhooks](./phase2-webhooks.md) · [Deployment](./deployment.md)

---

## 1. EXECUTIVE SUMMARY

Build a production-ready **Internal Code Brain** MCP server for semantic search across Bitbucket repositories. All inference runs locally — no external API calls.

### Core Architecture Decisions

| # | Decision | Choice | Rationale |
|---|---|---|---|
| 1 | Vector Store | **SQLite + sqlite-vec** (NOT ChromaDB) | In-process (0.1ms vs 20ms), ACID, no sync bugs, single file |
| 2 | Concurrency | **Worker Thread Pools** | AI + Parser workers prevent event-loop blocking |
| 3 | Chunking | **CAST Algorithm (Tree-sitter AST)** | Syntactically complete chunks, +4 Recall@5 vs text splitting |
| 4 | Search | **Hybrid RRF (Vector + FTS5 + Rerank)** | Handles both concepts AND identifiers |
| 5 | Sync | **Bitbucket Webhooks** | Real-time, 95% fewer API calls than polling |
| 6 | Parser | **Tree-sitter WASM** | 40+ languages, error recovery on invalid code |
| 7 | SQLite Driver | **better-sqlite3 (sync)** | Faster than async for in-process DB (eliminates promise overhead) |
| 8 | Runtime | **Node.js 24 LTS** | Native fetch, --experimental-strip-types, improved workers |

### System Guarantees

| Requirement | Guarantee | Mechanism |
|---|---|---|
| Performance | <500ms search (P95) | In-process SQLite + worker threads |
| Consistency | No stale code in index | ACID transactions + differential sync |
| Security | Code never leaves infra | Local inference with transformers.js |
| Reliability | Zero event-loop blocking | Strict worker thread isolation |
| Accuracy | Syntactically complete chunks | AST-based CAST algorithm |
| Precision | Exact + semantic matching | Hybrid search with RRF |

---

## 2. TECHNOLOGY STACK

### 2.1 Runtime

**Node.js 24 LTS (Krypton)** — `engines: { "node": ">=24.0.0" }`

Features leveraged:
- ✅ **Native `fetch`** — no polyfill for Bitbucket API
- ✅ **`--experimental-strip-types`** — run `.ts` directly (no `tsx` dependency)
- ✅ **Improved `worker_threads`** — better diagnostics

### 2.2 Dependencies

```json
{
  "name": "internal-code-brain",
  "version": "1.0.0",
  "type": "module",
  "engines": { "node": ">=24.0.0" },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.26.0",
    "node-llama-cpp": "^3.0.0",
    "@huggingface/transformers": "^3.0.0",
    "better-sqlite3": "^11.0.0",
    "sqlite-vec": "^0.1.0",
    "web-tree-sitter": "^0.24.0",
    "tree-sitter-javascript": "^0.23.0",
    "tree-sitter-typescript": "^0.23.0",
    "tree-sitter-python": "^0.23.0",
    "tree-sitter-go": "^0.23.0",
    "tree-sitter-java": "^0.23.0",
    "tree-sitter-cpp": "^0.23.0",
    "simple-git": "^3.25.0",
    "p-limit": "^6.0.0",
    "express": "^4.19.2",
    "dotenv": "^16.4.5",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/better-sqlite3": "^7.6.10",
    "@types/express": "^4.17.21",
    "typescript": "^5.5.0"
  },
  "scripts": {
    "dev": "node --experimental-strip-types src/server/mcp_server.ts",
    "build": "tsc",
    "start": "node dist/server/mcp_server.js",
    "bootstrap": "node --experimental-strip-types src/ingestion/bootstrap.ts"
  }
}
```

### 2.3 Model Selection

| Purpose | Model | Format | Dims | License | Rationale |
|---|---|---|---|---|---|
| **Embedding** | `nomic-embed-text-v1.5` | Q8_0 GGUF | 768 | Apache 2.0 | Strong general-purpose + code retrieval, mature & well-tested |
| **Reranking** | `Xenova/ms-marco-MiniLM-L-6-v2` | ONNX (q8) | N/A | MIT | Best quality/speed for lightweight cross-encoder |

Embedding runs via `node-llama-cpp` (loads GGUF). Reranker runs via `@huggingface/transformers` (ONNX, model ID: `Xenova/ms-marco-MiniLM-L-6-v2`).

### 2.4 Environment Variables (.env)

```bash
BITBUCKET_WORKSPACE=your-workspace
BITBUCKET_AUTH_TOKEN=your-auth-token
BITBUCKET_REPOS=workspace/repo-a,workspace/repo-b,workspace/repo-c
DATABASE_PATH=./code_brain.db
REPOS_DIR=./repos
EMBEDDING_MODEL_PATH=./models/nomic-embed-text-v1.5.Q8_0.gguf
# Phase 2 (webhook):
# WEBHOOK_SECRET=your-random-secret-256-bits
# PORT=3000
```

---

## 3. PROJECT STRUCTURE

```
internal-code-brain/
├── package.json
├── tsconfig.json
├── schema.sql
├── .env
├── .gitignore
├── models/                          # ← GGUF model files (gitignored)
│   └── nomic-embed-text-v1.5.Q8_0.gguf
├── repos/                           # ← Git clones live here (gitignored)
│   ├── workspace/repo-a/
│   └── workspace/repo-b/
├── src/
│   ├── lib/
│   │   ├── db.ts                    # SQLite init + sqlite-vec + schema
│   │   ├── worker_pool.ts           # Generic worker thread pool
│   │   ├── git.ts                   # Git clone/pull helpers (simple-git)
│   │   └── hybrid_search.ts         # RRF search pipeline
│   ├── workers/
│   │   ├── ai.worker.ts             # Embedding + reranking inference
│   │   └── parser.worker.ts         # Tree-sitter CAST chunking
│   ├── ingestion/
│   │   ├── sync_handler.ts          # Webhook event processor
│   │   ├── bootstrap.ts             # Clone repos + initial bulk indexing CLI
│   │   └── cleanup.ts               # Cascading file deletion
│   └── server/
│       ├── mcp_server.ts            # MCP protocol server (stdio)
│       ├── webhook_server.ts        # Express webhook handler
│       └── tools/
│           ├── search_semantic_code.ts
│           ├── search_exact_match.ts
│           ├── read_full_file.ts
│           ├── get_file_dependencies.ts
│           ├── check_dependency_usage.ts
│           └── get_project_info.ts
└── tests/
    ├── search.test.ts
    └── benchmark.ts
```

> [!IMPORTANT]
> Add `repos/` to `.gitignore` — it contains full repo clones and should never be committed.
