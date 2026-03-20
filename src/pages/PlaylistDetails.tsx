import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlaylistItems } from '../api/youtube';
import { Video } from '../store/useStore';
import VideoCard from '../components/VideoCard';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function PlaylistDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getPlaylistItems(id);
        const newVideos: Video[] = data.items
          .filter((item: any) => item.snippet.title !== 'Private video' && item.snippet.title !== 'Deleted video')
          .map((item: any) => ({
            id: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
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
    fetchItems();
  }, [id]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <header className="mb-6 mt-2 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4 p-2 bg-white/10 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-white line-clamp-1">Playlist Videos</h1>
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
          {videos.length === 0 && !loading && (
            <div className="text-center text-gray-400 mt-10">No videos in this playlist.</div>
          )}
        </div>
      )}
    </div>
  );
}
