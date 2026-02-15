# Deployment & Verification

> **Navigation:** [← Phase 2: Webhooks](./phase2-webhooks.md) · [Overview](./OVERVIEW.md)

---

## 10. DEPLOYMENT

### MCP Client Config (Windsurf / Cursor)

```json
{
  "mcpServers": {
    "internal-code-brain": {
      "command": "node",
      "args": ["--experimental-strip-types", "/path/to/src/server/mcp_server.ts"],
      "env": {
        "DATABASE_PATH": "/path/to/code_brain.db",
        "EMBEDDING_MODEL_PATH": "/path/to/models/nomic-embed-text-v1.5.Q8_0.gguf"
      }
    }
  }
}
```

### Quick Start

```bash
# 1. Install Node 24 LTS
nvm install 24 && nvm use 24

# 2. Install deps
npm install

# 3. Download the GGUF embedding model
mkdir -p models
curl -L -o models/nomic-embed-text-v1.5.Q8_0.gguf \
  https://huggingface.co/nomic-ai/nomic-embed-text-v1.5-GGUF/resolve/main/nomic-embed-text-v1.5.Q8_0.gguf

# 4. Configure
cp .env.example .env  # Edit with Bitbucket credentials

# 5. Bootstrap (clones repos into ./repos/ + indexes all code)
npm run bootstrap

# 6. Start MCP server (for Windsurf/Cursor)
npm run dev
```

> [!NOTE]
> Bootstrap clones all repos into `./repos/`, indexes all code files.
> To re-sync later, just re-run `npm run bootstrap` — it will `git pull` instead of re-cloning.
> Webhook-based real-time sync is planned for **Phase 2**.

---

## 11. VERIFICATION

| Test | Command | Expected |
|---|---|---|
| DB init | `node --experimental-strip-types -e "import './src/lib/db.ts'"` | `✓ sqlite-vec loaded`, `✓ schema initialized` |
| Embedding | AI worker returns 768-dim Float32Array | dim=768 |
| CAST chunking | Parse TS class → each method is separate chunk | Syntactically complete |
| Hybrid search | Ingest sample, query by concept + identifier | Both return relevant results |
| File deps | Ingest project with imports, query `get_file_dependencies` | Correct import graph |
| Search latency | 5 queries against 10k chunks | P95 < 500ms |
