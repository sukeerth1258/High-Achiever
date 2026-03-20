import { useState, useEffect } from 'react';
import { searchVideos } from '../api/youtube';
import { useStore, Video } from '../store/useStore';
import VideoCard from '../components/VideoCard';
import { Loader2, Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const { channelId } = useStore();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!channelId || !debouncedQuery.trim()) {
        setVideos([]);
        return;
      }
      setLoading(true);
      try {
        const data = await searchVideos(channelId, debouncedQuery);
        const newVideos: Video[] = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
          publishedAt: item.snippet.publishedAt,
          channelTitle: item.snippet.channelTitle,
        }));
        setVideos(newVideos);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSearch();
  }, [debouncedQuery, channelId]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <header className="mb-6 mt-2">
        <h1 className="text-2xl font-bold text-white mb-4">Search</h1>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search channel..."
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#1A73E8] transition-colors"
          />
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center p-6">
          <Loader2 className="w-8 h-8 animate-spin text-[#1A73E8]" />
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
          {debouncedQuery && videos.length === 0 && !loading && (
            <div className="text-center text-gray-400 mt-10">No results found for "{debouncedQuery}"</div>
          )}
          {!debouncedQuery && (
            <div className="text-center text-gray-500 mt-10">
              Type something to search videos
            </div>
          )}
        </div>
      )}
    </div>
  );
}
