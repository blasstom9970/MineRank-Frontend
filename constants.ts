import type { Server, User, Review, GalleryPost, CommunityPost, CommunityComment } from './types';

async function fetchOrThrow<T>(endpoint: string): Promise<T> {
  const res = await fetch(process.env.VITE_MAIN_API_URL+endpoint);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request to ${endpoint} failed: ${res.status} ${res.statusText} ${text}`);
  }
  const data = await res.json();
  return data as T;
}

// --- Exported async fetch functions ---
export const fetchUsers = async (): Promise<User[]> => fetchOrThrow<User[]>('/api/users');
export const fetchID = async (): Promise<number> => parseInt(await fetchOrThrow<string>('/api/me'));
export const fetchServers = async (): Promise<Server[]> => fetchOrThrow<Server[]>('/api/servers');
export const fetchReviews = async (): Promise<Review[]> => fetchOrThrow<Review[]>('/api/reviews');
export const fetchGalleryPosts = async (): Promise<GalleryPost[]> => fetchOrThrow<GalleryPost[]>('/api/gallery');
export const fetchCommunityPosts = async (): Promise<CommunityPost[]> => fetchOrThrow<CommunityPost[]>('/api/community/posts');
export const fetchCommunityComments = async (): Promise<CommunityComment[]> => fetchOrThrow<CommunityComment[]>('/api/community/comments');

// --- POST helpers ---
async function postOrThrow<T, B = any>(endpoint: string, body: B): Promise<T> {
  const res = await fetch(process.env.VITE_MAIN_API_URL+endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`POST ${endpoint} failed: ${res.status} ${res.statusText} ${text}`);
  }
  const data = await res.json();
  return data as T;
}

// --- Create endpoints ---
export const createServer = async (serverData: Omit<import('./types').Server, 'id' | 'rank' | 'onlinePlayers'>) =>
  postOrThrow<import('./types').Server>('/api/servers', serverData);

export const createReview = async (reviewData: Omit<import('./types').Review, 'id' | 'timestamp'>) =>
  postOrThrow<import('./types').Review>('/api/reviews', reviewData);

export const createCommunityPost = async (postData: Omit<import('./types').CommunityPost, 'id' | 'timestamp' | 'views' | 'recommendations' | 'commentCount'>) =>
  postOrThrow<import('./types').CommunityPost>('/api/community/posts', postData);

export const createCommunityComment = async (commentData: Omit<import('./types').CommunityComment, 'id' | 'timestamp'>) =>
  postOrThrow<import('./types').CommunityComment>('/api/community/comments', commentData);