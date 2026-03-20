/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from './store/useStore';
import { getChannelInfo } from './api/youtube';

import Home from './pages/Home';
import Playlists from './pages/Playlists';
import PlaylistDetails from './pages/PlaylistDetails';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import ChannelInfo from './pages/ChannelInfo';
import VideoPlayer from './pages/VideoPlayer';
import BottomNav from './components/BottomNav';

const HANDLE = '@highachieversguidex';

function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#111111] to-[#1A73E8]"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="w-32 h-32 bg-[#F9C80E] rounded-3xl flex items-center justify-center shadow-2xl mb-6">
          <span className="text-6xl font-black text-[#111111]">X</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-wider">High Achievers Guide X</h1>
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const { setChannelInfo } = useStore();

  useEffect(() => {
    const init = async () => {
      try {
        const info = await getChannelInfo(HANDLE);
        setChannelInfo(info.id, info);
      } catch (error) {
        console.error('Failed to fetch channel info:', error);
      } finally {
        // Minimum splash screen duration
        setTimeout(() => setLoading(false), 2000);
      }
    };
    init();
  }, [setChannelInfo]);

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen bg-[#111111] text-white font-sans overflow-hidden">
        <AnimatePresence>
          {loading && <SplashScreen />}
        </AnimatePresence>

        {!loading && (
          <>
            <div className="flex-1 overflow-y-auto pb-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/playlists" element={<Playlists />} />
                <Route path="/playlists/:id" element={<PlaylistDetails />} />
                <Route path="/search" element={<Search />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/channel" element={<ChannelInfo />} />
                <Route path="/video/:id" element={<VideoPlayer />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <BottomNav />
          </>
        )}
      </div>
    </BrowserRouter>
  );
}
