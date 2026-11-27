# Fork provenance: ACRYL AXI

ACRYL AXI is ACRYL's product fork of Lavish Editor / [`lavish-axi`](https://github.com/kunchenguid/lavish-axi) by Kun Chen, MIT.

- Fork point: upstream **v0.1.99** (`lavish-axi-v0.1.99`), imported into this repository as the baseline commit (`chore: import lavish-axi 0.1.99 tree as acrylaxi baseline`).
- Rename: product `ACRYL AXI`, command and package `acrylaxi`, env prefix `ACRYLAXI_`, artifact contracts `data-acrylaxi-*` / `window.acrylaxi` / `%% acrylaxi-icon` / `.acrylaxi/`, state dir `~/.acrylaxi/`, skill `acrylaxi`.
- Upstream stays available as read-only reference in the `upstream/lavish-axi` submodule. Adoption is a deliberate hand port; [`docs/upstream-reference.md`](../../docs/upstream-reference.md) owns the policy.
- Why: HTML is the new markdown, and the artifact is where a person can actually answer an agent. ACRYL builds the agent control surface, and Acrylaxi is its artifact surface: a local, interactive, low-token feedback loop over one HTML file.

The upstream attribution stays in [`README.md`](../../README.md), [`LICENSE`](../../LICENSE), and [`THIRD-PARTY-NOTICES.md`](../../THIRD-PARTY-NOTICES.md). Do not remove it.
