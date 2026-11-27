# Upstream reference

ACRYL AXI is a fork of [Lavish Editor / `lavish-axi`](https://github.com/kunchenguid/lavish-axi) v0.1.99 by Kun Chen, MIT. The fork carries the product rename, ACRYL's direction, and its own release line. Upstream remains the provenance of the codebase and a source of fixes and ideas.

## The submodule

Upstream is vendored as a git submodule:

- Path: `upstream/lavish-axi`
- Remote: `https://github.com/kunchenguid/lavish-axi`
- Branch tracked for reference: `main`
- Pin: the parent repository commit records the exact upstream commit.

After cloning, initialize it:

```sh
git clone https://github.com/acryldev/acrylaxi.git
cd acrylaxi
git submodule update --init upstream/lavish-axi
```

If the submodule is missing, the upstream scripts tell you the same command rather than guessing at a checkout.

## Reference only

`upstream/` is read-only reference material:

- Never edit files under `upstream/`, and never push to it.
- Never build, test, lint, format, or install dependencies for it.
- Never import from it. Acrylaxi code never resolves through `upstream/`.
- Never copy files from `upstream/` over Acrylaxi files. A port is a hand edit that keeps Acrylaxi's names, paths, and contracts.

A rename cannot be fast-forwarded, so there is no merge relationship between the two trees. The submodule exists to read the diff and to keep the pin explicit.

## Scripts

Two root scripts report on and move the pin. Both refuse to guess and both print what they did.

### `pnpm run upstream:status`

Fetches upstream and reports pinned versus latest upstream, the number of commits behind and ahead, a file-change summary grouped by top-level directory, and the recent upstream commit subjects. It never modifies the submodule. `upstream:status` is the check mode of the sync script; running that script with `--json` prints the same summary as JSON for tooling.

Run it whenever you want to know whether adopting upstream changes is worth a session.

### `pnpm run upstream:pull`

Fast-forwards the submodule checkout to upstream `main`, prints what changed (diff stat plus the changed files grouped by directory), and reminds you how to review it. It refuses to move a submodule that has local changes, because a dirty checkout would hide what upstream actually changed.

`upstream:pull` moves the submodule checkout only. It does not touch any Acrylaxi file, because adoption is always deliberate.

## Adoption policy

Porting upstream is a deliberate decision per change, never a bulk merge.

1. **Look first.** Run `pnpm run upstream:status`. Read the commit list. A release note that is irrelevant to our surface costs nothing to skip.
2. **Read the diff.** Run `pnpm run upstream:pull`, then `git -C upstream/lavish-axi log -p <old-pin>..<new-pin> -- src test`. Review with the pin that the pull reported, not with an assumed range.
3. **Decide per change.** Security fixes, protocol correctness, and user-visible bug fixes are usually worth porting. New upstream product surface is a product decision for ACRYL, not an automatic port.
4. **Port by hand.** Re-apply the change in Acrylaxi files with Acrylaxi names (`acrylaxi`, `ACRYLAXI_*`, `data-acrylaxi-*`, `window.acrylaxi`, `%% acrylaxi-icon`, `~/.acrylaxi/`, `.acrylaxi/`). Port or adapt the matching test. Do not reintroduce upstream naming, paths, or guidance strings.
5. **Update the owning docs in the same change.** A port that changes behavior touches [README.md](../README.md); one that changes architecture, security, or an easy-to-reintroduce failure mode touches [docs/invariants.md](invariants.md); one that changes what agents are told touches the CLI guidance that owns it.
6. **Verify.** Run `pnpm run check` and any opt-in browser suite the change needs.
7. **Commit the pin separately.** The submodule pin update is its own commit, never mixed with product code, so a port can be reverted without losing the pin and vice versa.

If an upstream change conflicts with an ACRYL decision, ACRYL wins and the conflict belongs in the change description. Write down why upstream was not adopted when the reason is not obvious, so the next person does not re-litigate it.

## License and attribution

Upstream is MIT. Its copyright line is preserved in [LICENSE](../LICENSE), and the attribution is recorded in [THIRD-PARTY-NOTICES.md](../THIRD-PARTY-NOTICES.md):

> ACRYL AXI is extended from Lavish Editor / lavish-axi by Kun Chen (https://github.com/kunchenguid/lavish-axi), MIT.

Any file ported from upstream stays under that notice. Do not remove the upstream attribution from the product.
