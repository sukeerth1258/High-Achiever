import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Video } from '../store/useStore';
import React from 'react';

interface VideoCardProps {
  video: Video;
  key?: React.Key;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link to={`/video/${video.id}`} className="block mb-4">
      <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-lg border border-white/5 transition-transform active:scale-[0.98]">
        <div className="relative aspect-video">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
              {video.duration}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-sm font-semibold line-clamp-2 leading-snug mb-1 text-white">
            {video.title}
          </h3>
          <div className="flex items-center text-xs text-gray-400 mt-2 space-x-2">
            <span>{video.channelTitle}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
