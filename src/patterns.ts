import type { SecurityPattern } from "./types";

/**
 * Security patterns for detecting vulnerabilities in AI-generated code.
 * Focused on high-confidence issues that are actually problems.
 */
export const securityPatterns: SecurityPattern[] = [
  // === SECRETS - CRITICAL ===
  {
    id: "aws-access-key",
    name: "AWS Access Key",
    regex: /['"`](AKIA[0-9A-Z]{16})['"`]/g,
    fixPrompt:
      "AWS access key detected. Remove immediately and rotate in AWS console. Use environment variables or IAM roles.",
    severity: "critical",
  },
  {
    id: "aws-secret-key",
    name: "AWS Secret Key",
    regex: /aws_?secret_?access_?key\s*[:=]\s*['"`][A-Za-z0-9\/+=]{40}['"`]/gi,
    fixPrompt:
      "AWS secret key detected. Remove immediately and rotate in AWS console. Use environment variables.",
    severity: "critical",
  },
  {
    id: "openai-key",
    name: "OpenAI API Key",
    regex: /['"`](sk-[A-Za-z0-9]{48,})['"`]/g,
    fixPrompt:
      "OpenAI API key detected. Remove and rotate at platform.openai.com. Use process.env.OPENAI_API_KEY.",
    severity: "critical",
  },
  {
    id: "anthropic-key",
    name: "Anthropic API Key",
    regex: /['"`](sk-ant-[A-Za-z0-9\-]{80,})['"`]/g,
    fixPrompt:
      "Anthropic API key detected. Remove and rotate at console.anthropic.com. Use process.env.ANTHROPIC_API_KEY.",
    severity: "critical",
  },
  {
    id: "stripe-secret",
    name: "Stripe Secret Key",
    regex: /['"`](sk_live_[A-Za-z0-9]{24,})['"`]/g,
    fixPrompt:
      "Stripe live secret key detected. Remove and rotate in Stripe dashboard. Use process.env.STRIPE_SECRET_KEY.",
    severity: "critical",
  },
  {
    id: "stripe-restricted",
    name: "Stripe Restricted Key",
    regex: /['"`](rk_live_[A-Za-z0-9]{24,})['"`]/g,
    fixPrompt:
      "Stripe restricted key detected. Remove and rotate in Stripe dashboard. Use environment variables.",
    severity: "critical",
  },
  {
    id: "github-token",
    name: "GitHub Token",
    regex: /['"`](ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{22,})['"`]/g,
    fixPrompt:
      "GitHub token detected. Remove and rotate at github.com/settings/tokens. Use process.env.GITHUB_TOKEN.",
    severity: "critical",
  },
  {
    id: "slack-token",
    name: "Slack Token",
    regex: /['"`](xox[baprs]-[A-Za-z0-9\-]{10,})['"`]/g,
    fixPrompt:
      "Slack token detected. Remove and rotate in Slack app settings. Use environment variables.",
    severity: "critical",
  },
  {
    id: "twilio-key",
    name: "Twilio API Key",
    regex: /['"`](SK[A-Za-z0-9]{32})['"`]/g,
    fixPrompt:
      "Twilio API key detected. Remove and rotate in Twilio console. Use environment variables.",
    severity: "critical",
  },
  {
    id: "sendgrid-key",
    name: "SendGrid API Key",
    regex: /['"`](SG\.[A-Za-z0-9\-_]{22}\.[A-Za-z0-9\-_]{43})['"`]/g,
    fixPrompt:
      "SendGrid API key detected. Remove and rotate in SendGrid dashboard. Use environment variables.",
    severity: "critical",
  },
  {
    id: "private-key",
    name: "Private Key",
    regex: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g,
    fixPrompt:
      "Private key detected in code. Move to a secure file outside repo or use a secrets manager.",
    severity: "critical",
  },

  // === SECRETS - HIGH ===
  {
    id: "hardcoded-secret",
    name: "Hardcoded Secret",
    regex:
      /(?:api_?key|api_?secret|secret_?key|auth_?token|access_?token|private_?key|client_?secret)\s*[:=]\s*['"`][A-Za-z0-9_\-\.\/\+]{8,}['"`]/gi,
    fixPrompt:
      "Move this secret to an environment variable. Add to .env and use process.env.YOUR_SECRET. Add .env to .gitignore.",
    severity: "high",
  },
  {
    id: "hardcoded-password",
    name: "Hardcoded Password",
    regex: /(?:password|passwd|pwd)\s*[:=]\s*['"`][^'"`\s]{4,}['"`]/gi,
    fixPrompt:
      "Move this password to an environment variable. Never commit passwords to version control.",
    severity: "high",
  },
  {
    id: "jwt-secret-inline",
    name: "Hardcoded JWT Secret",
    regex: /jwt\.sign\s*\([^)]+,\s*['"`][^'"`]{8,}['"`]/gi,
    fixPrompt:
      "Move JWT secret to an environment variable. Hardcoded secrets get committed to version control.",
    severity: "high",
  },
  {
    id: "database-url",
    name: "Database Connection String",
    regex:
      /['"`](mongodb(\+srv)?|postgres(ql)?|mysql|redis):\/\/[^'"`\s]{10,}['"`]/gi,
    fixPrompt:
      "Database connection string with credentials detected. Use process.env.DATABASE_URL.",
    severity: "high",
  },

  // === SQL INJECTION - HIGH ===
  {
    id: "sql-injection-template",
    name: "SQL Injection",
    regex:
      /(?:query|execute)\s*\(\s*`(?:SELECT|INSERT|UPDATE|DELETE|DROP)[^`]*\$\{/gi,
    fixPrompt:
      "Use parameterized queries instead of template literals. Example: query('SELECT * FROM users WHERE id = ?', [userId])",
    severity: "high",
  },
  {
    id: "sql-injection-concat",
    name: "SQL Injection",
    regex:
      /(?:query|execute)\s*\(\s*['"](?:SELECT|INSERT|UPDATE|DELETE)[^'"]*['"]\s*\+/gi,
    fixPrompt:
      "Never concatenate variables into SQL strings. Use parameterized queries with placeholders.",
    severity: "high",
  },

  // === COMMAND INJECTION - CRITICAL ===
  {
    id: "command-injection",
    name: "Command Injection",
    regex: /(?:exec|execSync)\s*\(\s*`[^`]*\$\{/g,
    fixPrompt:
      "Avoid template literals in shell commands. Use spawn() with an array of arguments.",
    severity: "critical",
  },
  {
    id: "command-injection-concat",
    name: "Command Injection",
    regex:
      /(?:exec|execSync)\s*\([^)]*\+\s*(?:req\.|user|input|param|query|body)/gi,
    fixPrompt:
      "User input in shell commands allows arbitrary command execution. Use spawn() with argument arrays.",
    severity: "critical",
  },

  // === DANGEROUS FUNCTIONS - HIGH ===
  {
    id: "eval-usage",
    name: "Dangerous eval()",
    regex: /[=:]\s*eval\s*\(\s*(?:req\.|user|input|param|query|body|data)/gi,
    fixPrompt:
      "eval() with user input allows arbitrary code execution. Use JSON.parse() for JSON, or refactor to avoid eval.",
    severity: "high",
  },
  {
    id: "new-function",
    name: "Dangerous Function Constructor",
    regex: /new\s+Function\s*\([^)]*(?:req\.|user|input|param|query|body)/gi,
    fixPrompt:
      "new Function() with user input is as dangerous as eval(). Refactor to avoid dynamic code generation.",
    severity: "high",
  },

  // === XSS - HIGH ===
  {
    id: "innerhtml-variable",
    name: "XSS via innerHTML",
    regex:
      /\.innerHTML\s*=\s*(?:req\.|user|input|param|query|body|data|props\.|this\.)/gi,
    fixPrompt:
      "Setting innerHTML with user data enables XSS attacks. Use textContent or sanitize with DOMPurify.",
    severity: "high",
  },
  {
    id: "react-dangerous-html",
    name: "React XSS Risk",
    regex:
      /dangerouslySetInnerHTML\s*=\s*\{\s*\{\s*__html\s*:\s*(?:props\.|this\.|data|user|input)/gi,
    fixPrompt:
      "dangerouslySetInnerHTML with user data enables XSS. Sanitize HTML with DOMPurify first.",
    severity: "high",
  },

  // === CRYPTO - MEDIUM ===
  {
    id: "weak-hash-md5",
    name: "Weak Hash (MD5)",
    regex: /createHash\s*\(\s*['"`]md5['"`]\s*\)/g,
    fixPrompt:
      "MD5 is broken. Use crypto.createHash('sha256'). For passwords, use bcrypt or argon2.",
    severity: "medium",
  },
  {
    id: "weak-hash-sha1",
    name: "Weak Hash (SHA1)",
    regex: /createHash\s*\(\s*['"`]sha1['"`]\s*\)/g,
    fixPrompt:
      "SHA1 is deprecated for security. Use crypto.createHash('sha256'). For passwords, use bcrypt or argon2.",
    severity: "medium",
  },

  // === SECURITY MISCONFIG - MEDIUM ===
  {
    id: "ssl-disabled",
    name: "SSL Verification Disabled",
    regex: /rejectUnauthorized\s*:\s*false/g,
    fixPrompt:
      "Disabling SSL verification allows man-in-the-middle attacks. Remove this or set to true.",
    severity: "medium",
  },
  {
    id: "cors-wildcard",
    name: "CORS Allows All Origins",
    regex: /['"`]Access-Control-Allow-Origin['"`]\s*[,:]\s*['"`]\*['"`]/g,
    fixPrompt:
      "CORS wildcard (*) allows any website to make requests. Specify allowed origins explicitly.",
    severity: "medium",
  },

  // === PATH TRAVERSAL - HIGH ===
  {
    id: "path-traversal",
    name: "Path Traversal Risk",
    regex:
      /(?:readFile|writeFile|readFileSync|writeFileSync)\s*\(\s*(?:req\.|user|input|param|query|body)/gi,
    fixPrompt:
      "User input in file paths allows reading/writing arbitrary files. Validate paths with path.resolve() and check they're within allowed directories.",
    severity: "high",
  },

  // === NOSQL INJECTION - HIGH ===
  {
    id: "nosql-where",
    name: "NoSQL Injection ($where)",
    regex: /\.(find|findOne)\s*\(\s*\{[^}]*\$where\s*:/g,
    fixPrompt:
      "$where executes JavaScript and enables NoSQL injection. Use standard MongoDB query operators.",
    severity: "high",
  },

  // === PYTHON - HIGH/CRITICAL ===
  {
    id: "pickle-load",
    name: "Insecure Pickle (Python)",
    regex: /pickle\.loads?\s*\(\s*(?:request|user|input|data|file)/gi,
    fixPrompt:
      "pickle.load with untrusted data allows arbitrary code execution. Use JSON for untrusted data.",
    severity: "critical",
  },
  {
    id: "python-shell",
    name: "Shell Injection (Python)",
    regex:
      /subprocess\.\w+\s*\([^)]*shell\s*=\s*True[^)]*(?:request|user|input|param)/gi,
    fixPrompt:
      "shell=True with user input enables command injection. Pass command as a list without shell=True.",
    severity: "critical",
  },
];
