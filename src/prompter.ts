import type { SecurityIssue, IssueSummary, Severity } from "./types";

const severityColors: Record<Severity, string> = {
  critical: "\x1b[31m", // red
  high: "\x1b[33m", // yellow
  medium: "\x1b[36m", // cyan
  low: "\x1b[37m", // white
};

const reset = "\x1b[0m";

/**
 * Format issues into an "Agent Protocol" string that AI agents can read and act on.
 */
export function formatAgentPrompt(issues: SecurityIssue[], useColors = true): string {
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
    const severityLabel = issue.severity.toUpperCase();
    const color = useColors ? severityColors[issue.severity] : "";
    const colorReset = useColors ? reset : "";

    lines.push(
      `${color}[${severityLabel}]${colorReset} [TASK ${index + 1}] Fix ${issue.patternName} in ${issue.file} at line ${issue.line}`
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

/**
 * Generate severity summary
 */
export function generateSeveritySummary(
  issues: SecurityIssue[]
): Record<Severity, number> {
  const summary: Record<Severity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  for (const issue of issues) {
    summary[issue.severity]++;
  }

  return summary;
}

/**
 * Format issues as JSON for CI/CD pipelines
 */
export function formatJson(
  issues: SecurityIssue[],
  warnings: string[]
): string {
  return JSON.stringify(
    {
      summary: {
        total: issues.length,
        bySeverity: generateSeveritySummary(issues),
        byType: generateSummary(issues),
      },
      issues: issues.map((issue) => ({
        severity: issue.severity,
        type: issue.patternName,
        file: issue.file,
        line: issue.line,
        match: issue.match,
        fix: issue.fixPrompt,
      })),
      warnings,
    },
    null,
    2
  );
}
