import type { SecurityIssue, IssueSummary } from "./types";

/**
 * Format issues into an "Agent Protocol" string that AI agents can read and act on.
 */
export function formatAgentPrompt(issues: SecurityIssue[]): string {
  if (!issues || issues.length === 0) {
    return "";
  }

  const lines: string[] = [
    "═══════════════════════════════════════════════════════════════",
    "  HEY AGENT, PLEASE FIX THE FOLLOWING SECURITY ISSUES:",
    "═══════════════════════════════════════════════════════════════",
    "",
  ];

  issues.forEach((issue, index) => {
    lines.push(
      `[TASK ${index + 1}] Fix ${issue.patternName} in ${issue.file} at line ${issue.line}`
    );
    lines.push(`[FOUND]: ${issue.match}`);
    lines.push(`[INSTRUCTION]: ${issue.fixPrompt}`);
    lines.push("");
  });

  lines.push("═══════════════════════════════════════════════════════════════");
  lines.push(`  Total issues: ${issues.length}`);
  lines.push("═══════════════════════════════════════════════════════════════");

  return lines.join("\n");
}

/**
 * Generate a summary of issues by type.
 */
export function generateSummary(issues: SecurityIssue[]): IssueSummary {
  const summary: IssueSummary = {};

  for (const issue of issues) {
    if (!summary[issue.patternName]) {
      summary[issue.patternName] = 0;
    }
    summary[issue.patternName]++;
  }

  return summary;
}
