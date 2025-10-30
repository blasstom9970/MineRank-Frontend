import React, { useState, useEffect } from 'react';
import type { CommunityPost, CommunityComment, User } from '../types';
import { fetchCommunityPosts, fetchCommunityComments, createCommunityPost, createCommunityComment } from '../constants';
import { CommunityPostList } from './CommunityPostList';
import { CommunityPostDetail } from './CommunityPostDetail';
import { CommunityPostForm } from './CommunityPostForm';


interface CommunityProps {
  serverId: number;
  currentUser: User | null;
}

export const Community: React.FC<CommunityProps> = ({ serverId, currentUser }) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  
  const [view, setView] = useState<'list' | 'detail' | 'form'>('list');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [allPosts, allComments] = await Promise.all([fetchCommunityPosts(), fetchCommunityComments()]);
        if (!mounted) return;
        const serverPosts = allPosts.filter(p => p.serverId === serverId);
        setPosts(serverPosts);
        const serverPostIds = serverPosts.map(p => p.id);
        setComments(allComments.filter(c => serverPostIds.includes(c.postId)));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load community posts/comments', err);
      }
    };
    load();
    return () => { mounted = false; };

  }, [serverId]);

  const handleSelectPost = (postId: number) => {
    setSelectedPostId(postId);
    setView('detail');
  };

  const handleBackToList = () => {
    setSelectedPostId(null);
    setView('list');
  };

  const handleShowForm = () => {
    setView('form');
  };
  
  const handlePostSubmit = (title: string, content: string) => {
      if (!currentUser) return;
      (async () => {
        try {
          const created = await createCommunityPost({ serverId, user: currentUser, title, content });
          setPosts(prev => [created, ...prev]);
          setView('list');
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('Failed to create community post', err);
        }
      })();
  };

  const handleCommentSubmit = (postId: number, content: string) => {
      if (!currentUser) return;
      (async () => {
        try {
          const created = await createCommunityComment({ postId, user: currentUser, content });
          setComments(prev => [...prev, created]);
          setPosts(prevPosts => prevPosts.map(p => p.id === postId ? {...p, commentCount: p.commentCount + 1} : p));
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('Failed to create comment', err);
        }
      })();
  };

  if (view === 'detail' && selectedPostId) {
    const post = posts.find(p => p.id === selectedPostId);
    console.log('Found post:', post);
    if (!post) {
      return <div className="text-red-400">게시물을 찾을 수 없습니다. <button onClick={handleBackToList} className="underline">목록으로 돌아가기</button></div>;
    }
    const postComments = comments.filter(c => c.postId === selectedPostId);
    return <CommunityPostDetail post={post} comments={postComments} currentUser={currentUser} onBack={handleBackToList} onSubmitComment={handleCommentSubmit} />;
  }
  
  if (view === 'form') {
      return <CommunityPostForm onSubmit={handlePostSubmit} onCancel={handleBackToList} />;
  }

  return <CommunityPostList posts={posts} onSelectPost={handleSelectPost} onWritePost={handleShowForm} currentUser={currentUser} />;
};
