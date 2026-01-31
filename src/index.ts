export { scanFiles } from "./scanner";
export {
  formatAgentPrompt,
  generateSummary,
  generateSeveritySummary,
  formatJson,
} from "./prompter";
export { initVibeShield } from "./init";
export { securityPatterns } from "./patterns";
export type {
  SecurityPattern,
  SecurityIssue,
  InitResult,
  IssueSummary,
  ScanResult,
  Severity,
} from "./types";
