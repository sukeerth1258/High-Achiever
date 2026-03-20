import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlaylists } from '../api/youtube';
import { useStore } from '../store/useStore';
import { Loader2, ListVideo } from 'lucide-react';

export default function Playlists() {
  const { channelId } = useStore();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!channelId) return;
      setLoading(true);
      try {
        const data = await getPlaylists(channelId);
        setPlaylists(data.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, [channelId]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <header className="mb-6 mt-2">
        <h1 className="text-2xl font-bold text-white">Playlists</h1>
      </header>

      {loading ? (
        <div className="flex justify-center p-6">
          <Loader2 className="w-8 h-8 animate-spin text-[#1A73E8]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {playlists.map((playlist) => (
            <Link key={playlist.id} to={`/playlists/${playlist.id}`} className="block">
              <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-lg border border-white/5 flex items-center p-3 transition-transform active:scale-[0.98]">
                <div className="relative w-32 h-24 shrink-0 rounded-xl overflow-hidden">
                  <img
                    src={playlist.snippet.thumbnails?.medium?.url || playlist.snippet.thumbnails?.default?.url}
                    alt={playlist.snippet.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                    <ListVideo size={20} className="mb-1" />
                    <span className="text-xs font-medium">{playlist.contentDetails.itemCount}</span>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-semibold line-clamp-2 text-white">
                    {playlist.snippet.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
          {playlists.length === 0 && !loading && (
            <div className="text-center text-gray-400 mt-10">No playlists found.</div>
          )}
        </div>
      )}
    </div>
  );
}
