# Model identity references

The runtime UI uses the canonical painted cast in `assets/forest-friends/character-portraits.webp`, including the sleeping Fuchs. See the [shared portrait guide](../../design/artwork/LETTER-FRIENDS.md). The live world keeps its baked GLBs.

This tool renders those models only as development identity references. Serve the repository root and run `node tools/portraits/render.cjs`; the default output is `/tmp/waldpost-model-identities.webp`. Set `FARBTUPF_PORTRAITS_OUT`, `PLAYWRIGHT_MODULE` and `CHROMIUM_PATH` when needed. It must never overwrite the painted runtime atlas. Re-bake changed models first; the sculpt source is `tools/characters/plush.js`.

The preserved prior model sheet in `design/artwork/references/model-identities.webp` records the exact input used by earlier requests. Do not overwrite frozen references: save a new version and update current registered request hashes when intentionally changing an identity reference. For image generation, the canonical pair defines drawing technique; model references may define species/markings only.
