const root = 'https://is1-ssl.mzstatic.com/image/thumb/';
const covers = {
  'mot-nha': 'Music128/v4/f3/ab/83/f3ab837f-f2f0-691e-6ac0-516f2db1d6d7/886447260524.jpg',
  'noi-nay-co-anh': 'Music116/v4/13/5c/57/135c57dd-5297-81f3-0f56-1ac5dad47f8c/23UM1IM10890.rgb.jpg',
  'co-chang-trai': 'Music211/v4/f6/77/7e/f6777e54-ea7c-79db-5bdb-cc93e662e43e/5034644785936.jpg',
  'thang-tu': 'Music116/v4/a4/1e/87/a41e8763-8d49-e47a-2dc2-598f7fee8218/190296317842.jpg',
  'di-tron': 'Music122/v4/b0/89/5d/b0895d6a-8581-08de-1f6b-ee26ddb04f27/cover.jpg',
  'ngay-dau-tien': 'Music116/v4/51/60/16/51601607-1a01-d11f-6692-50f3fe4c5565/886449882595.jpg',
  'sau-tat-ca': 'Music125/v4/ce/2b/e4/ce2be4be-4bad-a72e-00f1-5fa4c624c229/759004309083_cover.jpg',
  'vi-me': 'Music112/v4/a0/57/70/a05770de-63f8-d4e3-20f3-179eae339bc9/190296096259.jpg',
  'mua-co-don': 'Music125/v4/25/16/91/25169184-4e46-5020-fcdc-01bdd513db1a/190295079093.jpg',
  'em-gai-mua': 'Music211/v4/b1/5a/18/b15a18df-5e04-a9c4-ff6b-604cf4fadf38/cover.jpg',
};

export function artworkFor(song) {
  return song.artwork || (covers[song.id] ? `${root}${covers[song.id]}/600x600bb.jpg` : '');
}
