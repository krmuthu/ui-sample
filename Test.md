Phase 0 — Machine Prerequisites (Day 1, ~2 hours)
Before writing a single line of code, validate your environment.
Minimum hardware: 16 GB RAM, any modern CPU with AVX2 support (run grep avx2 /proc/cpuinfo on Linux or check System Info on Windows). 8 GB is technically possible but you'll need to lazy-load models.
Software checklist:

Node.js v18+ (node --version)
Python 3.10+ with venv support (python3 --version)
Git CLI (git --version)
A C/C++ compiler for llama-cpp-python to compile against (gcc --version or Visual Studio Build Tools on Windows)

Download your three GGUF models first — this takes time and you want them ready:
Qwen2.5-Coder-7B-Instruct.Q5_K_M.gguf       (~5.5 GB)
snowflake-arctic-embed-l-v2.0.Q8_0.gguf      (~600 MB)
bge-reranker-v2-m3.Q8_0.gguf                 (~600 MB)
Store them in a single permanent folder like ~/rag-models/. They never move.

Phase 1 — Python Inference Engine (Days 2–3)
Build and validate this in complete isolation before touching TypeScript. If the models don't load and respond correctly here, nothing downstream works.
Project structure:
rag-python/
├── venv/
├── main.py
├── models.py          ← model loading logic, isolated here
├── routers/
│   ├── embed.py
│   ├── rerank.py
│   └── generate.py
└── requirements.txt
Install order matters:
bashpython3 -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install llama-cpp-python compiled for CPU AVX2
CMAKE_ARGS="-DLLAMA_AVX2=on" pip install llama-cpp-python --no-binary llama-cpp-python

pip install fastapi uvicorn
models.py — load once, serve forever:
pythonfrom llama_cpp import Llama

class ModelRegistry:
    def __init__(self):
        self.embedder = None
        self.reranker = None
        self.generator = None  # lazy-loaded to save RAM

    def load_all(self, models_dir: str):
        print("Loading embedder...")
        self.embedder = Llama(
            model_path=f"{models_dir}/snowflake-arctic-embed-l-v2.0.Q8_0.gguf",
            embedding=True,
            n_ctx=512,
            n_threads=8,
            verbose=False
        )

        print("Loading reranker...")
        self.reranker = Llama(
            model_path=f"{models_dir}/bge-reranker-v2-m3.Q8_0.gguf",
            embedding=True,   # reranker scores via embedding similarity
            n_ctx=1024,
            n_threads=8,
            verbose=False
        )
        print("All base models ready.")

    def load_generator(self, models_dir: str):
        if self.generator is None:
            print("Lazy-loading generator...")
            self.generator = Llama(
                model_path=f"{models_dir}/Qwen2.5-Coder-7B-Instruct.Q5_K_M.gguf",
                n_ctx=8192,
                n_threads=8,
                n_gpu_layers=0,  # pure CPU
                verbose=False
            )

registry = ModelRegistry()
main.py — the server:
pythonfrom fastapi import FastAPI
from contextlib import asynccontextmanager
from models import registry
import os

MODELS_DIR = os.environ.get("MODELS_DIR", "/home/yourname/rag-models")

@asynccontextmanager
async def lifespan(app: FastAPI):
    registry.load_all(MODELS_DIR)
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/health")
def health():
    return {
        "embedder": registry.embedder is not None,
        "reranker": registry.reranker is not None,
        "generator": registry.generator is not None,
    }
Three endpoints to build:
POST /embed — takes {"text": "..."}, returns {"vector": [0.12, -0.04, ...]}
POST /rerank — takes {"query": "...", "chunks": ["...", "..."]}, returns {"scores": [0.92, 0.34, ...]} — TypeScript sorts by score and picks top 3
POST /generate — takes {"prompt": "..."}, streams tokens back using FastAPI's StreamingResponse
Validation gate: Before moving to Phase 2, run these manually with curl or the auto-generated /docs page (FastAPI provides this free). Confirm vectors come back as float arrays, reranker scores are between 0–1, and the generator streams text.

Phase 2 — SQLite Vector Database (Day 4)
This is your persistent memory. Get the schema right now because changing it later forces a full re-index.
Install sqlite-vec:
bashnpm install better-sqlite3 sqlite-vec
Database schema — build this once:
sql-- stores every indexed repository
CREATE TABLE repositories (
    id          INTEGER PRIMARY KEY,
    name        TEXT NOT NULL,
    remote_url  TEXT NOT NULL,
    local_path  TEXT NOT NULL,
    indexed_at  DATETIME,
    schema_ver  INTEGER DEFAULT 1
);

