# Contributing

Thanks for wanting to contribute. ACRYL AXI is MIT-licensed, extended from [Lavish Editor](https://github.com/kunchenguid/lavish-axi) by Kun Chen, and maintained by ACRYL.

## Ground rules

- **Inbound is outbound.** Contributions are accepted under the MIT license in [LICENSE](LICENSE). By opening a pull request you agree your contribution may be distributed under it, and you keep the copyright on what you wrote.
- **One name.** The product is ACRYL AXI, the command and package are `acrylaxi`, the env prefix is `ACRYLAXI_`, and artifact contracts use `data-acrylaxi-*`, `window.acrylaxi`, `%% acrylaxi-icon`, and `.acrylaxi/`. A change that renames anything must rename code, tests, and docs together; docs/code naming drift is treated as a defect.
- **`upstream/` is read-only.** `upstream/lavish-axi` is a reference submodule. Never edit files under it, never build or test it, never import from it. Adoption of an upstream change is a deliberate hand port; see [docs/upstream-reference.md](docs/upstream-reference.md).
- **Generated files stay generated.** `skills/acrylaxi/SKILL.md` and root `plugin.json` are produced by `pnpm run build:skill` and `pnpm run build:plugin`. Do not hand-edit them, and commit the regenerated output.
- **`CHANGELOG.md` is not yours.** Release-please owns every entry after the fork-provenance header, and `.release-please-manifest.json` is machine state.
- **Do not edit code outside your change.** If several people are working at once, split by scope and coordinate the rename instead of touching another owner's files.

## Local setup

Node 22+ with Corepack-enabled pnpm.

```sh
git clone https://github.com/acryldev/acrylaxi.git
cd acrylaxi
git submodule update --init upstream/lavish-axi
pnpm install --frozen-lockfile
pnpm run check
```

`pnpm run check` runs the build, lint, format check, typecheck, tests, and the generated-skill/plugin freshness checks. Run it before you push; a change that only updates the CLI but not its generated skill or plugin fails it.

Useful commands while working:

```sh
node --test test/server.test.js                                  # one test file
node --test --test-name-pattern "createOpenOutput" test/cli-output.test.js
ACRYLAXI_BROWSER_E2E=1 node --test test/layout-audit-browser.test.js test/layout-warning-inbox.browser.test.js
```

The browser suites need `chrome-devtools-axi` and are opt-in.

## Workflow

1. Open an issue, or fork the repo and branch from `main`.
2. Make the change with a test where behavior changes (TDD for fixes and features).
3. Run `pnpm run check` until it is green.
4. Commit with [Conventional Commits](https://www.conventionalcommits.org/) (`fix(cli): ...`, `feat(whiteboard): ...`, `docs: ...`). Release-please reads them to compute the next version and the changelog entry, so a vague subject becomes a vague release note.
5. Open a pull request against `main` and describe the behavior change, the user-visible consequence, and what you ran to verify it. Include a screenshot or the artifact when the change is visual.

Small, focused pull requests are reviewed fastest. Do not mix a rename with a behavior change, and do not update the submodule pin in the same commit as product code.

## Docs in the same change

- User-facing contract changed? Update [README.md](README.md).
- Architecture, security, or an easy-to-reintroduce failure mode changed? Update [docs/invariants.md](docs/invariants.md).
- Acceptance-policy question? [VISION.md](VISION.md) is changed only by the maintainer.
- Every-session rule changed? Update [AGENTS.md](AGENTS.md).

## Security

Do not open a public issue for a vulnerability. Contact the maintainer privately through the contact listed on the repository's GitHub profile, and include the version, the configuration, and a minimal reproduction.

## Questions

Open an issue, or talk to us on [Discord](https://discord.gg/cY9KXMex69). The website is [acryl.dev/acrylaxi](https://acryl.dev/acrylaxi).
