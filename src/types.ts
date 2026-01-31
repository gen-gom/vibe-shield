export type Severity = "critical" | "high" | "medium" | "low";

export interface SecurityPattern {
  id: string;
  name: string;
  regex: RegExp;
  fixPrompt: string;
  severity: Severity;
}

export interface SecurityIssue {
  file: string;
  line: number;
  patternId: string;
  patternName: string;
  fixPrompt: string;
  match: string;
  severity: Severity;
}

export interface InitResult {
  success: boolean;
  message: string;
  path: string;
}

export interface IssueSummary {
  [patternName: string]: number;
}

export interface ScanResult {
  issues: SecurityIssue[];
  warnings: string[];
}
