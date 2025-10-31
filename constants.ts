import type { Server, User, Review, GalleryPost, CommunityPost, CommunityComment } from './types';

async function fetchOrThrow<T>(endpoint: string): Promise<T> {
  const res = await fetch(process.env.VITE_MAIN_API_URL+endpoint, {
    method: 'GET',
    credentials: 'include'
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request to ${endpoint} failed: ${res.status} ${res.statusText} ${text}`);
  }
  const data = await res.json();
  return data as T;
}

// --- Exported async fetch functions ---
export const fetchUsers = async (): Promise<User[]> => fetchOrThrow<User[]>('/api/users/');
export const fetchID = async (): Promise<number> => parseInt(await fetchOrThrow<string>('/api/auth/me'));
export const fetchServers = async (): Promise<Server[]> => fetchOrThrow<Server[]>('/api/servers');
export const fetchReviews = async (): Promise<Review[]> => fetchOrThrow<Review[]>('/api/reviews');
export const fetchGalleryPosts = async (): Promise<GalleryPost[]> => fetchOrThrow<GalleryPost[]>('/api/gallery');
export const fetchCommunityPosts = async (): Promise<CommunityPost[]> => fetchOrThrow<CommunityPost[]>('/api/community/posts');
export const fetchCommunityComments = async (): Promise<CommunityComment[]> => fetchOrThrow<CommunityComment[]>('/api/community/comments');

// --- POST helpers ---
async function postOrThrow<T, B = any>(endpoint: string, body: B): Promise<T> {
  const res = await fetch(process.env.VITE_MAIN_API_URL + endpoint, {
    method: 'POST',
    credentials: 'include',
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

export const createCommunityPost = async (postData: Omit<import('./types').CommunityPost, 'id' | 'timestamp' | 'views' | 'recommendations' | 'commentCount'>) => {
  // 백엔드가 기대하는 형식으로 변환: user 객체에서 userId 추출
  const payload = {
    serverId: postData.serverId,
    title: postData.title,
    content: postData.content
  };
  return postOrThrow<import('./types').CommunityPost>('/api/community/posts', payload);
};

export const createCommunityComment = async (commentData: Omit<import('./types').CommunityComment, 'id' | 'timestamp'>) => {
  // 백엔드가 기대하는 형식으로 변환: user 객체에서 userId 추출
  const payload = {
    postId: commentData.postId,
    content: commentData.content
  };
  return postOrThrow<import('./types').CommunityComment>('/api/community/comments', payload);
};

// --- Auth endpoints ---
export const authLogin = async (payload: { username: string; password: string }) =>
  postOrThrow<Pick<User, 'id' | 'username'>>('/api/auth/login', payload);

export const authSignup = async (payload: { username: string; password: string }) =>
  postOrThrow<Pick<User, 'id' | 'username'>>('/api/auth/signup', payload);

export const authLogout = async () => postOrThrow<{ ok: boolean }>('/api/auth/logout', {});