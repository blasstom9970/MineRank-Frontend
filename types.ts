export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Review {
  id: number;
  serverId: number;
  user: User;
  rating: number;
  comment: string;
  timestamp: string;
}

export interface GalleryPost {
  id: number;
  serverId: number;
  user: User;
  imageUrl: string;
  caption: string;
  timestamp: string;
}

export interface Server {
  id: number;
  rank: number;
  name: string;
  ip: string;
  version: string;
  description: string;
  tags: string[];
  onlinePlayers: number;
  maxPlayers: number;
  bannerUrl: string;
}

export interface CommunityPost {
  id: number;
  serverId: number;
  user: User;
  title: string;
  content: string;
  timestamp: string;
  views: number;
  recommendations: number;
  commentCount: number;
}

export interface CommunityComment {
    id: number;
    postId: number;
    user: User;
    content: string;
    timestamp: string;
}
