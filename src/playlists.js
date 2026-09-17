export function appendUniqueSongs(existing, incoming) {
  const ids = new Set(existing.map(song => song.id));
  return [...existing, ...incoming.filter(song => {
    if (ids.has(song.id)) return false;
    ids.add(song.id); return true;
  })];
}
