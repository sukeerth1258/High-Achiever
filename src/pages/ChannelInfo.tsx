import { useStore } from '../store/useStore';
import { Users, Video as VideoIcon, Eye } from 'lucide-react';

export default function ChannelInfo() {
  const { channelInfo } = useStore();

  if (!channelInfo) return null;

  const { snippet, statistics, brandingSettings } = channelInfo;
  const bannerUrl = brandingSettings?.image?.bannerExternalUrl;

  const formatNumber = (num: string) => {
    const n = parseInt(num, 10);
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  return (
    <div className="pb-8">
      {bannerUrl ? (
        <div className="w-full h-32 sm:h-48 bg-gray-800">
          <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
      ) : (
        <div className="w-full h-32 sm:h-48 bg-gradient-to-r from-[#1A73E8] to-[#111111]" />
      )}

      <div className="max-w-md mx-auto px-4 relative -mt-12">
        <div className="flex flex-col items-center">
          <img
            src={snippet.thumbnails.high?.url || snippet.thumbnails.default?.url}
            alt={snippet.title}
            className="w-24 h-24 rounded-full border-4 border-[#111111] bg-[#1A1A1A] shadow-xl"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-2xl font-bold text-white mt-4 text-center">{snippet.title}</h1>
          {snippet.customUrl && (
            <p className="text-gray-400 text-sm mt-1">{snippet.customUrl}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-[#1A1A1A] rounded-2xl p-4 flex flex-col items-center border border-white/5">
            <Users className="text-[#1A73E8] mb-2" size={24} />
            <span className="text-lg font-bold text-white">{formatNumber(statistics.subscriberCount)}</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">Subs</span>
          </div>
          <div className="bg-[#1A1A1A] rounded-2xl p-4 flex flex-col items-center border border-white/5">
            <VideoIcon className="text-[#F9C80E] mb-2" size={24} />
            <span className="text-lg font-bold text-white">{formatNumber(statistics.videoCount)}</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">Videos</span>
          </div>
          <div className="bg-[#1A1A1A] rounded-2xl p-4 flex flex-col items-center border border-white/5">
            <Eye className="text-emerald-500 mb-2" size={24} />
            <span className="text-lg font-bold text-white">{formatNumber(statistics.viewCount)}</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">Views</span>
          </div>
        </div>

        <div className="mt-8 bg-[#1A1A1A] rounded-2xl p-5 border border-white/5">
          <h2 className="text-lg font-semibold text-white mb-3">About</h2>
          <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
            {snippet.description || 'No description available.'}
          </p>
        </div>
      </div>
    </div>
  );
}
