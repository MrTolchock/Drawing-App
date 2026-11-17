# Private playable preview

> Archived design/review note. Implementation and approval statements describe the stage when it was written. See the [current app notes](../../../archive/project-baseline/docs/HEART-TREE.md) and [design index](../../../archive/project-baseline/design/README.md) for the present build.

[https://farbtupf-herzbaum-preview-k7m4.andreas-itten.chatgpt.site](https://farbtupf-herzbaum-preview-k7m4.andreas-itten.chatgpt.site)

Sign in with the same ChatGPT account that owns this chat. The Site is owner-private. This is a hosted review copy of the first playable slice; the existing public GitHub Pages app is not replaced.

The original localhost link referred to the cloud workspace and was not reachable from the user's device. This HTTPS Site replaces that preview link. Native Sites deployment status confirmed success.

## Source and future updates

- Application source remains `/workspace/Drawing-App`.
- Private Site checkout: `/workspace/sites/farbtupf-herzbaum-preview`.
- Project ID: `appgprj_6aec8e8bbc8881918b4e3816e2f298e8`.
- Hosting manifest: `/workspace/sites/farbtupf-herzbaum-preview/.openai/hosting.json`, declaring `dist`.
- Deployed source commit: `d33c6b1ef98778db1f4345ccfc30a1a2dc2c0392`.
- Deployment ID: `appgdep_6aec9001628c8191b7645fe42ff01dc5`.

The preview's `dist` contains the exact runtime files listed by the app's service worker, plus the service worker and Three.js license. `SOURCE-FILES.json` records the copied file hashes. No localStorage, browser profile, saved drawing or credential is copied.

For future preview updates, preserve this project ID and its owner-private audience. Update the original application, sync its runtime files to this checkout, and use the Sites source/version/private-deployment workflow. Source credentials are short-lived and must remain in process memory. Obtain a fresh native credential when needed; no credential is stored here.

For local development, run `python3 -m http.server 8000 --bind 0.0.0.0` in the original application directory. That address is only usable in a browser with access to the same workspace.
