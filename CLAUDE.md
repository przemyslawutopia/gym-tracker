# Gym Tracker — Claude Code Context

Single-user web app do śledzenia treningów siłowych. Właściciel: Przemysław.

**Produkcja:** https://gym-tracker-gamma-taupe.vercel.app  
**Deployment:** Vercel (auto z main branch)

## Stack i zasady

- **Vanilla JS + HTML + CSS. Zero frameworków, zero build stepa.**
- SheetJS (vendored w `lib/`) do eksportu .xlsx
- Service Worker (`sw.js`) — cache + offline
- Dane: tylko `localStorage`, brak backendu
- Mobile-first — iPhone 11 Safari / PWA

Nie wprowadzaj frameworków, bundlerów ani backendu. Nie komplikuj.

## Struktura ekranów

```
Home
├── Siłka → Day A/B/C/D → Exercise List → Exercise Log
└── Waga → formularz + historia
```

## Pliki

| Plik | Co robi |
|------|---------|
| `js/app.js` | Router, inicjalizacja |
| `js/plan.js` | Hardcoded plan A/B/C/D + słownik VARIANTS |
| `js/storage.js` | Wrapper localStorage (treningi + waga) |
| `js/export.js` | Export .xlsx (zakładki Workouts + Weight) |
| `js/globalTimer.js` | Pasek na dole: timer serii (Start/Stop/Reset, powiększa się gdy aktywny) + ambient "gt-session" zegar całego pobytu na siłce (startuje przy pierwszym Start, liczy w tle, nie resetuje się ze Stop/Reset, znika dopiero gdy appka zostanie zabita z pamięci — brak persystencji) |
| `js/stopwatch.js` | Stopwatch między seriami (singleton, używany przez globalTimer.js) |
| `js/screens/home.js` | Ekran główny, popup wagi, menu ··· |
| `js/screens/daySelect.js` | Wybór dnia A/B/C/D |
| `js/screens/exerciseList.js` | Lista ćwiczeń danego dnia |
| `js/screens/exerciseLog.js` | Logowanie serii (główny ekran pracy) |
| `js/screens/weightLog.js` | Moduł wagi |
| `css/style.css` | Base styles |
| `css/theme-light.css` | Aktywny theme |
| `css/theme-dark.css` | Gotowy, nieaktywny |

## Zrobione (ostatnia sesja, 2026-06-30)

4. Textarea notatek auto-grow (rośnie z tekstem, `rows="1"` + JS resize)
5. KbToolbar usunięty całkowicie (plik, wywołania, style — był tylko "Done", uznany za zbędny)
6. Timer serii (`#gt-display`) powiększa się gdy aktywny (1.6rem → 2.2rem)
6b. Ambient "gt-session" zegar całego pobytu na siłce — patrz opis przy `js/globalTimer.js` w tabeli Pliki

## Todo — zaplanowane, czekają na implementację

Grupuj implementację tak jak poniżej (te same funkcje dotykasz raz):

**Grupa A** (storage + exerciseLog — zrób razem):
1. Historia po wariancie — `getHistory`/`getLastSession` filtrowane po `variantId`; pre-fill z właściwego wariantu (OHP hantle ≠ OHP smith)
2. Uwagi z ostatniego treningu — "ostatnio: [tekst]" nad polem notatek (z tego samego wariantu)
3. Odwrotna kolejność historii — `.reverse()` przy wyświetlaniu trend panelu

**Osobno:**
7. Liczba serii w headerze exercise-log jako "12 serii · 1h 23m" (czas z `#gt-session`, patrz wyżej)

## Backlog (bez decyzji, nie implementuj bez pytania)

- Zmiana kolejności ćwiczeń (drag & drop lub przyciski)
- Ćwiczenia jednorącz — osobne RIR lewa/prawa
- Marker "undershoot" dla RIR
- UI redesign (dark theme gotowy, czeka na inspo)

## Git workflow (praca na dwóch maszynach)

Przed zamknięciem sesji: `git commit + push`  
Po otwarciu na drugiej maszynie: `git pull`