-- stores every code chunk
CREATE TABLE chunks (
    id          INTEGER PRIMARY KEY,
    repo_id     INTEGER REFERENCES repositories(id),
    file_path   TEXT NOT NULL,
    language    TEXT NOT NULL,
    chunk_type  TEXT NOT NULL,   -- 'function', 'class', 'block'
    name        TEXT,            -- function or class name if available
    start_line  INTEGER NOT NULL,
    end_line    INTEGER NOT NULL,
    content     TEXT NOT NULL,
    content_hash TEXT NOT NULL,  -- sha256 of content, for incremental updates
    embedded_at DATETIME
);

-- the vector table (sqlite-vec syntax)
CREATE VIRTUAL TABLE chunk_vectors USING vec0(
    chunk_id    INTEGER,
    embedding   FLOAT[1024]     -- match your embedder's output dimension
);
```

The `content_hash` column is critical — it's what enables incremental re-indexing later. If a file's chunks hash to the same value as what's stored, you skip re-embedding them.

---

## Phase 3 — TypeScript Orchestrator (Days 5–7)

This is the largest piece. Build it in layers, testing each layer before adding the next.

**Project structure:**
```
rag-ts/
├── src/
│   ├── index.ts           ← MCP server entry point
│   ├── db/
│   │   ├── client.ts      ← SQLite connection singleton
│   │   └── queries.ts     ← all SQL in one place
│   ├── indexer/
│   │   ├── cloner.ts      ← git clone/pull logic
│   │   ├── walker.ts      ← file system traversal
│   │   ├── parser.ts      ← tree-sitter chunking
│   │   └── embedder.ts    ← calls Python /embed
│   ├── retrieval/
│   │   ├── search.ts      ← sqlite-vec vector search
│   │   └── reranker.ts    ← calls Python /rerank
│   ├── generator.ts       ← calls Python /generate, handles stream
│   └── python.ts          ← health check + startup guard
├── package.json
└── tsconfig.json
Install dependencies:
bashnpm install @modelcontextprotocol/sdk better-sqlite3 sqlite-vec \
            tree-sitter tree-sitter-typescript tree-sitter-javascript \
            tree-sitter-python tree-sitter-go ignore chokidar
npm install -D typescript @types/node @types/better-sqlite3 tsx
Layer 1 — Python health guard (python.ts):
typescriptexport async function waitForPython(url: string, maxAttempts = 30) {
    for (let i = 0; i < maxAttempts; i++) {
        try {
            const res = await fetch(`${url}/health`);
            const data = await res.json();
            if (data.embedder && data.reranker) return true;
        } catch {}
        await new Promise(r => setTimeout(r, 2000));
        console.log(`Waiting for Python inference engine... (${i + 1}/${maxAttempts})`);
    }
    throw new Error("Python server failed to start. Check your models path.");
}
Layer 2 — The parser (parser.ts) — most important logic:
The chunking strategy is the foundation of retrieval quality.
typescriptimport Parser from 'tree-sitter';
import TypeScript from 'tree-sitter-typescript';

const CHUNK_NODE_TYPES = new Set([
    'function_declaration',
    'method_definition', 
    'class_declaration',
    'arrow_function',
    'function_expression'
]);

const MAX_CHUNK_TOKENS = 400;  // ~1600 chars, fits in embedder context

