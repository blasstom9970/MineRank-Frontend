import React from 'react';
import type { CommunityPost, User } from '../types';
import { PlusCircleIcon, MessageSquareIcon, ThumbsUpIcon, EyeIcon } from './icons';

interface CommunityPostListProps {
  posts: CommunityPost[];
  currentUser: User | null;
  onSelectPost: (postId: number) => void;
  onWritePost: () => void;
}

export const CommunityPostList: React.FC<CommunityPostListProps> = ({ posts, currentUser, onSelectPost, onWritePost }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-sky-400">커뮤니티 게시판</h3>
        {currentUser ? (
          <button 
            onClick={onWritePost}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
          >
            <PlusCircleIcon className="w-5 h-5" />
            <span>게시물 작성하기</span>
          </button>
        ) : (
          <div className="text-slate-400 text-sm">
            게시물을 작성하려면 로그인해야 합니다.
          </div>
        )}
      </div>
      
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="divide-y divide-slate-700">
            {posts.length > 0 ? posts.map(post => (
                <div key={post.id} onClick={() => onSelectPost(post.id)} className="p-4 hover:bg-slate-700/50 cursor-pointer transition-colors duration-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-lg font-semibold text-slate-100 hover:text-emerald-400">{post.title}
                                <span className="text-cyan-400 ml-2">[{post.commentCount}]</span>
                            </h4>
                            <p className="text-sm text-slate-400">{post.user.username} 님 • {new Date(post.timestamp).toLocaleDateString()}</p>
                        </div>
                        <div className="flex space-x-4 text-sm text-slate-400 items-center shrink-0 ml-4">
                            <span className="flex items-center space-x-1"><ThumbsUpIcon className="w-4 h-4"/><span>{post.recommendations}</span></span>
                            <span className="flex items-center space-x-1"><EyeIcon className="w-4 h-4"/><span>{post.views}</span></span>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="p-6 text-center text-slate-400">
                    <p>아직 커뮤니티 게시물이 없습니다. 가장 먼저 토론을 시작해보세요!</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};