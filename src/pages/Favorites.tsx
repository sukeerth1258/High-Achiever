import { useStore } from '../store/useStore';
import VideoCard from '../components/VideoCard';
import { Heart } from 'lucide-react';

export default function Favorites() {
  const { favorites } = useStore();

  return (
    <div className="p-4 max-w-md mx-auto">
      <header className="mb-6 mt-2">
        <h1 className="text-2xl font-bold text-white">Favorites</h1>
      </header>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
          <Heart size={48} className="mb-4 opacity-20" />
          <p>No favorite videos yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
