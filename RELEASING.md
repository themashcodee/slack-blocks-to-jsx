# Releasing

Releases are automated with [release-please](https://github.com/googleapis/release-please).
You don't run anything — you merge a PR.

## The normal flow

1. Land your work on `main` with a [conventional commit](https://www.conventionalcommits.org)
   message (`fix:`, `feat:`, `feat!:`/`BREAKING CHANGE:` …). The repo's `fix: 🐛` / `feat: ✨`
   style already fits — the type is what matters, the emoji rides along in the description.
2. `.github/workflows/release-please.yml` opens (or updates) a PR titled
   **`chore(main): release X.Y.Z`**. It bumps `package.json` and writes `CHANGELOG.md` from
   the commits since the last release. It keeps updating as more commits land.
3. **Merge that PR when you want to ship.** Nothing publishes until you do.
4. Merging tags the release, creates the GitHub release, and publishes to npm — after
   re-running lint, build, and the test suite.

The version is decided by the commit types: `fix:` → patch, `feat:` → minor, a `!` or a
`BREAKING CHANGE:` footer → major. `chore:`, `docs:`, `ci:`, `refactor:` don't trigger a
release on their own.

To ship an exact version, put a `Release-As: 1.2.3` footer in a commit message on `main`
(see the [release-please docs](https://github.com/googleapis/release-please#how-do-i-change-the-version-number)).
A prerelease version (`1.2.0-beta.0`) is published under its own npm dist-tag (`beta`)
rather than `latest`, so `npm install slack-blocks-to-jsx` keeps installing stable.

## One-time setup: npm Trusted Publishing

Publishing uses **OIDC**, not a stored token — there is no `NPM_TOKEN` secret in this repo,
and published builds carry a [provenance attestation](https://docs.npmjs.com/generating-provenance-statements).
That needs a one-time configuration by an npm maintainer of the package (2FA must be enabled
on the account):

1. npmjs.com → the `slack-blocks-to-jsx` package → **Settings** → **Trusted Publisher**.
2. Choose **GitHub Actions** and fill in:
   - Organization / user: `themashcodee`
   - Repository: `slack-blocks-to-jsx`
   - Workflow filename: `release-please.yml`
   - Environment: leave empty
3. Save. The next merged release PR publishes without any credential in the repo.

Until this is configured, the workflow still opens release PRs and tags releases correctly —
only the final `npm publish` step fails. Fall back to the manual flow below if you need to
ship before setting it up.

## Manual fallback

The old one-command release still works, for when the workflow is broken or npm is
misbehaving:

```bash
pnpm release              # interactive — patch / minor / major / prerelease / custom
pnpm release patch        # 1.1.1 -> 1.1.2
pnpm release 1.2.3        # set an exact version
pnpm release:beta         # 1.1.1 -> 1.1.2-beta.0   (npm dist-tag: beta)
pnpm release:dry          # preview the whole thing, change nothing
```

It runs pre-flight checks (clean tree, on `main`, up to date, npm + `gh` authenticated),
lints, tests, builds, bumps `package.json`, commits `chore: release vX.Y.Z`, tags,
publishes, pushes, and creates the GitHub release. One-time setup per machine:

```bash
npm login
gh auth login
```

> **If you release manually, update `.release-please-manifest.json` to the version you just
> shipped in the same commit.** That file is release-please's record of the last release;
> if it falls behind, the next automated release PR proposes a version that's already on npm.

### If a manual release fails midway

- **Failed before publishing** — nothing was pushed. Undo the local bump:
  ```bash
  git tag -d vX.Y.Z
  git reset --hard HEAD~1
  ```
- **Published, but a later step failed** — the package is already on npm; finish the rest:
  ```bash
  git push --follow-tags origin main
  gh release create vX.Y.Z --title vX.Y.Z --generate-notes
  ```

## PR preview releases (pkg.pr.new)

Every pull request automatically gets an **installable preview build** so reviewers can try
the change before it's merged — without it ever touching the real `slack-blocks-to-jsx`
package on npm. This is handled by
[pkg.pr.new](https://github.com/stackblitz-labs/pkg.pr.new) via `.github/workflows/preview.yml`.

When a PR opens, a bot comments with an install command, e.g.:

```bash
npm install https://pkg.pr.new/slack-blocks-to-jsx@<commit-or-PR>
```

**What about new commits on the PR?** Nothing to do. Every push re-runs the workflow and
republishes; the bot **edits its existing comment** with the fresh command, and the per-PR
URL always resolves to the PR's latest commit.

This needs **no npm token** and works for PRs from forks. One-time setup (owner only):
install the **pkg.pr.new GitHub App** → <https://github.com/apps/pkg-pr-new>.

> PR previews are **not** prereleases. Previews are automatic, throwaway, and never published
> to npm. A `beta`/`alpha` is an intentional, maintainer-cut prerelease published to the real
> npm package under the `beta`/`alpha` dist-tag.

## Notes

- Releasing runs `pnpm run lint` (typecheck), `pnpm run build`, and `pnpm test` (the
  `test/*.test.mjs` suite, run against the built `dist/`) before publishing — in the workflow
  and in the manual script alike.
- CI (`.github/workflows/main.yml`) runs lint + build + tests on every push and PR, so the
  commits a release PR gathers have already been tested.
- The release PR is created by the default `GITHUB_TOKEN`, so it does not itself trigger
  the CI workflow — that's why the publish job re-runs the checks.
