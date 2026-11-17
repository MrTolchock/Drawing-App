# Play and deploy

[Open Farbtupf on GitHub Pages](https://mrtolchock.github.io/Drawing-App/).

GitHub Pages publishes the repository root from `main`. A push to that branch
updates the live app after GitHub finishes its Pages deployment. The app has no
build step or runtime CDN. Its service worker caches the versioned runtime files
for offline use after the first successful load. Reload after a deployment to
receive the updated cache.

The [owner-private story review copy](https://farbtupf-herzbaum-preview-k7m4.andreas-itten.chatgpt.site)
requires signing in with the ChatGPT account that owns the preview. It is a
separately deployed copy and does not depend on the GitHub Pages deployment queue.
An adult can sign in before handing the device to the child. The preview and
GitHub Pages have separate browser-local progress because they have different
origins. A fresh browser profile gives a fresh opening without erasing existing
drawings or progress.

For local development, run `python3 -m http.server 8000 --bind 0.0.0.0` in the
repository. Open `http://localhost:8000` in a browser on that machine. A localhost
address inside a cloud workspace cannot be opened directly on another device.
