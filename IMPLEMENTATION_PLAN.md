# IMPLEMENTATION PLAN: Internal Code Brain — MCP Server

## SQLite-Only Hybrid RAG | Node.js 24 LTS | TypeScript ESM

---

> [!NOTE]
> This plan has been split into focused, phase-wise documents for better navigation.
> Each file is self-contained with cross-navigation links.

## Documentation Index

| # | Document | Sections | Description |
|---|---|---|---|
| 1 | [**OVERVIEW**](docs/OVERVIEW.md) | §1-3 | Executive Summary, Technology Stack, Project Structure |
| 2 | [**Phase 1: Foundation**](docs/phase1-foundation.md) | §4-5 | Database Architecture (SQLite + sqlite-vec + FTS5), Worker Thread Concurrency Model |
| 3 | [**Phase 1: Ingestion**](docs/phase1-ingestion.md) | §7 | Sync Handler, Git Helper, Bootstrap CLI, Tech Stack Detection, Cleanup |
| 4 | [**Phase 1: Search & MCP**](docs/phase1-search-and-mcp.md) | §6, §8 | Hybrid Search Pipeline (RRF + Rerank), MCP Server (6 Tools) |
| 5 | [**Phase 2: Webhooks**](docs/phase2-webhooks.md) | §9 | Webhook Server (Deferred — real-time Bitbucket sync) |
| 6 | [**Deployment**](docs/deployment.md) | §10-11 | MCP Client Config, Quick Start, Verification |

---

## Architecture At-a-Glance

```
┌──────────────────────────────────────────────────────────┐
│                     MCP CLIENT (Windsurf / Cursor)       │
│                         ↕ stdio JSON-RPC                 │
├──────────────────────────────────────────────────────────┤
│  MCP SERVER (src/server/mcp_server.ts)                   │
│  ├── 6 Tools: semantic search, exact match, file read,   │
│  │   dependencies, library usage, project info           │
│  ├── Env validation + graceful shutdown                  │
│  └── Dispatch → hybrid_search.ts / db.ts                 │
├──────────────────────────────────────────────────────────┤
│  SEARCH PIPELINE (src/lib/hybrid_search.ts)              │
│  ├── Query embedding (cache-first, 24h TTL)              │
│  ├── Vector search (sqlite-vec, top 50)                  │
│  ├── FTS5 search (full-text, top 50)                     │
│  ├── RRF Fusion (k=60)                                   │
│  └── Cross-encoder rerank → top K                        │
├──────────────────────────────────────────────────────────┤
│  WORKER THREADS                                          │
│  ├── AI Pool (4 threads)                                 │
│  │   ├── nomic-embed-text-v1.5 (GGUF, 768d)             │
│  │   └── Xenova/ms-marco-MiniLM-L-6-v2 (ONNX)           │
│  └── Parser Pool (2 threads)                             │
│      └── Tree-sitter CAST chunker (6 languages)          │
├──────────────────────────────────────────────────────────┤
│  DATABASE (SQLite + sqlite-vec + FTS5)                   │
│  ├── files, chunks, vec_chunks, fts_chunks               │
│  ├── projects, dependencies, file_imports                │
│  ├── query_embedding_cache, search_metrics               │
│  └── Pragmas: WAL, 64MB cache, 256MB mmap, temp in RAM   │
├──────────────────────────────────────────────────────────┤
│  INGESTION (src/ingestion/)                              │
│  ├── bootstrap.ts — Clone + bulk index                   │
│  ├── sync_handler.ts — Parse, chunk, embed, store        │
│  └── cleanup.ts — Cascading deletion                     │
└──────────────────────────────────────────────────────────┘
```

## Phase Status

| Phase | Scope | Status |
|---|---|---|
| **Phase 1** | Code search (semantic + exact), file read, dependencies, project info | 🔵 Planning Complete |
| **Phase 2** | Webhooks, PR data, real-time sync | ⚪ Deferred |
