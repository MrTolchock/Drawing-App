# Three.js

Three.js **0.187.0**, MIT licensed. The unmodified ES-module distribution and its
core module are bundled locally so the static PWA needs no CDN or build step.

Source: https://registry.npmjs.org/three/-/three-0.187.0.tgz

The package SHA-512 integrity was checked against the npm registry metadata before
copying these files. See LICENSE. Only the WebGL renderer is used.

`addons/` holds three files from the same package, `examples/jsm/loaders/GLTFLoader.js`,
`examples/jsm/utils/BufferGeometryUtils.js` and `examples/jsm/utils/SkeletonUtils.js`. The only
change is their import paths (`'three'` → `'../three.module.js'`, sibling addons → `./`), so they
load without an import map. They read the baked plush cast in `assets/characters/`.
