<div align="center">
  <img src=".github/logo.png" alt="vibe-shield" width="128" height="128">

  <h1>vibe-shield</h1>

  <p><strong>The security layer for Vibe Coding.</strong></p>

  <p>
    <a href="https://www.npmjs.com/package/vibe-shield"><img src="https://img.shields.io/npm/v/vibe-shield.svg" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/vibe-shield"><img src="https://img.shields.io/npm/dm/vibe-shield.svg" alt="npm downloads"></a>
    <a href="https://github.com/gomzkov/vibe-shield/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/vibe-shield.svg" alt="license"></a>
  </p>

  <p>
    <a href="#usage">Usage</a> •
    <a href="#what-it-detects">What it detects</a> •
    <a href="#agent-integration">Agent integration</a> •
    <a href="#mcp-server">MCP Server</a>
  </p>
</div>

<br>

A single command that scans your repo and generates auto-fix prompts for Cursor and Claude Code to secure your app instantly.

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

Or manually add this rule to your AI tool (Claude Code, Cursor, Antigravity, etc.):

```
# Vibe Shield Security Rules

Before marking a task as done, run `npx vibe-shield`. If issues are found, follow the [INSTRUCTION] provided in the output to fix them.

## Security Checklist
- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] No dangerous code execution (eval, shell injection)
- [ ] No SQL injection vulnerabilities (use parameterized queries)
- [ ] All secrets stored in environment variables
- [ ] HTTPS used for all external URLs
```

## Pre-commit hook

Block commits that have security issues:

```bash
npx vibe-shield hook            # Install
npx vibe-shield hook --uninstall  # Remove
```

The hook scans staged files before each commit. Bypass with `git commit --no-verify`.

## MCP Server

vibe-shield can run as an MCP server, allowing AI tools to call it directly.

Add to your MCP config (Claude Desktop, Cursor, Antigravity, etc.):

```json
{
  "mcpServers": {
    "vibe-shield": {
      "command": "npx",
      "args": ["vibe-shield", "mcp"]
    }
  }
}
```

Config file locations:
- **Claude Desktop**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Cursor**: `.cursor/mcp.json` in your project
- **Antigravity**: `~/.gemini/antigravity/mcp_config.json`

After setup, your AI assistant can use the `vibe_shield_scan` tool to check for security issues.

## Development

```bash
bun install
bun run dev
bun run build
```

## License

MIT
