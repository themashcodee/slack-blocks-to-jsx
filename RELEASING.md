# Releasing

Releasing is one command:

```bash
pnpm release
```

It walks you through everything — pick **patch / minor / major** (or a custom version) and confirm. The script then runs the whole pipeline for you:

1. **Pre-flight checks** — clean working tree, on `main`, up to date with the remote, and logged in to both npm and GitHub.
2. **Lint / typecheck** (`pnpm run lint`).
3. **Build** (`pnpm run build`).
4. **Bump the version** in `package.json`.
5. **Commit** (`chore: release vX.Y.Z`) and **tag** (`vX.Y.Z`).
6. **Publish to npm** (`pnpm publish`).
7. **Push** the commit and tag to GitHub.
8. **Create a GitHub release** with auto-generated notes.

## One-time setup

You only need to do these once per machine:

```bash
npm login          # so the script can publish to npm
gh auth login      # so it can create the GitHub release (you're likely already logged in)
```

## Usage

```bash
pnpm release              # interactive — pick patch / minor / major / prerelease / custom
pnpm release patch        # 1.0.4 -> 1.0.5
pnpm release minor        # 1.0.4 -> 1.1.0
pnpm release major        # 1.0.4 -> 2.0.0
pnpm release 1.2.3        # set an exact version
pnpm release patch --yes  # skip the confirmation prompt
pnpm release:dry          # preview the whole thing, change nothing
```

## Beta / alpha prereleases

Ship a version for people to test **before** it becomes the default `latest`:

```bash
pnpm release:beta     # 1.0.4 -> 1.0.5-beta.0   (npm dist-tag: beta)
pnpm release:beta     # run again -> 1.0.5-beta.1, 1.0.5-beta.2 …
pnpm release:alpha    # same idea on the "alpha" channel -> 1.0.5-alpha.0
```

Each prerelease is published under its own npm **dist-tag** (`beta`, `alpha`, …), so it never
becomes the version people get by default, and it's marked as a *pre-release* on GitHub. Testers opt in:

```bash
npm install slack-blocks-to-jsx@beta      # latest beta
npm install slack-blocks-to-jsx@alpha     # latest alpha
npm install slack-blocks-to-jsx@1.0.5-beta.2   # an exact prerelease
```

Meanwhile `npm install slack-blocks-to-jsx` keeps installing the stable `latest` release.

When the beta is solid, **graduate it to stable** — a normal release drops the prerelease suffix:

```bash
pnpm release patch    # from 1.0.5-beta.2  ->  1.0.5  (dist-tag: latest)
```

More control:

```bash
pnpm release prerelease --preid=rc    # release-candidate channel (1.0.5-rc.0, tag: rc)
pnpm release preminor --preid=beta    # start a beta off the next minor (1.1.0-beta.0)
pnpm release premajor --preid=beta    # start a beta off the next major (2.0.0-beta.0)
pnpm release 1.2.3-beta.0             # any exact prerelease version you want
```

## Dry run

Not sure? Preview first — it runs the checks, lint, and build but changes nothing:

```bash
pnpm release:dry
```

## PR preview releases (pkg.pr.new)

Every pull request automatically gets an **installable preview build** so reviewers and
testers can try the change before it's merged — without it ever touching the real
`slack-blocks-to-jsx` package on npm. This is handled by
[pkg.pr.new](https://github.com/stackblitz-labs/pkg.pr.new) via
`.github/workflows/preview.yml`.

When a PR opens, a bot comments with an install command, e.g.:

```bash
npm install https://pkg.pr.new/slack-blocks-to-jsx@<commit-or-PR>
```

**What about new commits on the PR?** Nothing to do. Every push re-runs the workflow and
republishes; the bot **edits its existing comment** with the fresh command, and the
per-PR URL always resolves to the PR's latest commit. So testers just re-install the same
URL to get the newest build — no version bumping, no cleanup, no npm clutter.

This needs **no npm token** and works for PRs from forks. One-time setup (owner only):
install the **pkg.pr.new GitHub App** → <https://github.com/apps/pkg-pr-new>.

> PR previews are **not** the same as `pnpm release:beta`. Previews are automatic, throwaway,
> and never published to npm. A `beta`/`alpha` (via `pnpm release:beta`) is an intentional,
> maintainer-cut prerelease published to the real npm package under the `beta`/`alpha` dist-tag.

## If something fails midway

The script does the irreversible steps (commit → tag → publish → push → GitHub release) in
an order that keeps things recoverable, and prints exact recovery commands if a step fails.
The common cases:

- **Failed before publishing** — nothing was pushed. Undo the local bump:
  ```bash
  git tag -d vX.Y.Z
  git reset --hard HEAD~1
  ```
- **Published, but a later step failed** — the package is already on npm; just finish the rest:
  ```bash
  git push --follow-tags origin main
  gh release create vX.Y.Z --title vX.Y.Z --generate-notes
  ```

## Notes

- **"Tests"** currently means the TypeScript typecheck (`pnpm run lint` / `pnpm test`); there is
  no unit-test suite yet. When one is added, wire it into the `test` script and the release will
  pick it up.
- CI (`.github/workflows/main.yml`) still runs lint + build on every push and PR. Releasing is now
  a deliberate local action rather than an automated CI publish.
