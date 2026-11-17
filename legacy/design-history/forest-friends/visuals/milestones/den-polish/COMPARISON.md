# Fox den, colouring and picture letters

Build: app/cache 8.1.0, 8 November 2026, based on f974dfa. Chromium with software rendering, at 1024 × 900 and 390 × 844 CSS pixels. This follows the owner's den corrections. The original den composition, warm root walls, shelf, bed and table remain the reference; all 14 frozen baseline files and the original runtime artwork are preserved.

| State | Evidence | Result and intentional changes |
| --- | --- | --- |
| Den | [Tablet](den-1024.jpg), [phone](den-390.jpg) | The closed door is painted with matching texture, perspective and brass mail lid. The loose floor cushion is gone. A physical picture pile has a gallery button, and the Waldspiele button sits beside the shelf books. |
| Sleeping | [Tablet](sleep-1024.jpg), [phone](sleep-390.jpg) | Fuchs lies sideways, curled on the green mattress. His projected position and size adapt to the painted bed at each viewport. No floor shadow is drawn under the sleeping fox. |
| Opened letter | [Tablet](postcard-1024.jpg), [phone](postcard-390.jpg) | A large new character illustration replaces the enlarged navigation portrait. Warm paper, a small stamp and unreadable handwriting retain the pictured-invitation design. |
| Ausmalen selection | [Tablet](selection-1024.jpg), [phone](selection-390.jpg) | Six newly illustrated woodland scenes replace the current selection. Large square pictures open immediately in free mode, without a mode chooser or progress stars. |
| Colouring | [Tablet](colouring-1024.jpg), [phone](colouring-390.jpg) | Clear closed outlines work with the actual fill tool. Stamps and guided modes are unavailable. The back arrow returns to selection or gallery; Rückgängig separately undoes a paint action. |
| Meine Bilder | [Gallery](gallery-1024.jpg) | The pile-of-pictures button opens the saved gallery directly. Resuming, painting, returning and saving retain existing IndexedDB records. |

Runtime art uses three new WebP assets: `den-v2.webp` is an illustrated edit of the original den; `postcard-friends.webp` is a transparent six-character portrait sheet; `colouring-friends.webp` is a six-panel black-and-white colouring sheet. Artwork was generated with the image tool using the established woodland references. Portraits are selected with CSS background positions; colouring pages draw their individual sheet regions into the existing outline/fill engine. The previous den and original page identifiers remain intact for history and saved pictures.

Validation: all model/content/save suites; the dedicated den browser journey, including actual touch fill, closed regions on every new page, saved stamp-tool migration, working back navigation, gallery save/resume and offline restoration; the complete original/new puzzle library and free-drawing regression; real-time bed sleep/Skip; and the saved letter adventure with normal-motion mail-lid delivery. The software screenshots establish appearance and browser behaviour; physical iPad/Safari and child observation remain separate checks.
