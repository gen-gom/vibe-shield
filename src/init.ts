import { writeFileSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import type { InitResult } from "./types";

const CURSORRULES_CONTENT = `# Vibe Shield Security Rules

Before marking a task as done, run \`npx vibe-shield\`. If issues are found, follow the [INSTRUCTION] provided in the output to fix them.

## Security Checklist
- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] No dangerous code execution (eval, shell injection)
- [ ] No SQL injection vulnerabilities (use parameterized queries)
- [ ] All secrets stored in environment variables
- [ ] HTTPS used for all external URLs
`;

/**
 * Initialize vibe-shield in a project by creating or appending to .cursorrules file.
 */
export function initVibeShield(dir: string): InitResult {
  const cursorrulesPath = join(dir, ".cursorrules");

  // Check if file already exists
  if (existsSync(cursorrulesPath)) {
    try {
      const existingContent = readFileSync(cursorrulesPath, "utf-8");

      // Check if vibe-shield rules are already present
      if (existingContent.includes("vibe-shield") || existingContent.includes("Vibe Shield")) {
        return {
          success: false,
          message: "Vibe Shield rules already exist in .cursorrules",
          path: cursorrulesPath,
        };
      }

      // Append to existing file
      const newContent = existingContent + "\n\n" + CURSORRULES_CONTENT;
      writeFileSync(cursorrulesPath, newContent, "utf-8");

      return {
        success: true,
        message: "Vibe Shield rules appended to existing .cursorrules",
        path: cursorrulesPath,
      };
    } catch (err) {
      return {
        success: false,
        message: `Failed to update .cursorrules: ${err instanceof Error ? err.message : "Unknown error"}`,
        path: cursorrulesPath,
      };
    }
  }

  // Create new file
  try {
    writeFileSync(cursorrulesPath, CURSORRULES_CONTENT, "utf-8");
    return {
      success: true,
      message: ".cursorrules created successfully!",
      path: cursorrulesPath,
    };
  } catch (err) {
    return {
      success: false,
      message: `Failed to create .cursorrules: ${err instanceof Error ? err.message : "Unknown error"}`,
      path: cursorrulesPath,
    };
  }
}
