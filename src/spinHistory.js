export const HISTORY_KEY = 'singkangsong-spin-history';
export function readSpinHistory(storage) {
  try {
    const items = JSON.parse(storage.getItem(HISTORY_KEY) || '[]');
    return Array.isArray(items) ? items.filter(item => item?.song?.id && Number.isFinite(item.at)).slice(0,200) : [];
  } catch { return []; }
}
export function appendSpinHistory(history, song, at = Date.now()) {
  return [{id:crypto.randomUUID(), song, at}, ...history].slice(0,200);
}
