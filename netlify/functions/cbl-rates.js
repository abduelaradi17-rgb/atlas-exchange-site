exports.handler = async function handler() {
  const url = "https://cbl.gov.ly/en/currency-exchange-rates/";

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "ATLAS-Exchange-Netlify-Function/1.0",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      return {
        statusCode: 502,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=900",
        },
        body: JSON.stringify({ error: `CBL request failed with status ${response.status}` }),
      };
    }

    const html = await response.text();

    const cleanText = (value = "") =>
      value
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim();

    const normalizeNumber = (value = "") => {
      const normalized = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
      return normalized ? Number(normalized[0]) : null;
    };

    const dateMatch = html.match(/(\d{4}-\d{2}-\d{2})/) || html.match(/(\d{2}\/\d{2}\/\d{4})/);
    let date = new Date().toISOString().slice(0, 10);
    if (dateMatch) {
      if (dateMatch[1].includes("/")) {
        const [d, m, y] = dateMatch[1].split("/");
        date = `${y}-${m}-${d}`;
      } else {
        date = dateMatch[1];
      }
    }

    const codePattern = /\b([A-Z]{3})\b/;
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const rates = {};

    let rowMatch;
    while ((rowMatch = rowRegex.exec(html)) !== null) {
      const row = rowMatch[1];
      const cellMatches = [...row.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((m) => cleanText(m[1]));
      if (cellMatches.length < 2) continue;

      const codeCell = cellMatches.find((cell) => codePattern.test(cell));
      if (!codeCell) continue;
      const code = (codeCell.match(codePattern) || [])[1];
      if (!code || code === "LYD") continue;

      const numericCells = cellMatches
        .map((cell) => normalizeNumber(cell))
        .filter((num) => typeof num === "number" && !Number.isNaN(num));

      if (numericCells.length < 2) continue;

      const buy = numericCells[0];
      const sell = numericCells[1] ?? numericCells[0];
      const average = numericCells[2] ?? Number(((buy + sell) / 2).toFixed(6));
      const unit = numericCells[3] ?? 1;

      rates[code] = {
        buy,
        sell,
        average,
        unit,
      };
    }

    if (!Object.keys(rates).length) {
      return {
        statusCode: 502,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=900",
        },
        body: JSON.stringify({ error: "Unable to parse exchange rates from CBL response" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=900",
      },
      body: JSON.stringify({
        base: "LYD",
        date,
        rates,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=900",
      },
      body: JSON.stringify({ error: `Failed to load CBL rates: ${error.message}` }),
    };
  }
};
