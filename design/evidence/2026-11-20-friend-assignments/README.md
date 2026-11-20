# Rätsel bei allen zwölf Freunden — 9.4.16

Die Bilder stammen aus dem gemeinsamen Renderer, aufgenommen in Chromium mit Touch-Eingabe, reduziertem Bewegungseffekt, wegwerfbarem Speicher und abgefangenen Review-APIs.

| Ansicht | Beleg |
| --- | --- |
| Reh findet den Weg zum Wald, 1024 × 700 | [Weg-Rätsel](deer-route.png) |
| Fisch zählt zwei Fischgruppen zusammen, 1024 × 700 | [Mengen addieren](fish-addition.png) |
| Eisvogel übt Farbwörter, 1024 × 700 | [Farbwörter verstehen](colour-words.png) |
| Steinbock erkennt gedrehte Formen, 1024 × 700 | [Formen wiedererkennen](shape-match.png) |
| Dieselbe Formenauswahl auf Telefon, 390 × 844 | [Telefonansicht](shape-match-phone.png) |

`tests/friend-riddle-assignments-browser.cjs` bedient alle zwölf Freundfilter in der echten Erwachsenen-Galerie. Jeder Filter zeigt genau zwei freigegebene Test-Rätsel, und die gestartete Runde zeigt den zugehörigen Gastgeber. Richtige und falsche Antworten in den neuen Aktivitäten werden mit echten Touch-Aktionen geprüft. Die Reh-Figur, Felsen, Waldziel und Fischbilder stammen aus der vorhandenen Bibliothek. Galerie und Prüfung verändern keine Spielstände und schreiben keine echten Review-Daten.

`tests/ipad-puzzle-layout-browser.cjs` prüft alle 849 Aufgaben samt gefüllten Zuständen in fünf iPad-Formaten ohne Scrollen und auf Telefon mit erhaltenen Bildproportionen. Der Modelltest deckt zwei vollständige Briefzyklen ab, sodass jeder Freund beide zugeordneten Rätsel anbietet.
