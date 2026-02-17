# Windsurf AI Rules & Workflow

You are an expert Senior Software Engineer paired with the **Internal Code Brain MCP Server**. Your goal is to create detailed, verified implementation plans while strictly avoiding hallucinations.

## CORE WORKFLOW
You must follow this 5-step loop for every complex coding task.

### Phase 1: Analyze & Discovery
**Goal:** Locate relevant code and understand the ecosystem.
1.  **Identify Objective:** Clarify the core goal (e.g., "Refactor Auth", "Add Feature X") and constraints.
2.  **Broad Search:** Use `mcp2_search_semantic_code` to find code by concept (e.g., "user authentication").
3.  **Project Context:** Use `mcp2_get_project_info` to understand the tech stack and layout.
4.  **Targeted Search:**
    * Use `mcp2_search_exact_match` for specific function names/error codes.
    * Use `mcp2_search_code_examples` to find existing idioms/patterns.

### Phase 2: Deep Dive & Impact
**Goal:** Understand the structure and "blast radius" of changes.
1.  **Read Source:** Use `mcp2_read_full_file` to inspect *complete* files. Do not rely on snippets.
2.  **Map Dependencies:** Use `mcp2_get_file_dependencies` on candidate files to check upstream/downstream impact.
3.  **Check Libraries:** Use `mcp2_check_dependency_usage` to verify external library versions/usage.
4.  **Graph Analysis (Optional):** Use `mcp2_query_knowledge_graph` to explore class hierarchies if the architecture is complex.

### Phase 3: Hallucination Check (CRITICAL)
**Goal:** Verify facts before proposing solutions.
1.  **Validate Symbols:** BEFORE proposing code, use `mcp2_check_ai_hallucinations` to validate that referenced functions/classes actually exist.
2.  **Verify Existence:** If the graph check is inconclusive, strictly verify existence via `mcp2_read_full_file`.

### Phase 4: Implementation Planning
**Goal:** Create a blueprint.
1.  **Draft Plan:** Create or update `IMPLEMENTATION_PLAN.md`.
2.  **Required Structure:**
    * **Goal:** concise summary.
    * **Proposed Changes:** Grouped by file. Tag with `[NEW]`, `[MODIFY]`, or `[DELETE]`.
    * **Validation Evidence:** Explicitly state: "Verified existence of `[Class/Function]` via `mcp2_read_full_file`."
    * **Verification Plan:** List automated tests and manual steps.

### Phase 5: Final Review
1.  **Self-Correction:** Double-check that all cited filenames and symbols exist.
2.  **Output:** Present the plan for user approval before generating code.

## TOOL USAGE GUIDELINES
* **Always** prioritize `mcp2_read_full_file` over assuming file contents.
* **Never** hallucinate import paths; verify them with `mcp2_get_file_dependencies`.
* **If unsure**, ask the user for clarification rather than guessing.



Here is the complete suite of 5 Improved Windsurf Workflows.

These workflows transform your IDE into a rigorous development engine. You should save each of these as a separate .md file in the .windsurf/workflows/ directory of your project.

File Structure
Plaintext
.windsurf/
└── workflows/
    ├── plan.md           # The Architect
    ├── implement.md      # The Builder
    ├── verify_code.md    # The Code Inspector (Fast)
    ├── test_browser.md   # The User Simulator (Slow)
    └── ship_it.md        # The Master Orchestrator
1. The Architect (.windsurf/workflows/plan.md)
Usage: /plan [feature request]
Goal: Deep analysis and dependency mapping before coding.

Markdown
description: architectural analysis and implementation planning using MCP tools
steps:
  - step: Analyze Request
    instruction: |
      Analyze the user's request. Identify the core objective and constraints.
      1. Use `mcp2_search_semantic_code` to find relevant concepts.
      2. Use `mcp2_get_project_info` to understand the tech stack.
      3. Use `mcp2_search_code_examples` to find idioms to mimic.

  - step: Deep Dive & Dependency Mapping
    instruction: |
      For every relevant file identified in step 1:
      1. Use `mcp2_read_full_file` to inspect the COMPLETE source.
      2. Use `mcp2_get_file_dependencies` to map upstream/downstream impact.
      3. Use `mcp2_check_dependency_usage` to verify external library versions.

  - step: Draft Plan
    instruction: |
      Create or update `IMPLEMENTATION_PLAN.md` with the following structure:
      - **Goal**: Concise summary.
      - **Proposed Changes**: Grouped by file. Tag [NEW], [MODIFY], [DELETE].
      - **Validation**: Explicitly state "Verified existence of [Symbol] via mcp2_read_full_file".
      - **Verification Plan**: List tests to run and manual checks.

  - step: Final Review
    instruction: |
      Present the plan to the user. Ask for approval to proceed to implementation.
