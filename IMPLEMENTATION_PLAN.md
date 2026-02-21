Here is the enhanced "Universal Implementation Plan Generator" workflow that actively integrates your Internal Code Brain MCP tools. This ensures that any new plan automatically aligns with your enterprise's existing architecture, reuses internal code, and strictly uses approved dependencies.

You can update your .windsurf/workflows/create-plan.md file with this version:

Universal Enterprise Implementation Plan Generator
Description: Creates a step-by-step implementation plan for any task while leveraging the Internal Code Brain MCP to ensure enterprise alignment, reuse existing code, and validate dependencies.

Instructions
Cascade, please execute the following steps in order:

Context Gathering: Ask the user what feature, bug fix, or project they want to build if they haven't specified it.

Enterprise Discovery (MCP): Before planning new logic, invoke the search_semantic_code MCP tool using the core concepts of the user's request. Identify if a similar feature, class, or utility already exists in the internal codebase to prevent duplicated effort.

Dependency Planning (MCP): Identify the key libraries or packages needed for this task. Invoke the check_dependency_usage MCP tool to see if these libraries are already approved and used in other enterprise repositories, and note the standard version to use.

Impact Analysis (MCP): If this task involves modifying an existing core feature, invoke the query_knowledge_graph tool (using query_type="call_chain") or the get_file_dependencies tool on the target files to map out the blast radius of the proposed changes.

Task Breakdown: Break the objective into actionable phases (e.g., Phase 1: Setup, Phase 2: Core Logic, Phase 3: Integration, Phase 4: Testing).

Document Generation: Create a new file named IMPLEMENTATION_PLAN.md in the root directory. Format the breakdown as a strict Markdown checklist (- [ ]). In the document, explicitly reference any internal enterprise functions found in Step 2 that should be reused, and list the approved dependencies found in Step 3.

Execution Handoff: Present a brief summary of the generated plan. Remind the user to review the markdown file and suggest turning on Windsurf's "Planning Mode" to begin execution.

By embedding these specific MCP tool calls (search_semantic_code, check_dependency_usage, and query_knowledge_graph), the AI will stop giving generic, boilerplate implementation steps. Instead, it will proactively query your SQLite vector database and AST graph to generate a plan custom-tailored to how your organization already writes software.

Once saved, developers can run this by simply typing /create-plan in the chat, and Cascade will sequentially process each MCP tool step before generating the final checklist document.
