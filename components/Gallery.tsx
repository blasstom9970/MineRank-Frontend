
import React from 'react';
import type { GalleryPost, User} from '../types';

interface GalleryProps {
  posts: GalleryPost[];
  users: User[];
}

export const Gallery: React.FC<GalleryProps> = ({ posts, users }) => {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-4 text-sky-400">커뮤니티 갤러리</h3>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map(post => (
            <div key={post.id} className="group relative overflow-hidden rounded-lg shadow-lg">
              <img src={post.imageUrl} alt={post.caption} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <p className="text-sm font-semibold">{post.caption}</p>
                <p className="text-xs text-slate-300">{users.find(user => user.id === post.user)?.username ?? "익명"} 님이 작성</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 bg-slate-800 p-4 rounded-lg">아직 갤러리 게시물이 없습니다. 가장 먼저 스크린샷을 공유해보세요!</p>
      )}
    </div>
  );
};