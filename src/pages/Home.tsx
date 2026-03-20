import { useEffect, useState, useRef, useCallback } from 'react';
import { getLatestVideos } from '../api/youtube';
import { useStore, Video } from '../store/useStore';
import VideoCard from '../components/VideoCard';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { channelId } = useStore();
  const [videos, setVideos] = useState<Video[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastVideoElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && nextPageToken) {
        fetchVideos(nextPageToken);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, nextPageToken]);

  const fetchVideos = async (pageToken?: string) => {
    if (!channelId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getLatestVideos(channelId, pageToken);
      const newVideos: Video[] = data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
      }));
      
      setVideos(prev => pageToken ? [...prev, ...newVideos] : newVideos);
      setNextPageToken(data.nextPageToken || null);
    } catch (err) {
      setError('Failed to load videos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (channelId && videos.length === 0) {
      fetchVideos();
    }
  }, [channelId]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <header className="mb-6 mt-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Latest Videos</h1>
        <div className="w-8 h-8 bg-[#1A73E8] rounded-full flex items-center justify-center">
          <span className="text-[#F9C80E] font-bold">X</span>
        </div>
      </header>

      {error && (
        <div className="text-red-400 text-center p-4 bg-red-400/10 rounded-xl mb-4">
          {error}
          <button onClick={() => fetchVideos()} className="ml-2 underline">Retry</button>
        </div>
      )}

      <div className="space-y-4">
        {videos.map((video, index) => {
          if (videos.length === index + 1) {
            return (
              <div ref={lastVideoElementRef} key={video.id}>
                <VideoCard video={video} />
              </div>
            );
          } else {
            return <VideoCard key={video.id} video={video} />;
          }
        })}
      </div>

      {loading && (
        <div className="flex justify-center p-6">
          <Loader2 className="w-8 h-8 animate-spin text-[#1A73E8]" />
        </div>
      )}
      
      {!loading && videos.length === 0 && !error && (
        <div className="text-center text-gray-400 mt-10">
          No videos found.
        </div>
      )}
    </div>
  );
}
