# Ship Changes

A workflow skill for shipping code changes with proper git conventions.

## Usage

Run `/ship` when you're done developing and ready to commit and push changes.

## Workflow

When this skill is triggered, follow these steps:

### 1. Analyze Changes

```bash
git status
git diff --stat
```

Review what files have been changed to understand the scope of work.

### 2. Determine Change Type

Based on the changes, determine the type:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Formatting, no code change
- `refactor` - Code restructuring
- `test` - Adding/updating tests
- `chore` - Maintenance, dependencies, config

### 3. Create Branch

If on `main`, create a new branch:

```
{type}/{short-description-in-kebab-case}
```

Examples:
- `feat/add-user-auth`
- `fix/version-display`
- `docs/update-readme`
- `chore/update-dependencies`

```bash
git checkout main
git pull
git checkout -b {branch-name}
```

If already on a feature branch, stay on it.

### 4. Stage Changes

Stage relevant files (avoid `git add -A` or `git add .`):

```bash
git add {specific-files}
```

### 5. Commit

Use conventional commit format:

```
{type}: {short description}

{optional body - what and why, not how}

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

Rules:
- Subject line: imperative mood, lowercase, no period, max 50 chars
- Body: wrap at 72 chars, explain what/why not how
- Always include Co-Authored-By

```bash
git commit -m "$(cat <<'EOF'
{type}: {short description}

{body if needed}

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

### 6. Push

```bash
git push -u origin {branch-name}
```

### 7. Create Pull Request

Use `gh pr create` with this format:

```markdown
## Summary
- {bullet points of what changed}

## Test plan
- [ ] {how to verify the changes work}

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

```bash
gh pr create --title "{type}: {description}" --body "..."
```

### 8. Report

Output the PR URL and a brief summary of what was shipped.

## Example Output

```
✓ Created branch: feat/add-dark-mode
✓ Committed: feat: add dark mode support
✓ Pushed to origin
✓ Created PR: https://github.com/user/repo/pull/42

Shipped! 🚀
```
