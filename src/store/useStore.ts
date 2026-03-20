import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
  views?: string;
  duration?: string;
}

interface AppState {
  channelId: string | null;
  channelInfo: any | null;
  favorites: Video[];
  setChannelInfo: (id: string, info: any) => void;
  toggleFavorite: (video: Video) => void;
  isFavorite: (videoId: string) => boolean;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      channelId: null,
      channelInfo: null,
      favorites: [],
      setChannelInfo: (id, info) => set({ channelId: id, channelInfo: info }),
      toggleFavorite: (video) => set((state) => {
        const exists = state.favorites.some(v => v.id === video.id);
        if (exists) {
          return { favorites: state.favorites.filter(v => v.id !== video.id) };
        } else {
          return { favorites: [...state.favorites, video] };
        }
      }),
      isFavorite: (videoId) => get().favorites.some(v => v.id === videoId),
    }),
    {
      name: 'high-achievers-storage',
    }
  )
);
