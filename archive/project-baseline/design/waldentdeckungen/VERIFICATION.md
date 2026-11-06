# Waldentdeckungen – Prüfung am 5. November 2026

## Automatisierte Prüfungen

68 Tests bestanden: bestehende Mathematik-/Naturspiele, acht bisherige Abenteuer, alle 24 Kreativmissionen, sieben neue Spiele auf drei Stufen, Bildabdeckung, Offline-Dateien, lesbare Eltern-Quellenansicht und unveränderte Speicherkennungen.

Die neuen Aufgaben wurden für jede Spiel-Stufen-Kombination mit 80 Zufallsfolgen à fünf Aufgaben geprüft: insgesamt 8400 generierte Aufgaben. Geprüft wurden unter anderem beide Zahlennachbarn an den Bereichsgrenzen, null und Gleichstände, die echte Umkehrung der Spiegelspalten, mathematisch passende Tausch-/Nachbarrechnungen, eindeutige Diagrammantworten und fünf verschiedene Bildwörter je Durchlauf.

## Mit dem Browser-Plugin geprüft

- Alle sieben neuen Spiele auf allen drei Stufen vollständig durchgespielt: 21 Durchläufe, 105 gelöste Aufgaben, 21 Sterne.
- Beerenvergleich erneut abgeschlossen: weiterhin 21 Sterne; Wiederholungsrückmeldung korrekt.
- Waldschatz: falsche Antwort, unbegrenzter neuer Versuch, erneutes Anschauen; Antworten während des Anschauens ausgeblendet.
- Spiegelmosaik auf 390px Telefonbreite: Tastaturtaste Enter schaltet ein Feld, Rückgängig nimmt es zurück, Leeren entfernt Eingaben, falsches Muster lässt weitere Versuche zu, korrektes Spiegelbild wird erkannt.
- Spiegelmosaik auf 390px und 820px ohne horizontalen Überlauf; 16 Eingabefelder auf der dritten Stufe. Gemessene Feldbreiten 35,25px / 61,75px.
- Wasserauftrag führt ins freie Malatelier mit sichtbarer Auftragserinnerung; die Erinnerung öffnet die lesbare Auftragskarte. «Weitermalen» kehrt zum Blatt zurück.
- Normale Schrifteinstellung: Nomen-Anfang gross, innere Buchstaben und Vokalantworten klein; Aufgabe erfolgreich gelöst.
- Elternbereich mit Quellen und Lernzielen gelesen; HTML-Quellenansicht zeigt Umlaute korrekt.
- Lokaler Server gestoppt: App neu geladen, Waldschatz mit fünf Aufgaben abgeschlossen, alle 24 Missionen verfügbar, Wasserauftrag im Atelier geöffnet, gespeichertes «Ausprobiert»-Häkchen erhalten. Quellenansicht ebenfalls ohne Server neu geladen und gelesen.
- Keine Fehler oder Warnungen im Konsolenprotokoll der eigenständigen App während dieser Spieltests.

Die responsive Vorschau lädt die echte App in zwei eingebetteten Ansichten. Sie ist ein Entwicklungsartefakt, kein zusätzlicher Kinderbildschirm. In der Browser-Automation erschien bei der erstmaligen Erstellung einzelner Vorschau-Tabs ein `MutationObserver`-Hinweis; er trat beim Neuladen nicht erneut auf. Die eigenständige App und die geprüften Spielhandlungen waren davon nicht betroffen. Es wurde kein Verhalten eines physischen iPads oder von Safari bestätigt.

## Vorschauen

- [Interaktive Vorschau](index.html): Spiegelmosaik, Waldschatz oder Waldumfrage auf Telefon und Tablet.
- [Spiegelmosaik](screenshots/spiegelmosaik-responsive.png)
- [Waldumfrage](screenshots/waldumfrage-responsive.png)
- [Waldschatz](screenshots/waldschatz-responsive.png)

Quellenstatus, altersgerechte Auswahl und eigene Übertragungen: [Recherchebericht](../../docs/RESOURCE-RESEARCH.md). Die verlinkten kostenpflichtigen Materialien wurden nicht übernommen; die Wasser-PDF-Bände wurden nicht vollständig geprüft.
