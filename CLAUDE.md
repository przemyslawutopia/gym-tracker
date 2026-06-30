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
| `js/globalTimer.js` | Timer całego treningu |
| `js/stopwatch.js` | Stopwatch między seriami |
| `js/kbToolbar.js` | Toolbar klawiatury mobilnej |
| `js/screens/home.js` | Ekran główny, popup wagi, menu ··· |
| `js/screens/daySelect.js` | Wybór dnia A/B/C/D |
| `js/screens/exerciseList.js` | Lista ćwiczeń danego dnia |
| `js/screens/exerciseLog.js` | Logowanie serii (główny ekran pracy) |
| `js/screens/weightLog.js` | Moduł wagi |
| `css/style.css` | Base styles |
| `css/theme-light.css` | Aktywny theme |
| `css/theme-dark.css` | Gotowy, nieaktywny |

## Todo — zaplanowane, czekają na implementację

Grupuj implementację tak jak poniżej (te same funkcje dotykasz raz):

**Grupa A** (storage + exerciseLog — zrób razem):
1. Historia po wariancie — `getHistory`/`getLastSession` filtrowane po `variantId`; pre-fill z właściwego wariantu (OHP hantle ≠ OHP smith)
2. Uwagi z ostatniego treningu — "ostatnio: [tekst]" nad polem notatek (z tego samego wariantu)
3. Odwrotna kolejność historii — `.reverse()` przy wyświetlaniu trend panelu

**Grupa B** (CSS/drobnostki — zrób razem):
4. Textarea auto-grow — rośnie z tekstem, nie sztywne `rows`
5. KbToolbar — usunąć nawigację między polami, zostaje tylko "Done"

**Osobno:**
6. Timer większy gdy tyka — większy font `#gt-display` tylko gdy aktywny
7. Timer całego treningu + liczba serii w headerze exercise-log jako "12 serii · 1h 23m"

## Backlog (bez decyzji, nie implementuj bez pytania)

- Zmiana kolejności ćwiczeń (drag & drop lub przyciski)
- Ćwiczenia jednorącz — osobne RIR lewa/prawa
- Marker "undershoot" dla RIR
- UI redesign (dark theme gotowy, czeka na inspo)

## Git workflow (praca na dwóch maszynach)

Przed zamknięciem sesji: `git commit + push`  
Po otwarciu na drugiej maszynie: `git pull`