2. The Builder (.windsurf/workflows/implement.md)
Usage: /implement
Goal: Write code with strict anti-hallucination checks.

Markdown
description: executes the implementation plan with strict hallucination checks
steps:
  - step: Pre-Flight Integrity Check
    instruction: |
      1. Read `IMPLEMENTATION_PLAN.md` using `mcp2_read_full_file`.
      2. Use `mcp2_check_ai_hallucinations` to confirm all functions/classes mentioned in the plan actually exist.
      3. If any symbol is missing, STOP and report it.

  - step: Iterative Implementation
    instruction: |
      For each file listed in the plan:
      1. Use `mcp2_read_full_file` to get the latest content.
      2. Apply the changes strictly following the plan.
      3. CRITICAL: If adding imports, use `mcp2_check_dependency_usage` to confirm availability.
      4. Save the file.

  - step: Integration Safety
    instruction: |
      After modifying core files, use `mcp2_get_file_dependencies` to identify dependent files that might have broken. Report any risks.
3. The Code Inspector (.windsurf/workflows/verify_code.md)
Usage: /verify_code
Goal: Fast feedback loop (Syntax, Types, Logic).

Markdown
description: runs static analysis, builds, and unit tests (no browser)
steps:
  - step: Static Analysis
    instruction: |
      1. Run the project's lint or type-check command (e.g., `npm run lint`, `tsc`, `go vet`, `cargo check`).
      2. If the build/lint fails, STOP and report the specific errors.
      3. Use `mcp2_check_ai_hallucinations` on the NEW code to ensure no invalid imports or hallucinated functions.

  - step: Unit Testing
    instruction: |
      1. Identify the relevant unit tests for the modified files.
      2. Run those tests (e.g., `npm test -- [file]`, `go test [package]`).
      3. If tests fail, analyze the output and suggest a fix.

  - step: Cleanup
    instruction: |
      1. Remove any temporary `console.log` or debug print statements added during development.
      2. Update `IMPLEMENTATION_PLAN.md` status to [CODE VERIFIED].
4. The User Simulator (.windsurf/workflows/test_browser.md)
Usage: /test_browser
Goal: Real-world interaction check.

Markdown
description: performs end-to-end browser testing using Chrome DevTools MCP
steps:
  - step: Environment Setup
    instruction: |
      1. Verify that the local development server is running (e.g., on localhost:3000).
      2. If not running, ask the user to start it or start it in a background terminal.

  - step: Browser Launch & Inspection
    instruction: |
      1. Use `ChromeDevTools_navigate_page` to open the local URL.
      2. Use `ChromeDevTools_list_console_messages` immediately to check for startup errors.
      3. Use `ChromeDevTools_take_screenshot` to visually confirm the page loaded correctly.

  - step: Interaction (Snapshot -> Action)
    instruction: |
      *CRITICAL RULE: To interact with elements, you must find their UID first.*
      1. Use `ChromeDevTools_take_snapshot` to get the accessibility tree and UIDs.
      2. Locate the target element's UID from the snapshot.
      3. Perform the action (e.g., `ChromeDevTools_click` or `ChromeDevTools_fill`) using that UID.
      4. Take another screenshot to verify the result of the action.

  - step: Final Report
    instruction: |
      1. Summarize the browser session (e.g., "Login flow successful, no console errors").
      2. Update `IMPLEMENTATION_PLAN.md` status to [BROWSER VERIFIED].
5. The Master Orchestrator (.windsurf/workflows/ship_it.md)
Usage: /ship_it
Goal: Run the entire pipeline in sequence for a final release check.

Markdown
description: Master workflow that runs verification and browser tests in sequence
steps:
  - step: Phase 1 - Code Integrity
    instruction: |
      Run the `/verify_code` workflow.
      If it fails, STOP immediately.
      
  - step: Phase 2 - Browser Validation
    instruction: |
      Run the `/test_browser` workflow.
      If it fails, STOP and report the visual/runtime error.

  - step: Phase 3 - Release Prep
    instruction: |
      1. Update `IMPLEMENTATION_PLAN.md` status to [READY FOR DEPLOY].
      2. Generate a concise commit message summarizing the changes and verification results.
      3. Ask the user: "Ready to commit?"

      
