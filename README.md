# ATLAS Exchange - Libya (Static Website)

Responsive one-page website for **ATLAS Exchange** built with plain **HTML/CSS/JavaScript** (no frameworks).

## Files

- `index.html`: Full markup, styling, and JS interactions.
- `README.md`: Project overview and run notes.

## Features included

- Top strip with language placeholders (English/Arabic) and Libya customer service phone.
- Sticky header with logo, navigation, and desktop dropdown menus.
- Hero section with three CTAs.
- Four service cards.
- Two content panels: branch locations in Libya + LYD-based currency converter.
- Currency rates area with tabs (`Rates Table` / `Gold Rates`).
- Footer with policy links.
- Mobile responsive hamburger drawer menu.

## Country/currency defaults

- Base country context: **Libya**.
- Main/base currency in converter and rates: **LYD (Libyan Dinar)**.

## Run locally

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## API integration notes

`index.html` includes inline `TODO(API)` markers for future backend integration:

- Replace static `lydPerCurrency` map with live API rates.
- Include response metadata (timestamp/source) for compliance and auditing.
