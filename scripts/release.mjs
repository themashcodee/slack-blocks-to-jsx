#!/usr/bin/env node
// @ts-check
/**
 * One-command release for slack-blocks-to-jsx.
 *
 * Does, in order:
 *   1. Pre-flight checks (clean tree, on main, up to date, npm + gh auth)
 *   2. Lint / typecheck  (pnpm run lint)
 *   3. Build             (pnpm run build)
 *   4. Bump the version in package.json
 *   5. Commit + tag (vX.Y.Z)
 *   6. Publish to npm    (pnpm publish)
 *   7. Push commit + tag to GitHub
 *   8. Create a GitHub release with auto-generated notes
 *
 * Usage:
 *   pnpm release                 # interactive: pick patch / minor / major / prerelease / custom
 *   pnpm release patch           # bump patch  (1.0.4 -> 1.0.5)
 *   pnpm release minor           # bump minor  (1.0.4 -> 1.1.0)
 *   pnpm release major           # bump major  (1.0.4 -> 2.0.0)
 *   pnpm release 1.2.3           # set an explicit version
 *   pnpm release patch --yes     # skip the confirmation prompt
 *   pnpm release --dry-run       # preview everything, change nothing
 *
 * Prereleases (beta / alpha that people can `npm install <pkg>@beta`):
 *   pnpm release:beta            # 1.0.4 -> 1.0.5-beta.0, then -beta.1, -beta.2 … (npm tag: beta)
 *   pnpm release:alpha           # same, under the "alpha" channel/tag
 *   pnpm release prerelease --preid=rc   # release-candidate channel
 *   pnpm release preminor --preid=beta   # start a beta off the next minor (1.1.0-beta.0)
 *   pnpm release patch           # from 1.0.5-beta.3, "graduates" to stable 1.0.5
 *
 * Flags:
 *   --dry-run, -n   Print every step without mutating anything (also never fails on auth/state).
 *   --yes, -y       Skip the final confirmation prompt.
 *   --preid=<id>    Prerelease identifier for pre* bumps (default: beta).
 *   --tag=<name>    npm dist-tag to publish under (default: latest, or the preid for prereleases).
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const pkgPath = resolve(root, "package.json");

// ── tiny terminal helpers ──────────────────────────────────────────────────
const tty = output.isTTY;
const paint = (code, s) => (tty ? `\x1b[${code}m${s}\x1b[0m` : s);
const c = {
  bold: (s) => paint("1", s),
  dim: (s) => paint("2", s),
  red: (s) => paint("31", s),
  green: (s) => paint("32", s),
  yellow: (s) => paint("33", s),
  cyan: (s) => paint("36", s),
};
const log = (m = "") => console.log(m);
const info = (m) => console.log(`${c.cyan("›")} ${m}`);
const ok = (m) => console.log(`${c.green("✓")} ${m}`);
const warn = (m) => console.log(`${c.yellow("!")} ${m}`);
const fail = (m) => {
  console.error(`\n${c.red("✗ " + m)}`);
  process.exit(1);
};

// ── command runner ──────────────────────────────────────────────────────────
/**
 * @param {string} cmd
 * @param {string[]} args
 * @param {{ capture?: boolean, allowFail?: boolean }} [opts]
 * @returns {string|null} trimmed stdout when capturing, "" otherwise, null when allowFail and it failed
 */
function run(cmd, args, opts = {}) {
  const { capture = false, allowFail = false } = opts;
  try {
    const out = execFileSync(cmd, args, {
      cwd: root,
      encoding: "utf8",
      stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
    });
    return capture ? (out || "").trim() : "";
  } catch (err) {
    if (allowFail) return null;
    throw err;
  }
}

