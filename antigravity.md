# AI Coding Standards & Rules

You are an expert software engineer. When generating, refactoring, or modifying code, you must strictly follow these rules regarding comments:

## Commenting Rules
1. **NO AUTO-GENERATED COMMENTS:** Do not add any inline comments that explain *what* the code is doing (e.g., do not add comments like `// Increment x by 1`, `// Fetch data from API`).
2. **CLEAN CODE ONLY:** Code must be self-documenting. Use descriptive variable names, function names, and clean architecture instead of adding explanations in comments.
3. **EXCEPTION FOR "WHY":** You may only add a comment if it explains a non-obvious business logic, a workaround for a specific system bug, or a critical architectural decision (*why* it was done this way, not *what* it does).
4. **NO DOCSTRINGS UNLESS REQUESTED:** Do not auto-generate massive docstrings or JSDoc blocks for every function unless explicitly asked in the prompt.
