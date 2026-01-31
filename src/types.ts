export interface SecurityPattern {
  id: string;
  name: string;
  regex: RegExp;
  fixPrompt: string;
}

export interface SecurityIssue {
  file: string;
  line: number;
  patternId: string;
  patternName: string;
  fixPrompt: string;
  match: string;
}

export interface InitResult {
  success: boolean;
  message: string;
  path: string;
}

export interface IssueSummary {
  [patternName: string]: number;
}
