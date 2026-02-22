step-by-step implementation plan to build your Internal Code Brain.
This plan is structured into five distinct phases, moving from the foundational database setup up to the final Windsurf integration.
Phase 1: Foundation & Infrastructure
Before we fetch any data, we need the local engine running smoothly on your machine.
1. Initialize the Project: Set up a Node.js/TypeScript project. Install core dependencies: @modelcontextprotocol/sdk, better-sqlite3, sqlite-vec, axios, cheerio, and p-limit.
2. Configure the Database (db.ts): * Initialize SQLite in WAL (Write-Ahead Logging) mode for concurrent read/writes.
• Load the sqlite-vec extension.
• Create the schema: Base tables (confluence_pages, jira_issues), relational bridge tables (pr_jira_links, jira_confluence_links), and virtual tables (fts_confluence, vec_confluence).
3. Setup Local AI Workers (worker_pool.ts):
• Integrate nomic-embed-text for lightning-fast local 768-dimensional embeddings.
• Integrate qwen2.5-coder (via local LLM runner like Ollama or Llama.cpp) for query expansion and PR/Jira summarization.
Phase 2: The Ingestion Engine (The "Breadcrumb" Pipeline)
This is where we pull the data from Atlassian and Git without bloating the database.
1. Global Seeding (bootstrap.ts):
• Write the CQL (Confluence Query Language) fetcher to download "Golden Pages" tagged with mcp-global-context.
• Parse the Acronym Glossary into local memory.
• Chunk the Golden Pages, inject the [Scope: GLOBAL ENTERPRISE STANDARD] header, embed, and store them.
2. Git & PR Synchronization (sync_handler.ts):
• Use tree-sitter to parse your local Bitbucket repositories into AST code chunks.
• Fetch the merged Pull Requests associated with recent file changes.
3. Targeted Atlassian Fetching:
• Jira: Run regex on PR descriptions. Fetch the extracted Jira IDs. Implement the recursive fetch to grab the parent Story and Epic. Send them to qwen2.5-coder for condensation.
• Confluence: Hit the Jira /remotelink API. Fetch attached Confluence XML. Use cheerio to strip HTML, extract Mermaid/Base64 diagram URLs, chunk the text, embed it, and save it to the DB.
Phase 3: The Hybrid Intelligence Engine
Now we build the retrieval system so Windsurf can actually find what it needs.
1. Query Expansion:
• Intercept incoming queries. If the query contains an acronym (like "CASA"), pass it to the local LLM worker to expand it to "Current Account Savings Account" using the loaded glossary.
2. Dual-Execution Search (hybrid_search.ts):
• Send the expanded query to the sqlite-vec tables (for semantic conceptual matching).
• Send the expanded query to the FTS5 tables (for exact keyword/regex matching).
3. Mathematical Merging (RRF):
• Combine both result sets in Node.js using the Reciprocal Rank Fusion formula: Score = \frac{1}{60 + Rank_{vec}} + \frac{1}{60 + Rank_{fts}}
• Multiply the final score by 1.5 if the chunk originated from a Global Context page.
Phase 4: The MCP Server (The Live Bridge)
This exposes your local intelligence to Windsurf via the Model Context Protocol.
1. Initialize the Server (mcp_server.ts): Set up the standard MCP JSON-RPC endpoints.
2. Build the Tools:
• Register search_semantic_code, search_architecture, and graph tracing tools.
3. Implement the "Live Proxy" Fallback:
• In get_ticket_context, write the logic that checks SQLite first. If it returns null (cache miss), dynamically fire an Axios request to the live Jira REST API, condense the response, and return it instantly to Windsurf.
4. Implement Vision Pass-Through:
• Update search_architecture to detect if a chunk has an associated diagram. Fetch the diagram binary from Confluence, convert it to Base64, and append it to the MCP response array as an image type block.
Phase 5: Integration & Activation
1. Connect Windsurf: Add your local Node.js server path to Windsurf's MCP configuration file (usually in the IDE settings).
2. Inject the Brain: Paste the "INTERNAL CODE BRAIN: SYSTEM PROMPT" we finalized into your workspace's .windsurfrules file.
3. End-to-End Test: Open a file in Windsurf and type: "Implement PROJ-999". Watch the MCP server logs as it expands acronyms, fetches Jira, checks Confluence architecture, and streams perfect code into your editor.
