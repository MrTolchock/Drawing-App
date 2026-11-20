# Karte mit Steinbock-Aufstieg — 9.4.15

Der echte Kartendialog zeigt die neue Malerei mit dem Aufstieg vom Höhlenweg zum Steinbock, der Holzbrücke östlich des Fuchsbaus und dem Ast-Damm am Biberteich.

- [Tablet, 1080 × 810](tablet.png)
- [Telefon, 390 × 844](phone.png)

Die Aufnahmen stammen aus Chromium mit Touch-Eingabe, reduziertem Bewegungseffekt, wegwerfbarem Speicher und abgefangenen Review-APIs. Der Browsertest `tests/drawn-map-browser.cjs` bedient alle 13 Kartenpunkte auf Tablet, Telefon und im Telefon-Querformat. Er prüft echte Wegwahl, getrennte 64-px-Tippflächen, Wischen, Schliessen per Aussentipp und Escape sowie die Fokusrückgabe. Der Modelltest vergleicht die Bezugspunkte des neuen Aufstiegs, der Brücke und beider Dammenden mit der aktuellen Weltgeometrie und prüft die stetige Projektion ohne umgeklappte Dreiecke.
