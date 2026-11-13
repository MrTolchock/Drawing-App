# Retired drawing screens

The drawing game and saved-picture gallery were removed from the active app in 9.3.21. The den table, pencils and picture pile remain part of the unchanged background painting, without drawing/gallery icons.

These original screen sources are historical reference, not puzzle templates:

- [Drawing book](book.js)
- [Colouring editor](color.js)
- [Free drawing](free.js)
- [Saved pictures](gallery.js)

They are not registered by the app or downloaded by its service worker. Existing localStorage and IndexedDB drawing data is retained. Dependencies needed for legacy data, shared illustrations and handwriting remain in the app. Use the [current puzzle blueprint](../../design/PUZZLE-BLUEPRINT.md) for new work. File hashes are recorded in the [preservation manifest](../design-history/manifest.json).
