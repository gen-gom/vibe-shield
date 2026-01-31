# vibe-shield

The security layer for Vibe Coding. A single command that scans your repo and generates auto-fix prompts for Cursor and Claude Code to secure your app instantly.

## Usage

```bash
npx vibe-shield
```

That's it. Run it in your project directory and it will scan for security issues.

## What it detects

- Hardcoded secrets (API keys, passwords, AWS keys, JWT secrets)
- SQL injection (template literals and string concatenation in queries)
- Command injection (user input in shell commands)
- XSS vulnerabilities (innerHTML with user data)
- Weak cryptography (MD5, SHA1)
- Security misconfigurations (disabled SSL, CORS wildcards)
- Path traversal (user input in file operations)
- NoSQL injection ($where operator)
- Python issues (pickle with untrusted data, shell=True)

## How it works

When vibe-shield finds an issue, it outputs a prompt your AI agent can follow:

```
[TASK 1] Fix Hardcoded Secret in src/db.ts at line 12
[FOUND]: api_key = "sk-1234..."
[INSTRUCTION]: Move this secret to an environment variable...
```

Paste this output to Cursor or Claude Code and it will fix the issues for you.

## Agent integration

Run `npx vibe-shield init` to create a `.cursorrules` file that reminds your AI agent to run security checks before completing tasks.

## Development

```bash
bun install
bun run dev
bun run build
```

## License

MIT
