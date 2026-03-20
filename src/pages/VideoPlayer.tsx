import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVideoDetails, getLatestVideos } from '../api/youtube';
import { useStore, Video } from '../store/useStore';
import VideoCard from '../components/VideoCard';
import { Loader2, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../lib/utils';

export default function VideoPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { channelId, toggleFavorite, isFavorite } = useStore();
  
  const [videoDetails, setVideoDetails] = useState<any>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const favorite = id ? isFavorite(id) : false;

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const details = await getVideoDetails(id);
        setVideoDetails(details);
        
        if (channelId) {
          // Fetch latest videos as related
          const related = await getLatestVideos(channelId);
          const newVideos: Video[] = related.items
            .filter((item: any) => item.id.videoId !== id)
            .map((item: any) => ({
              id: item.id.videoId,
              title: item.snippet.title,
              thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
              publishedAt: item.snippet.publishedAt,
              channelTitle: item.snippet.channelTitle,
            }));
          setRelatedVideos(newVideos);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, channelId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: videoDetails?.snippet?.title,
        url: `https://youtube.com/watch?v=${id}`
      });
    }
  };

  const handleFavorite = () => {
    if (!videoDetails || !id) return;
    toggleFavorite({
      id,
      title: videoDetails.snippet.title,
      thumbnail: videoDetails.snippet.thumbnails?.high?.url || videoDetails.snippet.thumbnails?.default?.url,
      publishedAt: videoDetails.snippet.publishedAt,
      channelTitle: videoDetails.snippet.channelTitle,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1A73E8]" />
      </div>
    );
  }

  if (!videoDetails) {
    return (
      <div className="p-4 text-center mt-10">
        <p className="text-red-400">Video not found</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-[#1A73E8]">Go Back</button>
      </div>
    );
  }

  const { snippet, statistics } = videoDetails;

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-40 bg-black w-full aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-4 left-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-lg font-bold text-white leading-snug mb-2">
          {snippet.title}
        </h1>
        
        <div className="flex items-center text-sm text-gray-400 mb-4">
          <span>{parseInt(statistics.viewCount).toLocaleString()} views</span>
          <span className="mx-2">•</span>
          <span>{formatDistanceToNow(new Date(snippet.publishedAt), { addSuffix: true })}</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#1A73E8] rounded-full flex items-center justify-center mr-3">
              <span className="text-[#F9C80E] font-bold">X</span>
            </div>
            <div>
              <p className="font-semibold text-white">{snippet.channelTitle}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={handleFavorite}
              className={cn(
                "flex items-center justify-center p-2.5 rounded-full transition-colors",
                favorite ? "bg-red-500/20 text-red-500" : "bg-white/10 text-white"
              )}
            >
              <Heart size={20} className={favorite ? "fill-current" : ""} />
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center justify-center p-2.5 bg-white/10 rounded-full text-white transition-colors"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-white/5 mb-8">
          <p className="text-sm text-gray-300 whitespace-pre-wrap line-clamp-3">
            {snippet.description}
          </p>
        </div>

        <h2 className="text-lg font-bold text-white mb-4">More from this channel</h2>
        <div className="space-y-4">
          {relatedVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
}
