#!/usr/bin/env node
/**
 * Reference upstream sync for Acrylaxi.
 *
 * Acrylaxi is extended from Lavish Editor (https://github.com/kunchenguid/lavish-axi).
 * The upstream repository is vendored as a git submodule at `upstream/lavish-axi` and is
 * read-only reference material: it is never imported, built, or tested by this package.
 * This script only reports what upstream changed and, with --pull, moves the pinned
 * submodule checkout forward so the changes can be reviewed and ported deliberately.
 *
 *   node scripts/pull-upstream.mjs            # same as --check: fetch + report, no pin change
 *   node scripts/pull-upstream.mjs --check    # fetch + report, never moves the pin
 *   node scripts/pull-upstream.mjs --pull     # move the pin to upstream/main, report the diff
 *   node scripts/pull-upstream.mjs --json     # machine-readable summary on stdout
 *
 * Adoption stays manual: the upstream work was renamed (Lavish -> ACRYL AXI), so a
 * fast-forward or merge would reintroduce the old identity. Port what applies.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const SUBMODULE_PATH = path.join(REPO_ROOT, "upstream", "lavish-axi");
const UPSTREAM_REMOTE = "origin";
const UPSTREAM_BRANCH = "main";

/** @param {string[]} args @param {{ cwd?: string, allowFailure?: boolean }} [options] */
function git(args, { cwd = SUBMODULE_PATH, allowFailure = false } = {}) {
  try {
    return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (error) {
    if (allowFailure) return null;
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`git ${args.join(" ")} failed in ${cwd}: ${detail}`, { cause: error });
  }
}

function fail(message) {
  console.error(`upstream: ${message}`);
  process.exitCode = 1;
}

function submoduleDeclared() {
  const modules = path.join(REPO_ROOT, ".gitmodules");
  if (!existsSync(modules)) return false;
  return readFileSync(modules, "utf8").includes("upstream/lavish-axi");
}

function ensureSubmodule() {
  if (!submoduleDeclared()) {
    throw new Error(
      "upstream/lavish-axi is not a declared submodule. Restore it with `git submodule update --init upstream/lavish-axi`.",
    );
  }
  if (!existsSync(path.join(SUBMODULE_PATH, ".git"))) {
    console.log("upstream: initializing the upstream/lavish-axi submodule…");
    execFileSync("git", ["submodule", "update", "--init", "--", "upstream/lavish-axi"], {
      cwd: REPO_ROOT,
      stdio: "inherit",
    });
  }
}

function formatting() {
  const args = process.argv.slice(2);
  return {
    check: args.includes("--check") || !args.includes("--pull"),
    pull: args.includes("--pull"),
    json: args.includes("--json"),
  };
}

function short(sha) {
  return String(sha || "").slice(0, 10);
}

function fileGroups(entries) {
  /** @type {Map<string, string[]>} */
  const groups = new Map();
  for (const entry of entries) {
    const file = entry.file;
    const group = file.includes("/") ? file.slice(0, file.indexOf("/")) : "(root)";
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(`${entry.status} ${file}`);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function main() {
  const { check, pull, json } = formatting();
  if (check && pull) {
    fail("pass either --check or --pull, not both");
    return;
  }

  ensureSubmodule();

  const originUrl = git(["remote", "get-url", UPSTREAM_REMOTE], { allowFailure: true });
  const pinned = git(["rev-parse", "HEAD"]);
  const dirty = git(["status", "--porcelain"]);
  if (dirty && pull) {
    fail(
      "the upstream submodule has local changes; restore it (git -C upstream/lavish-axi checkout -- .) before pulling",
    );
    return;
  }

  git(["fetch", "--quiet", UPSTREAM_REMOTE, `${UPSTREAM_BRANCH}:refs/remotes/${UPSTREAM_REMOTE}/${UPSTREAM_BRANCH}`]);
  const latest = git(["rev-parse", `refs/remotes/${UPSTREAM_REMOTE}/${UPSTREAM_BRANCH}`]);
  const behind = Number(git(["rev-list", "--count", `${pinned}..${latest}`]) || "0") || 0;
  const ahead = Number(git(["rev-list", "--count", `${latest}..${pinned}`]) || "0") || 0;

  if (!pull) {
    const commits = behind
      ? git(["log", "--no-merges", "--pretty=format:%h %ad %s", "--date=short", `${pinned}..${latest}`])
      : "";
    const changed = behind
      ? git(["diff", "--name-status", `${pinned}..${latest}`])
          .split("\n")
          .filter(Boolean)
          .map((line) => {
            const [status, ...rest] = line.split("\t");
            return { status, file: rest.join("\t") };
          })
      : [];
    const summary = {
      upstream: originUrl,
      pinned: short(pinned),
      latest: short(latest),
      behind,
      ahead,
      changedFiles: changed.length,
      commits: commits ? commits.split("\n").length : 0,
    };

    if (json) {
      console.log(JSON.stringify({ ...summary, changes: changed }, null, 2));
      return;
    }
    console.log(`upstream reference: ${originUrl} (${UPSTREAM_BRANCH})`);
    console.log(`pinned  ${summary.pinned}`);
    console.log(`latest  ${summary.latest}`);
    if (behind === 0) {
      console.log(`status  up to date with upstream/${UPSTREAM_BRANCH}`);
    } else {
      console.log(`status  ${behind} commit(s) behind upstream/${UPSTREAM_BRANCH}${ahead ? `, ${ahead} ahead` : ""}`);
      for (const [group, files] of fileGroups(changed)) {
        console.log(`\n  ${group} (${files.length})`);
        for (const file of files.slice(0, 12)) console.log(`    ${file}`);
        if (files.length > 12) console.log(`    … ${files.length - 12} more`);
      }
      console.log(`\nRecent upstream commits:\n${commits.replace(/^/gm, "  ")}`);
      console.log(
        "\nNext: `pnpm run upstream:pull` to move the pin, then port what applies (see docs/upstream-reference.md).",
      );
    }
    console.log("\nThe submodule is reference only: never import, build, or test upstream/.");
    return;
  }

  if (behind === 0) {
    console.log(`upstream: already at upstream/${UPSTREAM_BRANCH} (${short(pinned)}); nothing to pull.`);
    return;
  }

  const changes = git(["diff", "--stat", `${pinned}..${latest}`]);
  /** @type {{ status: string, file: string }[]} */
  const changed = git(["diff", "--name-status", `${pinned}..${latest}`])
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [status, ...rest] = line.split("\t");
      return { status, file: rest.join("\t") };
    });

  git(["checkout", "--quiet", "--detach", latest]);
  const moved = git(["rev-parse", "HEAD"]);

  if (json) {
    console.log(
      JSON.stringify(
        {
          upstream: originUrl,
          previous: short(pinned),
          pinned: short(moved),
          changedFiles: changed.length,
          changes: changed,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(`upstream: moved ${short(pinned)} -> ${short(moved)} (${behind} commit(s))`);
  console.log(`\nWhat changed:\n${changes.replace(/^/gm, "  ")}`);
  for (const [group, files] of fileGroups(changed)) {
    console.log(`\n  ${group} (${files.length})`);
    for (const file of files.slice(0, 12)) console.log(`    ${file}`);
    if (files.length > 12) console.log(`    … ${files.length - 12} more`);
  }
  console.log("\nReview with:");
  console.log(`  git -C upstream/lavish-axi log -p ${short(pinned)}..${short(moved)} -- src`);
  console.log("Then port deliberately and commit the new submodule pin separately from product changes.");
  console.log("The submodule is reference only: never import, build, or test upstream/.");
}

try {
  main();
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