// ── argument parsing ─────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry-run") || argv.includes("-n");
const assumeYes = argv.includes("--yes") || argv.includes("-y");
const tagFlag = argv.find((a) => a.startsWith("--tag="));
let distTag = tagFlag ? tagFlag.split("=")[1] : "latest";
const preidFlag = argv.find((a) => a.startsWith("--preid="));
const preidExplicit = Boolean(preidFlag);
const preid = preidFlag ? preidFlag.split("=")[1] : "beta";
const bumpArg = argv.find((a) => !a.startsWith("-"));

// Treat dry-run pre-flight problems as warnings so a preview never hard-fails.
const guard = dryRun ? warn : fail;

// ── semver helpers (no dependency) ───────────────────────────────────────────
const SEMVER = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;
function parseVersion(v) {
  const m = SEMVER.exec(v);
  if (!m) fail(`Cannot parse version "${v}". Expected MAJOR.MINOR.PATCH[-prerelease].`);
  return { major: +m[1], minor: +m[2], patch: +m[3], pre: m[4] };
}
const RELEASE_TYPES = ["major", "minor", "patch", "premajor", "preminor", "prepatch", "prerelease"];

// Stable bump that mirrors semver's `inc`: bumping a prerelease "graduates" it
// to the stable core (1.0.5-beta.3 --patch-> 1.0.5) instead of incrementing.
function incStable(p, type) {
  if (type === "patch") return p.pre ? `${p.major}.${p.minor}.${p.patch}` : `${p.major}.${p.minor}.${p.patch + 1}`;
  if (type === "minor") return p.pre && p.patch === 0 ? `${p.major}.${p.minor}.0` : `${p.major}.${p.minor + 1}.0`;
  return p.pre && p.minor === 0 && p.patch === 0 ? `${p.major}.0.0` : `${p.major + 1}.0.0`;
}

// `prerelease`: continue the current prerelease counter (1.0.5-beta.0 -> 1.0.5-beta.1),
// or start a fresh one off the next patch (1.0.4 -> 1.0.5-beta.0). A different
// explicit --preid switches channel and resets the counter (beta.3 -> alpha.0).
function nextPrerelease(p) {
  if (p.pre) {
    const m = /^(.+)\.(\d+)$/.exec(p.pre);
    const curId = m ? m[1] : p.pre;
    const curNum = m ? Number(m[2]) : 0;
    if (preidExplicit && preid !== curId) return `${p.major}.${p.minor}.${p.patch}-${preid}.0`;
    return `${p.major}.${p.minor}.${p.patch}-${curId}.${curNum + 1}`;
  }
  return `${p.major}.${p.minor}.${p.patch + 1}-${preid}.0`;
}

function bump(v, type) {
  const p = parseVersion(v);
  switch (type) {
    case "major":
    case "minor":
    case "patch":
      return incStable(p, type);
    case "premajor":
      return `${p.major + 1}.0.0-${preid}.0`;
    case "preminor":
      return `${p.major}.${p.minor + 1}.0-${preid}.0`;
    case "prepatch":
      return `${p.major}.${p.minor}.${p.patch + 1}-${preid}.0`;
    case "prerelease":
      return nextPrerelease(p);
    default:
      if (/^[a-z]/i.test(type)) {
        fail(`Unknown release type "${type}". Use one of: ${RELEASE_TYPES.join(", ")}, or an explicit version like 1.2.3.`);
      }
      parseVersion(type); // explicit version — validate it
      return type;
  }
}

// The prerelease identifier of a version, e.g. "1.2.0-beta.3" -> "beta".
function prereleaseId(v) {
  const pre = parseVersion(v).pre;
  return pre ? /^([0-9A-Za-z-]+)/.exec(pre)?.[1] || "next" : null;
}

async function ask(question) {
  const rl = createInterface({ input, output });
  try {
    return (await rl.question(question)).trim();
  } finally {
    rl.close();
  }
}

