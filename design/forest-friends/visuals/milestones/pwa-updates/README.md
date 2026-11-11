# Installed-app updates — 11 November 2026

App 9.0.3, based on `95b27dc`. The Settings screen gains an **App-Version** section with the running version, **Nach Updates suchen**, and current/download/offline/error feedback. [Phone, 390 × 844](settings-390.jpg) and [tablet, 1024 × 900](settings-1024.jpg) show the lower part of the scrollable settings page.

Compared with the [shared settings typography review](../input-typography/README.md), the warm paper, timber buttons, Baloo 2 page title and Andika controls remain. The new action is deliberately confined to the parent screen. No scene or character artwork changes; all frozen baseline files remain intact.

`tests/updates-browser.cjs` serves the actual app through a mutable local deployment. It starts with the earlier cached app and worker, installs a new release without help from the old page, checks preserved settings/progress/IndexedDB data, detects later updates through online and foreground events, defers reload during a puzzle and colouring, waits for a deliberately delayed real drawing save, and verifies failed-download/offline recovery. A fresh profile checks first-install completion without a reload loop. The screenshots use the current app with the test server's 9.0.3 release fixture and reduced motion.

These are Chromium checks. Physical iPhone/iPad Safari and Home Screen lifecycle behaviour still require device verification. See [development and recovery instructions](../../../../../docs/DEVELOPMENT.md).
