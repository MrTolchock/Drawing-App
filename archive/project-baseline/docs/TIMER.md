# Optional play-time clock

The clock starts **off**, keeping the woodland and puzzles untimed. Open its
controls with the pictured clock in **Waldspiele**, or under **Spielzeit** in
the parent settings. Opening the clock leaves the current puzzle mounted and
preserves its answers. Forest movement waits while the clock panel is open.

- **Aus** hides the clock row.
- **Stoppuhr** counts up from zero.
- **Countdown** offers 5, 10, 15, 20 or 30 minutes. Its calm progress ring counts
  down with the digits. At zero, a short sound, spoken German reminder (when
  sound and a device voice are available) and message suggest a break. The
  current game stays playable; this is a reminder, not a parental app lock.
- The triangle starts or resumes; the pause bars pause. The curved arrow resets
  the selected clock and leaves it paused. Choosing another mode or duration
  also resets and pauses it; tapping the already selected choice does not.

The enabled clock has its own row above the app, so it does not cover puzzle or
drawing controls. It measures visible app time, automatically waiting while the
app is in the background or parent settings are open. Returning resumes a clock
that was running. A manually paused clock stays paused. A reload restores the
chosen mode, duration and saved time **paused**; time away is never deducted.

Clock settings and measured time use the separate localStorage key
`farbtupf.timer.v1`, with periodic saves and immediate saves on controls/page
exit. They do not change stars, learning stages, forest progress or drawings.
No timings are scored or sent anywhere. The clock works offline after the app
has loaded successfully once.

`tests/timer.test.cjs` checks elapsed-time accuracy, interruption, one reminder
per countdown, storage isolation and safe restoration. With the local server and
Playwright/Chromium, `tests/timer-browser.cjs` checks the actual controls, live
puzzle preservation, phone layout, background/parent pauses and offline reload.