async function promptVersion(current) {
  const p = parseVersion(current);
  log(`\nCurrent version: ${c.bold(current)}`);

  // When already on a prerelease, the useful moves are "ship the next one" and
  // "graduate to stable"; otherwise offer the usual patch/minor/major + a prerelease.
  const options = p.pre
    ? [
        { label: "prerelease (next)", value: bump(current, "prerelease") },
        { label: "graduate to stable", value: `${p.major}.${p.minor}.${p.patch}` },
        { label: "custom", value: null },
      ]
    : [
        { label: "patch", value: bump(current, "patch") },
        { label: "minor", value: bump(current, "minor") },
        { label: "major", value: bump(current, "major") },
        { label: `prerelease (${preid})`, value: bump(current, "prepatch") },
        { label: "custom", value: null },
      ];

  options.forEach((o, i) => {
    log(`  ${c.cyan(`${i + 1})`)} ${o.label.padEnd(20)}${o.value ? `→ ${o.value}` : ""}`);
  });
  const choice = (await ask(`Select release type ${c.dim(`[1-${options.length}, default 1]`)}: `)) || "1";
  const picked = options[Number(choice) - 1];
  if (!picked) fail(`Invalid choice "${choice}".`);
  if (picked.value) return picked.value;

  const custom = await ask("Enter the exact version (e.g. 1.2.3 or 1.2.3-beta.0): ");
  parseVersion(custom);
  return custom;
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const current = pkg.version;
  const repoUrl = String(pkg.repository?.url || pkg.repository || "")
    .replace(/^git\+/, "")
    .replace(/\.git$/, "");

  log(c.bold(`\nReleasing ${pkg.name}`) + (dryRun ? c.yellow("  (dry run)") : ""));

  // 1. pre-flight checks ------------------------------------------------------
  info("Running pre-flight checks");

  const status = run("git", ["status", "--porcelain"], { capture: true });
  if (status) {
    guard(`Working tree is not clean — commit or stash first:\n${status}`);
  }

  const branch = run("git", ["rev-parse", "--abbrev-ref", "HEAD"], { capture: true });
  if (branch !== "main") {
    guard(`You are on "${branch}", not "main". Releases should be cut from main.`);
  }

  // Make sure we are not behind the remote (so we don't tag stale code).
  run("git", ["fetch", "--quiet", "--tags", "origin", branch], { capture: true, allowFail: true });
  const behind = run("git", ["rev-list", "--count", `HEAD..origin/${branch}`], {
    capture: true,
    allowFail: true,
  });
  if (behind && behind !== "0") {
    guard(`Local "${branch}" is ${behind} commit(s) behind origin. Pull first.`);
  }

  if (run("gh", ["auth", "status"], { capture: true, allowFail: true }) === null) {
    guard("GitHub CLI is not authenticated. Run: gh auth login");
  }

  const npmUser = run("npm", ["whoami"], { capture: true, allowFail: true });
  if (npmUser === null) {
    guard("Not logged in to npm. Run: npm login");
  } else {
    info(`npm user: ${c.bold(npmUser)}`);
  }

  // 2. choose version ---------------------------------------------------------
  // bump() handles patch/minor/major and validates an explicit "x.y.z".
  const next = bumpArg ? bump(current, bumpArg) : await promptVersion(current);

  // Prereleases must never land on the `latest` dist-tag. Default the tag to the
  // prerelease id (beta/alpha/rc) so users can `npm install <pkg>@beta`.
  const isPrerelease = Boolean(parseVersion(next).pre);
  if (isPrerelease && !tagFlag) {
    distTag = prereleaseId(next);
  } else if (isPrerelease && distTag === "latest") {
    distTag = prereleaseId(next);
    warn(`Prerelease cannot publish to "latest" — using the "${distTag}" dist-tag instead.`);
  }
  const tagName = `v${next}`;

  // 3. confirm ----------------------------------------------------------------
  log("");
  info("Release plan:");
  log(`  ${c.dim("version")}   ${current} → ${c.green(next)}`);
  log(`  ${c.dim("git tag")}   ${tagName}`);
  log(`  ${c.dim("npm tag")}   ${distTag}`);
  log(`  ${c.dim("branch")}    ${branch}`);
  log("");

  if (dryRun) {
    warn("Dry run: will lint + build to verify, but make no other changes.");
  } else if (!assumeYes) {
    const answer = await ask(`Proceed with the release? ${c.dim("[y/N]")} `);
    if (answer.toLowerCase() !== "y" && answer.toLowerCase() !== "yes") fail("Aborted.");
  }

  // 4. verify it lints + builds (safe — run even in dry-run) -------------------
  step("Linting / typechecking", () => run("pnpm", ["run", "lint"]), { always: true });
  step("Building", () => run("pnpm", ["run", "build"]), { always: true });

  if (dryRun) {
    log("");
    ok(`Dry run complete. ${pkg.name} ${current} → ${next} looks ready to ship.`);
    return;
  }

  // 5–8. the irreversible part — track progress for clean recovery on failure --
  let committed = false;
  let tagged = false;
  let published = false;
  try {
    step(`Bumping version to ${next}`, () => {
      pkg.version = next;
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    });
    step("Committing version bump", () => {
      run("git", ["add", "package.json"]);
      run("git", ["commit", "-m", `chore: release ${tagName}`]);
      committed = true;
    });
    step(`Tagging ${tagName}`, () => {
      run("git", ["tag", "-a", tagName, "-m", tagName]);
      tagged = true;
    });
    step(`Publishing to npm (dist-tag: ${distTag})`, () => {
      run("pnpm", ["publish", "--access", "public", "--no-git-checks", "--tag", distTag]);
      published = true;
    });
    step("Pushing commit + tag to GitHub", () => {
      run("git", ["push", "--follow-tags", "origin", branch]);
    });
    step("Creating GitHub release", () => {
      const ghArgs = ["release", "create", tagName, "--title", tagName, "--generate-notes"];
      if (isPrerelease || distTag !== "latest") ghArgs.push("--prerelease");
      run("gh", ghArgs);
    });
  } catch (err) {
    log("");
    fail(buildRecoveryMessage({ committed, tagged, published, tagName, distTag, next, pkgName: pkg.name }, err));
  }

  // done ----------------------------------------------------------------------
  log("");
  ok(c.bold(`Released ${pkg.name}@${next} 🎉`));
  log(`  ${c.dim("npm")}     https://www.npmjs.com/package/${pkg.name}/v/${next}`);
  if (repoUrl) log(`  ${c.dim("github")}  ${repoUrl}/releases/tag/${tagName}`);
}

/**
 * Runs a release step, printing a spinner-ish status line.
 * In dry-run, mutating steps (no `always`) are only described, never executed.
 */
function step(label, fn, { always = false } = {}) {
  if (dryRun && !always) {
    log(`${c.dim("• would")} ${label}`);
    return;
  }
  info(`${label} …`);
  fn();
  ok(label);
}

function buildRecoveryMessage(state, err) {
  const lines = [`Release failed: ${err?.message || err}`, ""];
  if (state.published) {
    lines.push(
      `npm publish of ${state.pkgName}@${state.next} SUCCEEDED but a later step failed.`,
      `Finish manually:`,
      `  git push --follow-tags origin main`,
      `  gh release create ${state.tagName} --title ${state.tagName} --generate-notes`,
    );
  } else if (state.committed || state.tagged) {
    lines.push("Nothing was published or pushed. Undo the local version bump with:");
    if (state.tagged) lines.push(`  git tag -d ${state.tagName}`);
    if (state.committed) lines.push(`  git reset --hard HEAD~1`);
    lines.push("…then fix the issue and re-run the release.");
  } else {
    lines.push("No changes were made. Fix the issue and re-run the release.");
  }
  return lines.join("\n");
}

main().catch((err) => fail(err?.stack || String(err)));
