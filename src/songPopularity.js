export function playCount(value) {
  if (typeof value === 'number') return Number.isFinite(value) && value >= 0 ? value : null;
  const match = String(value ?? '').trim().match(/^(\d+(?:[.,]\d+)?)\s*([KMB])?$/i);
  if (!match) return null;
  const count = Number(match[1].replace(',', '.')) * ({ K: 1e3, M: 1e6, B: 1e9 }[match[2]?.toUpperCase()] ?? 1);
  return Number.isFinite(count) ? count : null;
}

export function sortByPlays(songs) {
  return [...songs].sort((a, b) => (playCount(b.plays) ?? -1) - (playCount(a.plays) ?? -1));
}