export function chunkFile(filePath: string, source: string, language: string) {
    const parser = new Parser();
    parser.setLanguage(getLanguage(language));
    
    const tree = parser.parse(source);
    const chunks: Chunk[] = [];
    
    function walk(node: Parser.SyntaxNode) {
        if (CHUNK_NODE_TYPES.has(node.type)) {
            const text = source.slice(node.startIndex, node.endIndex);
            
            if (text.length > MAX_CHUNK_TOKENS * 4) {
                // Too large — split into overlapping windows
                splitWithOverlap(text, node, chunks, filePath);
            } else {
                chunks.push({
                    filePath,
                    chunkType: node.type,
                    name: extractName(node, source),
                    startLine: node.startPosition.row + 1,
                    endLine: node.endPosition.row + 1,
                    content: text
                });
            }
            return; // don't recurse into matched nodes
        }
        node.children.forEach(walk);
    }
    
    walk(tree.rootNode);
    return chunks;
}
Layer 3 — MCP tool exposure (index.ts):
typescriptimport { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({ name: "codebase-rag", version: "1.0.0" });

server.tool(
    "ask_codebase",
    "Ask a question about the indexed codebase. Returns relevant code snippets with file paths.",
    { question: z.string().describe("Your question about the codebase") },
    async ({ question }) => {
        const vector = await embed(question);
        const topChunks = await vectorSearch(vector, 10);
        const reranked = await rerank(question, topChunks);
        const answer = await generate(question, reranked.slice(0, 3));
        return { content: [{ type: "text", text: answer }] };
    }
);

server.tool(
    "index_repository",
    "Clone and index a Git repository into the RAG system.",
    { 
        repoUrl: z.string().describe("Git repository URL"),
        name: z.string().describe("Short name for this repo")
    },
    async ({ repoUrl, name }) => {
        await cloneOrPull(repoUrl, name);
        await indexRepository(name);
        return { content: [{ type: "text", text: `Indexed ${name} successfully.` }] };
    }
);

server.tool(
    "list_repositories",
    "List all repositories currently indexed in the RAG system.",
    {},
    async () => {
        const repos = getIndexedRepos();
        return { content: [{ type: "text", text: JSON.stringify(repos, null, 2) }] };
    }
);

const transport = new StdioServerTransport();
await server.connect(transport);

Phase 4 — Windsurf Integration (Day 8)
Register your MCP server in Windsurf's config. The file is typically at:

Linux/Mac: ~/.codeium/windsurf/mcp_config.json
Windows: %APPDATA%\Codeium\windsurf\mcp_config.json

json{
  "mcpServers": {
    "codebase-rag": {
      "command": "node",
      "args": ["/absolute/path/to/rag-ts/dist/index.js"],
      "env": {
        "PYTHON_URL": "http://localhost:8000",
        "DB_PATH": "/home/yourname/.rag-data/codebase.db",
        "REPOS_DIR": "/home/yourname/.rag-data/repos"
      }
    }
  }
}
You also need a small startup script that launches the Python server first, then the Node process. A simple shell script or package.json "start" script using concurrently works:
bash# start.sh
source ~/rag-python/venv/bin/activate
MODELS_DIR=~/rag-models uvicorn main:app --port 8000 &
PYTHON_PID=$!

sleep 2  # give uvicorn a moment, the health check will handle the rest
node /path/to/rag-ts/dist/index.js

kill $PYTHON_PID

Phase 5 — Incremental Updates & File Watching (Day 9)
Once baseline is working, add chokidar to watch indexed repos for changes:
typescriptimport chokidar from 'chokidar';

export function watchRepository(repoPath: string, repoId: number) {
    chokidar.watch(repoPath, {
        ignored: /(node_modules|\.git|dist|build)/,
        persistent: true,
        ignoreInitial: true
    }).on('change', async (filePath) => {
        console.log(`Re-indexing changed file: ${filePath}`);
        await reindexFile(filePath, repoId);
    }).on('add', async (filePath) => {
        await reindexFile(filePath, repoId);
    }).on('unlink', (filePath) => {
        deleteChunksForFile(filePath, repoId);
    });
}
```

The `content_hash` you stored in Phase 2 means `reindexFile` only calls `/embed` if the content actually changed — not on every save.

---

## The Full Build Sequence
```
Day 1    →  Machine setup, model downloads, verify AVX2
Day 2-3  →  Python inference engine, validate all 3 endpoints with curl
Day 4    →  SQLite schema, test vector insert + query manually
Day 5    →  TypeScript project setup, DB client, health guard
Day 6    →  Tree-sitter parser, test chunking on a real repo
Day 7    →  Embedder → vector search → reranker pipeline
Day 8    →  Generator streaming + MCP tool registration + Windsurf config
Day 9    →  File watcher, incremental re-indexing
Day 10   →  End-to-end test with a real codebase, tune chunk size

RAM Budget Summary
ComponentRAM UsagePython runtime + FastAPI~300 MBSnowflake embedder (Q8_0)~650 MBBGE reranker (Q8_0)~650 MBQwen generator (Q5_K_M)~5.5 GBNode.js + SQLite~200 MBTotal~7.3 GB
On a 16 GB machine you have comfortable headroom. On 8 GB, keep the generator lazy-loaded and consider dropping it to Q4_K_M (~4.2 GB) — quality drops slightly but it works.

The One Thing That Will Make or Break Quality
Your chunking strategy in Phase 3 Layer 2 is more important than model choice. Bad chunks = bad retrieval = wrong answers even with great models. Spend real time here. Test it by running the parser on 5 different repos and manually reading the output chunks before you embed anything.
