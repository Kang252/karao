import React, {useMemo,useState} from 'react';
import {Plus,Trash2,ListMusic,Search,X} from 'lucide-react';
import {filterPlaylistSongs} from './playlists';

export function PlaylistManager({library,onAdd,onAddAll,pendingSong,onCancelSong}) {
  const [name,setName] = useState('');
  const [selected,setSelected] = useState(null);
  const [editing,setEditing] = useState(null);
  const [renamed,setRenamed] = useState('');
  const [deleting,setDeleting] = useState(null);
  const [query,setQuery] = useState('');
  const current = library.playlists.find(p => p.id === selected) || library.playlists[0];
  const visibleSongs = useMemo(() => filterPlaylistSongs(current?.songs || [],query),[current?.songs,query]);
  const create = async e => {
    e.preventDefault(); if (!name.trim()) return;
    const created = await library.create(name,pendingSong ? [pendingSong] : []);
    if (created) { setSelected(created.id); setName(''); if (pendingSong) onCancelSong(); }
  };
  return <section className="playlist-manager">
    <h3><ListMusic size={20}/> Danh sách nhạc của bạn</h3>
    <p className="account-note">Tạo danh sách theo gu hoặc nhóm bạn. Danh sách được lưu theo tài khoản và đồng bộ giữa các thiết bị.</p>
    {library.error && <p className="playlist-error" role="alert">{library.error}</p>}
    {pendingSong && <div className="playlist-pending"><strong>Thêm “{pendingSong.title}” vào danh sách</strong><button type="button" onClick={onCancelSong}>Hủy chọn bài</button></div>}
    <form className="playlist-create" onSubmit={create}><input aria-label="Tên danh sách mới" placeholder="Tên danh sách mới…" value={name} maxLength={80} required onChange={e=>setName(e.target.value)}/><button disabled={library.busy||!name.trim()}><Plus size={16}/> Tạo danh sách{pendingSong?' và thêm bài':''}</button></form>
    {library.busy && <p role="status" className="account-note">Đang đồng bộ…</p>}
    <div className="playlist-tabs">{library.playlists.map(p=><button type="button" key={p.id} className={current?.id===p.id?'active':''} onClick={()=>{setSelected(p.id);setEditing(null);setDeleting(null);setQuery('')}}>{p.name} <span>{p.songs.length}</span></button>)}</div>
    {!library.busy&&!library.playlists.length&&<p className="account-note">Chưa có danh sách. Tạo danh sách rồi dùng nút lưu trên mỗi bài hát để thêm bài.</p>}
    {current && <div className="playlist-detail">
      <div className="playlist-heading"><h4>{current.name}</h4><button type="button" disabled={library.busy} onClick={()=>{setEditing(current.id);setRenamed(current.name)}}>Đổi tên</button><button type="button" disabled={library.busy} onClick={()=>setDeleting(current.id)}>Xóa danh sách</button></div>
      {editing===current.id&&<form className="playlist-create" onSubmit={async e=>{e.preventDefault();if(renamed.trim()&&await library.rename(current.id,renamed))setEditing(null)}}><input aria-label="Tên danh sách" maxLength={80} required value={renamed} onChange={e=>setRenamed(e.target.value)}/><button disabled={library.busy||!renamed.trim()}>Lưu tên</button><button type="button" onClick={()=>setEditing(null)}>Hủy</button></form>}
      {deleting===current.id&&<div className="playlist-delete"><p>Xóa danh sách “{current.name}”? Bài trong hàng chờ hát không bị xóa.</p><button type="button" disabled={library.busy} onClick={async()=>{if(await library.remove(current.id))setDeleting(null)}}>Xác nhận xóa</button><button type="button" onClick={()=>setDeleting(null)}>Hủy</button></div>}
      {pendingSong&&<button type="button" className="primary favorites-add-all" disabled={library.busy||current.songs.some(s=>s.id===pendingSong.id)} onClick={async()=>{if(await library.addSong(current.id,pendingSong))onCancelSong()}}><Plus/> THÊM BÀI VÀO “{current.name}”</button>}
      <button type="button" className="primary favorites-add-all" disabled={library.busy||!current.songs.length} onClick={()=>onAddAll(current.songs)}><Plus/> THÊM TẤT CẢ VÀO DANH SÁCH HÁT</button>
      {!!current.songs.length&&<><label className="playlist-search"><Search/><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm theo tên bài hoặc ca sĩ…" aria-label={`Tìm kiếm trong danh sách ${current.name}`}/>{query&&<button type="button" onClick={()=>setQuery('')} aria-label="Xóa từ khóa tìm kiếm"><X/></button>}</label><p className="playlist-search-count" role="status">{query?`${visibleSongs.length}/${current.songs.length} bài phù hợp`:`${current.songs.length} bài trong danh sách`}</p></>}
      <div className="saved-favorites">{visibleSongs.map(s=><article key={s.id}><div><strong>{s.title}</strong><small>{s.artist}</small></div><button type="button" onClick={()=>onAdd(s)}><Plus/> Hát</button><button type="button" disabled={library.busy} onClick={()=>library.removeSong(current.id,s.id)} aria-label={'Bỏ '+s.title+' khỏi danh sách'}><Trash2/></button></article>)}</div>
      {!!query&&!visibleSongs.length&&<p className="account-note">Không tìm thấy bài hoặc ca sĩ phù hợp.</p>}
      {!current.songs.length&&<p className="account-note">Danh sách đang trống. Chọn bài trong kho và bấm biểu tượng lưu danh sách.</p>}
    </div>}
  </section>;
}
