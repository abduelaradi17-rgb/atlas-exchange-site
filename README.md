# ATLAS Exchange - Libya (Static Website)

Responsive one-page website for **ATLAS Exchange** built with plain **HTML/CSS/JavaScript** (no frameworks).

## Files

- `index.html`: Full markup, styling, and JS interactions.
- `netlify/functions/cbl-rates.js`: Netlify Function to fetch and parse CBL exchange rates.
- `netlify.toml`: Netlify build/functions configuration.
- `README.md`: Project overview and run notes.

## Features included

- Brand header uses the provided ATLAS wordmark logo style.
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

## Local development
## Run locally

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

> Note: live CBL rates endpoint (`/.netlify/functions/cbl-rates`) is available when running on Netlify or with Netlify CLI dev.

## API integration notes

- `index.html` fetches `/.netlify/functions/cbl-rates` and updates the rates table dynamically.
- The function returns JSON in this shape:
  - `{ base: "LYD", date: "YYYY-MM-DD", rates: { USD: { buy, sell, average, unit }, ... } }`
- `Cache-Control` for function responses is set to `public, max-age=900`.
## API integration notes

`index.html` includes inline `TODO(API)` markers for future backend integration:

- Replace static `lydPerCurrency` map with live API rates.
- Include response metadata (timestamp/source) for compliance and auditing.
