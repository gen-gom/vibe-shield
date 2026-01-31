#!/usr/bin/env node
import { scanFiles } from "./scanner";
import { formatAgentPrompt, generateSummary } from "./prompter";
import { initVibeShield } from "./init";

const VERSION = "1.0.0";

// Colors (ANSI escape codes for terminal)
const colors = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
};

function printBanner(): void {
  console.log(
    colors.cyan +
      `
╦  ╦╦╔╗ ╔═╗  ╔═╗╦ ╦╦╔═╗╦  ╔╦╗
╚╗╔╝║╠╩╗║╣   ╚═╗╠═╣║║╣ ║   ║║
 ╚╝ ╩╚═╝╚═╝  ╚═╝╩ ╩╩╚═╝╩═╝═╩╝
` +
      colors.reset
  );
  console.log(colors.dim + `  v${VERSION} - Security scanner for vibe coders\n` + colors.reset);
}

function printHelp(): void {
  printBanner();
  console.log("Usage:");
  console.log(colors.dim + "  vibe-shield [command] [options]\n" + colors.reset);

  console.log("Commands:");
  console.log(
    colors.green + "  scan [path]" + colors.reset + colors.dim + "   Scan for security issues (default: .)" + colors.reset
  );
  console.log(
    colors.green + "  init" + colors.reset + colors.dim + "          Create .cursorrules for AI agent integration" + colors.reset
  );
  console.log(colors.green + "  help" + colors.reset + colors.dim + "          Show this help message" + colors.reset);
  console.log(colors.green + "  version" + colors.reset + colors.dim + "       Show version number\n" + colors.reset);

  console.log("Examples:");
  console.log(colors.dim + "  npx vibe-shield" + colors.reset);
  console.log(colors.dim + "  npx vibe-shield scan ./src" + colors.reset);
  console.log(colors.dim + "  npx vibe-shield init\n" + colors.reset);
}

function printVersion(): void {
  console.log(`vibe-shield v${VERSION}`);
}

function runInit(dir: string): void {
  printBanner();
  console.log(colors.yellow + "Initializing vibe-shield...\n" + colors.reset);

  const result = initVibeShield(dir);

  if (result.success) {
    console.log(colors.green + "✓ " + colors.reset + result.message);
    console.log(colors.dim + `  Created: ${result.path}\n` + colors.reset);
    console.log("Your AI agent will now run vibe-shield before completing tasks.");
    console.log(colors.dim + "Happy vibe coding!\n" + colors.reset);
    process.exit(0);
  } else {
    console.log(colors.red + "✗ " + colors.reset + result.message);
    process.exit(1);
  }
}

function runScan(dir: string): void {
  printBanner();
  console.log(colors.yellow + `Scanning ${dir}...\n` + colors.reset);

  const issues = scanFiles(dir);

  if (issues.length === 0) {
    console.log(colors.green + colors.bold + "✓ SAFE" + colors.reset);
    console.log(colors.dim + "No security issues detected. Ship it!\n" + colors.reset);
    process.exit(0);
  }

  // Print summary
  const summary = generateSummary(issues);
  console.log(
    colors.red + colors.bold + `✗ Found ${issues.length} security issue${issues.length > 1 ? "s" : ""}\n` + colors.reset
  );

  console.log("Summary:");
  for (const [pattern, count] of Object.entries(summary)) {
    console.log(colors.dim + `  • ${pattern}: ${count}` + colors.reset);
  }
  console.log("");

  // Print agent protocol
  const agentPrompt = formatAgentPrompt(issues);
  console.log(colors.yellow + agentPrompt + colors.reset);
  console.log("");

  // Exit with error code so CI/CD pipelines can catch this
  process.exit(1);
}

// Parse arguments
const args = process.argv.slice(2);
const command = args[0] || "scan";
const targetDir = args[1] || process.cwd();

switch (command) {
  case "init":
    runInit(targetDir === process.cwd() ? process.cwd() : targetDir);
    break;
  case "scan":
    runScan(targetDir);
    break;
  case "help":
  case "--help":
  case "-h":
    printHelp();
    process.exit(0);
    break;
  case "version":
  case "--version":
  case "-v":
    printVersion();
    process.exit(0);
    break;
  default:
    // If first arg is a path, treat as scan target
    if (command.startsWith(".") || command.startsWith("/")) {
      runScan(command);
    } else {
      console.log(colors.red + `Unknown command: ${command}` + colors.reset);
      console.log(colors.dim + 'Run "vibe-shield help" for usage.\n' + colors.reset);
      process.exit(1);
    }
}
