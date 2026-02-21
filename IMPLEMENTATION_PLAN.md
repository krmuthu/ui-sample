Here are the two follow-up workflows to complete your development lifecycle.

Now that you have /create-plan to design the architecture, you can use /implement-plan to safely write the code using enterprise context, and /verify-code to rigorously audit the final output before committing.

1. The Implementation Workflow
Save this file as .windsurf/workflows/implement-plan.md. This workflow guides the AI to execute the steps in your plan while actively using the Code Brain to fetch real syntax, preventing it from guessing how internal libraries work.

Enterprise Plan Implementation
Description: Executes an existing implementation plan step-by-step, actively querying the Internal Code Brain MCP to fetch exact syntax, internal APIs, and enterprise coding standards before writing code.

Instructions
Cascade, please execute the following steps in order:

Read the Plan: Locate and read the IMPLEMENTATION_PLAN.md file in the root directory. Identify the next unchecked step.

Contextual Retrieval (MCP): Before writing any code for this step, identify the core internal components needed.

Invoke find_symbol to fetch the exact Abstract Syntax Tree (AST) definition and parameters of any internal classes or functions you are about to use.

Invoke search_semantic_code with source="examples" to pull curated enterprise examples of how this specific logic should be implemented.

Code Generation: Write the code for the current step. Ensure you strictly follow the syntax and patterns returned by the MCP tools in Step 2.

Local Integration Check (MCP): If you created a new internal utility or modified a core file, invoke get_file_dependencies to ensure the new imports align with the project's existing architecture.

Update Plan & Pause: Update IMPLEMENTATION_PLAN.md by checking off the completed step (- [x]). Summarize what was just built and ask the user if you should proceed to the next step.

2. The Verification & Audit Workflow
Save this file as .windsurf/workflows/verify-code.md. This acts as your automated enterprise security and quality gate. It ensures the AI didn't hallucinate dependencies and maps out the "blast radius" of the new code.

Enterprise Code Verification & Audit
Description: Performs a rigorous pre-commit audit on all modified code, utilizing the Internal Code Brain MCP to detect AI hallucinations, validate dependencies, and assess cross-repository impact.

Instructions
Cascade, please execute the following steps in order:

Diff Analysis: Review all uncommitted changes in the current workspace. Identify all newly added functions, modified logic, and new imports.

Hallucination Audit (MCP): Extract all internal function calls, class instantiations, and type references from the new code. Invoke the check_ai_hallucinations MCP tool to verify that every single identifier actually exists in the enterprise AST knowledge graph.

Dependency Audit (MCP): Identify any new external packages added to package.json, requirements.txt, etc. Invoke the check_dependency_usage MCP tool to verify if this package version is approved and currently used by other enterprise repositories.

Blast Radius / Impact Analysis (MCP): For every existing core file that was modified, invoke query_knowledge_graph using query_type="call_chain". Map out the downstream services or internal repositories that rely on this modified code to ensure we haven't introduced breaking changes.

Audit Report Generation: Create a final summary for the developer.

If hallucinations are detected, immediately flag them as CRITICAL and propose the correct internal symbol.

List the blast radius (who is affected by these changes).

Provide a final "Pass/Fail" grade for enterprise compliance.

How to use the complete lifecycle in Windsurf:
Start: Type /create-plan build a new payment gateway -> Windsurf creates your checklist.

Build: Type /implement-plan -> Windsurf reads the first step, fetches your internal API docs via SQLite, writes the code, and checks off the box.

Audit: Type /verify-code -> Windsurf double-checks its own work against the AST graph to guarantee it didn't invent fake internal functions.
