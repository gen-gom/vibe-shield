import type { SecurityPattern } from "./types";

/**
 * Security patterns for detecting vulnerabilities in AI-generated code.
 * Focused on high-confidence issues that are actually problems.
 */
export const securityPatterns: SecurityPattern[] = [
  // === SECRETS ===
  {
    id: "hardcoded-secret",
    name: "Hardcoded Secret",
    regex:
      /(?:api_?key|api_?secret|secret_?key|auth_?token|access_?token|private_?key|client_?secret)\s*[:=]\s*['"`][A-Za-z0-9_\-\.\/\+]{8,}['"`]/gi,
    fixPrompt:
      "Move this secret to an environment variable. Add it to .env and use process.env.YOUR_SECRET. Add .env to .gitignore.",
  },
  {
    id: "hardcoded-password",
    name: "Hardcoded Password",
    regex: /(?:password|passwd|pwd)\s*[:=]\s*['"`][^'"`\s]{4,}['"`]/gi,
    fixPrompt:
      "Move this password to an environment variable. Never commit passwords to version control.",
  },
  {
    id: "aws-key",
    name: "AWS Access Key",
    regex: /['"`](AKIA[0-9A-Z]{16})['"`]/g,
    fixPrompt:
      "AWS access key detected. Remove it immediately and rotate the key in AWS console. Use environment variables or AWS IAM roles.",
  },
  {
    id: "jwt-secret-inline",
    name: "Hardcoded JWT Secret",
    regex:
      /jwt\.sign\s*\([^)]+,\s*['"`][^'"`]{8,}['"`]/gi,
    fixPrompt:
      "Move JWT secret to an environment variable. Hardcoded secrets get committed to version control.",
  },

  // === SQL INJECTION ===
  {
    id: "sql-injection-template",
    name: "SQL Injection",
    regex:
      /(?:query|execute)\s*\(\s*`(?:SELECT|INSERT|UPDATE|DELETE|DROP)[^`]*\$\{/gi,
    fixPrompt:
      "Use parameterized queries instead of template literals. Example: query('SELECT * FROM users WHERE id = ?', [userId])",
  },
  {
    id: "sql-injection-concat",
    name: "SQL Injection",
    regex:
      /(?:query|execute)\s*\(\s*['"](?:SELECT|INSERT|UPDATE|DELETE)[^'"]*['"]\s*\+/gi,
    fixPrompt:
      "Never concatenate variables into SQL strings. Use parameterized queries with placeholders.",
  },

  // === COMMAND INJECTION ===
  {
    id: "command-injection",
    name: "Command Injection",
    regex:
      /(?:exec|execSync)\s*\(\s*`[^`]*\$\{/g,
    fixPrompt:
      "Avoid template literals in shell commands. Use spawn() with an array of arguments, or use a library like shell-escape.",
  },
  {
    id: "command-injection-concat",
    name: "Command Injection",
    regex:
      /(?:exec|execSync)\s*\([^)]*\+\s*(?:req\.|user|input|param|query|body)/gi,
    fixPrompt:
      "User input in shell commands allows arbitrary command execution. Use spawn() with argument arrays.",
  },

  // === DANGEROUS FUNCTIONS ===
  {
    id: "eval-usage",
    name: "Dangerous eval()",
    regex: /[=:]\s*eval\s*\(\s*(?:req\.|user|input|param|query|body|data)/gi,
    fixPrompt:
      "eval() with user input allows arbitrary code execution. Use JSON.parse() for JSON, or refactor to avoid eval entirely.",
  },
  {
    id: "new-function",
    name: "Dangerous Function Constructor",
    regex: /new\s+Function\s*\([^)]*(?:req\.|user|input|param|query|body)/gi,
    fixPrompt:
      "new Function() with user input is as dangerous as eval(). Refactor to avoid dynamic code generation.",
  },

  // === XSS ===
  {
    id: "innerhtml-variable",
    name: "XSS via innerHTML",
    regex: /\.innerHTML\s*=\s*(?:req\.|user|input|param|query|body|data|props\.|this\.)/gi,
    fixPrompt:
      "Setting innerHTML with user data enables XSS attacks. Use textContent or sanitize with DOMPurify.",
  },
  {
    id: "react-dangerous-html",
    name: "React XSS Risk",
    regex: /dangerouslySetInnerHTML\s*=\s*\{\s*\{\s*__html\s*:\s*(?:props\.|this\.|data|user|input)/gi,
    fixPrompt:
      "dangerouslySetInnerHTML with user data enables XSS. Sanitize HTML with DOMPurify first.",
  },

  // === CRYPTO ===
  {
    id: "weak-hash-md5",
    name: "Weak Hash (MD5)",
    regex: /createHash\s*\(\s*['"`]md5['"`]\s*\)/g,
    fixPrompt:
      "MD5 is broken. Use crypto.createHash('sha256'). For passwords, use bcrypt or argon2.",
  },
  {
    id: "weak-hash-sha1",
    name: "Weak Hash (SHA1)",
    regex: /createHash\s*\(\s*['"`]sha1['"`]\s*\)/g,
    fixPrompt:
      "SHA1 is deprecated for security. Use crypto.createHash('sha256'). For passwords, use bcrypt or argon2.",
  },

  // === SECURITY MISCONFIG ===
  {
    id: "ssl-disabled",
    name: "SSL Verification Disabled",
    regex: /rejectUnauthorized\s*:\s*false/g,
    fixPrompt:
      "Disabling SSL verification allows man-in-the-middle attacks. Remove this or set to true.",
  },
  {
    id: "cors-wildcard",
    name: "CORS Allows All Origins",
    regex: /['"`]Access-Control-Allow-Origin['"`]\s*[,:]\s*['"`]\*['"`]/g,
    fixPrompt:
      "CORS wildcard (*) allows any website to make requests. Specify allowed origins explicitly.",
  },

  // === PATH TRAVERSAL ===
  {
    id: "path-traversal",
    name: "Path Traversal Risk",
    regex:
      /(?:readFile|writeFile|readFileSync|writeFileSync)\s*\(\s*(?:req\.|user|input|param|query|body)/gi,
    fixPrompt:
      "User input in file paths allows reading/writing arbitrary files. Validate paths with path.resolve() and check they're within allowed directories.",
  },

  // === NOSQL INJECTION ===
  {
    id: "nosql-where",
    name: "NoSQL Injection ($where)",
    regex: /\.(find|findOne)\s*\(\s*\{[^}]*\$where\s*:/g,
    fixPrompt:
      "$where executes JavaScript and enables NoSQL injection. Use standard MongoDB query operators.",
  },

  // === PYTHON ===
  {
    id: "pickle-load",
    name: "Insecure Pickle (Python)",
    regex: /pickle\.loads?\s*\(\s*(?:request|user|input|data|file)/gi,
    fixPrompt:
      "pickle.load with untrusted data allows arbitrary code execution. Use JSON for untrusted data.",
  },
  {
    id: "python-shell",
    name: "Shell Injection (Python)",
    regex: /subprocess\.\w+\s*\([^)]*shell\s*=\s*True[^)]*(?:request|user|input|param)/gi,
    fixPrompt:
      "shell=True with user input enables command injection. Pass command as a list without shell=True.",
  },
];
