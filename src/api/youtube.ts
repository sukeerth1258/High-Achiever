const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const getChannelInfo = async (handle: string) => {
  // Try to get channel by handle
  const res = await fetch(`${BASE_URL}/channels?part=snippet,contentDetails,statistics,brandingSettings&forHandle=${handle}&key=${API_KEY}`);
  const data = await res.json();
  if (data.items && data.items.length > 0) {
    return data.items[0];
  }
  
  // Fallback to search if forHandle fails
  const searchRes = await fetch(`${BASE_URL}/search?part=snippet&type=channel&q=${encodeURIComponent(handle)}&key=${API_KEY}`);
  const searchData = await searchRes.json();
  if (searchData.items && searchData.items.length > 0) {
    const channelId = searchData.items[0].snippet.channelId;
    const channelRes = await fetch(`${BASE_URL}/channels?part=snippet,contentDetails,statistics,brandingSettings&id=${channelId}&key=${API_KEY}`);
    const channelData = await channelRes.json();
    return channelData.items[0];
  }
  throw new Error('Channel not found');
};

export const getLatestVideos = async (channelId: string, pageToken?: string) => {
  const res = await fetch(`${BASE_URL}/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=10${pageToken ? `&pageToken=${pageToken}` : ''}&key=${API_KEY}`);
  return res.json();
};

export const getPlaylists = async (channelId: string, pageToken?: string) => {
  const res = await fetch(`${BASE_URL}/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=20${pageToken ? `&pageToken=${pageToken}` : ''}&key=${API_KEY}`);
  return res.json();
};

export const getPlaylistItems = async (playlistId: string, pageToken?: string) => {
  const res = await fetch(`${BASE_URL}/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=20${pageToken ? `&pageToken=${pageToken}` : ''}&key=${API_KEY}`);
  return res.json();
};

export const searchVideos = async (channelId: string, query: string, pageToken?: string) => {
  const res = await fetch(`${BASE_URL}/search?part=snippet&channelId=${channelId}&q=${encodeURIComponent(query)}&type=video&maxResults=10${pageToken ? `&pageToken=${pageToken}` : ''}&key=${API_KEY}`);
  return res.json();
};

export const getVideoDetails = async (videoId: string) => {
  const res = await fetch(`${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${API_KEY}`);
  const data = await res.json();
  return data.items?.[0];
};
