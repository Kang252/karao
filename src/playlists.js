export function appendUniqueSongs(existing, incoming) {
  const ids = new Set(existing.map(song => song.id));
  return [...existing, ...incoming.filter(song => {
    if (ids.has(song.id)) return false;
    ids.add(song.id); return true;
  })];
}

export function filterPlaylistSongs(songs, query) {
  const normalized = String(query || '').trim().toLocaleLowerCase('vi')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  if (!normalized) return songs;
  return songs.filter(song => `${song.title || ''} ${song.artist || ''}`
    .toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')
    .includes(normalized));
}
