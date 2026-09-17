import { useEffect, useRef, useState } from 'react';
import { supabase } from './supabase';
import { appendUniqueSongs } from './playlists';

export function usePlaylists(userId, notify) {
  const [playlists, setPlaylists] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const generation = useRef(0);
  const locked = useRef(false);
  useEffect(() => {
    const token = ++generation.current;
    setPlaylists([]); setError(''); locked.current = false; setBusy(false);
    if (!userId || !supabase) return;
    locked.current = true; setBusy(true);
    supabase.from('playlists').select('id,name,songs').eq('user_id', userId).order('created_at').then(({data,error}) => {
      if (token !== generation.current) return;
      locked.current = false; setBusy(false);
      if (error) setError('Không tải được danh sách: ' + error.message);
      else setPlaylists(data || []);
    });
    return () => { generation.current++; };
  }, [userId]);
  const mutate = async (operation, message) => {
    if (!userId || !supabase || locked.current) return;
    const token = generation.current;
    locked.current = true; setBusy(true); setError('');
    try {
      const {data,error} = await operation();
      if (error) throw error;
      if (token !== generation.current) return;
      setPlaylists(current => data.deleted ? current.filter(p => p.id !== data.id) : current.some(p => p.id === data.id) ? current.map(p => p.id === data.id ? data : p) : [...current,data]);
      notify(message); return data;
    } catch (err) { if (token === generation.current) setError(err.message); }
    finally { if (token === generation.current) { locked.current = false; setBusy(false); } }
  };
  const create = (name, songs = []) => mutate(() => supabase.from('playlists').insert({user_id:userId,name:name.trim(),songs:appendUniqueSongs([],songs)}).select('id,name,songs').single(), 'Đã tạo danh sách');
  const update = (id, changes, message) => mutate(() => supabase.from('playlists').update(changes).eq('user_id',userId).eq('id',id).select('id,name,songs').single(), message);
  const addSong = (id, song) => {
    const playlist = playlists.find(p => p.id === id);
    if (!playlist) return;
    if (playlist.songs.some(s => s.id === song.id)) { notify('Bài đã có trong danh sách'); return; }
    return update(id,{songs:appendUniqueSongs(playlist.songs,[song])},'Đã thêm bài vào danh sách');
  };
  const removeSong = (id, songId) => {
    const playlist = playlists.find(p => p.id === id);
    if (playlist) return update(id,{songs:playlist.songs.filter(s => s.id !== songId)},'Đã bỏ bài khỏi danh sách');
  };
  const rename = (id,name) => update(id,{name:name.trim()},'Đã đổi tên danh sách');
  const remove = id => mutate(async () => {
    const {data,error} = await supabase.from('playlists').delete().eq('user_id',userId).eq('id',id).select('id').single();
    return {data: data ? {id:data.id,deleted:true} : null,error};
  },'Đã xóa danh sách');
  return {playlists,busy,error,create,addSong,removeSong,rename,remove};
}
