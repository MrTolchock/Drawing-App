# Letter-limited play sessions

Open **Einstellungen → Briefe pro Spielrunde** through the adult gate. Choose **1–50 letters** (default 3). One letter is one puzzle containing five iterations. There is no clock, countdown or time limit.

Before the first letter is opened, changing the number updates that new journey. Once a journey has started, its limit stays fixed; a changed selection is saved for the next one. **Neue Briefreise starten** is the parent-only way to begin a fresh journey, including after game over. It starts in the den with an arriving letter. Drawings, puzzle reviews and interrupted puzzle work remain saved.

The child loop is:

1. Start in the den and open the pictured letter.
2. Walk to the friend on that letter. Only that character can open an approved puzzle. Other characters can be visited but give no puzzle. Direct puzzle routes and the former free-play gallery cannot open extra child rounds.
3. Solve the five iterations and celebrate. A completed puzzle spends exactly one letter; incorrect answers or reopening unfinished work do not.
4. If letters remain, meet the nearby courier for the next invitation and walk to its friend.
5. After the final puzzle, the guide points to the den. No more letters or puzzles are available. Walk home; Fuchs lies down to sleep and the game ends.

The sleeping end screen offers only adult settings. Escape, back navigation, refresh and offline reopening cannot grant another letter or restart the game. A parent must start the next journey. Every launch begins inside the den; reopening an unfinished journey retains its existing invitation and remaining allowance.

**Puzzle-Galerie öffnen** now lives in Settings and opens the existing adult catalogue/review workbench. It lists all 34 puzzles and 1,048 iterations, and supports real previews and individual sign-off. These previews do not spend letters or alter the child's journey. There is no Waldspiele shortcut in the child toolbar or den. The painting table and saved drawings remain available during an active journey.

The optional timer implementation, UI, styles and tests are retired under `archive/retired-timer/`. Its old storage key is preserved but never read by the active app. Drawings and historical saves are not cleared. Older mail saves gain a bounded session without resetting their recipient or lifetime completed-letter count; a save waiting at the courier begins with one completed letter in the new session.

The session allowance and end phases are part of the existing transactional FriendsState save. A failed write cannot spend a letter, grant a fresh allowance or claim a completed session. Review approvals remain a separate requirement for every playable puzzle.

Validation: `node --test tests/*.test.cjs` and `node tests/letter-sessions-browser.cjs`. The browser suite covers real parent controls, gallery access, invited/non-invited character clicks, whole five-task rounds, the courier, a home route, sleep/game over, reload/offline persistence and the parent-only restart at phone/tablet sizes.
