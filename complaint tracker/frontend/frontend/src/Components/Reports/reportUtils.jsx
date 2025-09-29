// frontend/src/components/Reports/reportUtils.js

// Create a safe filename
export const makeFilename = (prefix, city, locality, ext = "csv") => {
  const safe = (s) => (s ? String(s).replace(/[^a-z0-9-_]/gi, "_") : "all");
  return `${prefix}_${safe(city)}_${safe(locality)}.${ext}`;
};

// Convert JSON array to CSV string (basic, handles nested objects by JSON-stringifying them)
export const jsonToCsvString = (data = []) => {
  if (!Array.isArray(data) || data.length === 0) return "";

  // determine headers: union of all keys
  const headers = Array.from(
    data.reduce((acc, row) => {
      Object.keys(row || {}).forEach((k) => acc.add(k));
      return acc;
    }, new Set())
  );

  const escape = (val) => {
    if (val === null || val === undefined) return "";
    const s = typeof val === "object" ? JSON.stringify(val) : String(val);
    // wrap in quotes if contains comma, newline, or quote
    if (/[,"\n]/.test(s)) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const lines = [headers.join(",")];
  for (const row of data) {
    const line = headers.map((h) => escape(row[h])).join(",");
    lines.push(line);
  }
  return lines.join("\n");
};