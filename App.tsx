import React, { useEffect, useState } from 'react';
import type { Server, User } from './types';
import { fetchServers, fetchUsers, fetchID, authLogin, authSignup, authLogout } from './constants';
import { ServerList } from './components/ServerList';
import { ServerDetail } from './components/ServerDetail';
import { ServerRegistrationForm } from './components/ServerRegistrationForm';
import { UserIcon, PlusCircleIcon } from './components/icons';
import AuthModal from './components/AuthModal';

const App: React.FC = () => {
  const [view, setView] = useState<'list' | 'detail' | 'register'>('list');
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServerId, setSelectedServerId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Default to null until users load
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [srv, usrs, me] = await Promise.all([fetchServers(), fetchUsers(), fetchID()]);
        if (!mounted) return;
        setServers(srv);
        setUsers(usrs);
        if (me === -1) {
          setCurrentUser(null);
        } else {
          setCurrentUser(me);
        }
      } catch (err: any) {
        setError(err?.message ?? String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleSelectServer = (id: number) => {
    setSelectedServerId(id);
    setView('detail');
  };

  const handleBackToList = () => {
    setSelectedServerId(null);
    setView('list');
  };
  
  const handleShowRegisterForm = () => {
    setView('register');
  };

  const handleServerRegister = (createdServer: Server) => {
    // API returns the created server; just append and re-sort by rank
    setServers(prev => [...prev, createdServer].sort((a, b) => a.rank - b.rank));
    setView('list');
  };

  const selectedServer = servers.find(s => s.id === selectedServerId);

  const handleDoLogin = async (payload: { username: string; password: string }) => {
    const me = await authLogin(payload);
    setCurrentUser(me as any);
  };

  const handleDoSignup = async (payload: { username: string; password: string }) => {
    const me = await authSignup(payload);
    setCurrentUser(me as any);
  };

  const handleLogout = async () => {
    await authLogout();
    setCurrentUser(null);
  };

  const renderContent = () => {
    switch (view) {
      case 'detail':
        if (selectedServer) {
          return <ServerDetail server={selectedServer} onBack={handleBackToList} currentUser={currentUser} />;
        }
        // Fallback to list if server not found
        handleBackToList();
        return null;
      case 'register':
        return <ServerRegistrationForm onRegister={handleServerRegister} onCancel={handleBackToList} />;
      case 'list':
      default:
        return <ServerList servers={servers} onSelectServer={handleSelectServer} onShowRegisterForm={handleShowRegisterForm} />;
    }
  };

  return (
    <div className="bg-transparent text-slate-200 min-h-screen font-sans flex flex-col">
      <header className="bg-slate-900/70 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1
            className="text-2xl font-bold text-emerald-400 cursor-pointer hover:text-emerald-300 transition-colors"
            onClick={handleBackToList}
            aria-label="서버 목록으로 돌아가기"
          >
            마인랭크
          </h1>

          <div className="flex items-center space-x-6">
            {currentUser && view !== 'register' && (
              <button
                onClick={handleShowRegisterForm}
                className="hidden md:flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105"
              >
                <PlusCircleIcon className="w-5 h-5" />
                <span>서버 등록</span>
              </button>
            )}

            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-slate-700/50">
                  <UserIcon className="w-5 h-5 text-cyan-400" />
                  <span className="font-semibold">{currentUser?.username ?? '게스트'}</span>
                </div>

                <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 invisible group-hover:visible z-30">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-2 text-sm text-slate-300">{currentUser.username}</div>
                      <div className="border-t border-slate-700 my-1"></div>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 cursor-pointer">로그아웃</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setAuthOpen(true)} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 cursor-pointer">로그인 / 회원가입</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        {loading ? (
          <div className="container mx-auto px-4 py-8 text-center text-slate-400">로딩 중...</div>
        ) : error ? (
          <div className="container mx-auto px-4 py-8 text-center text-red-400">에러: {error}</div>
        ) : (
          renderContent()
        )}
      </main>
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onLogin={handleDoLogin}
        onSignup={handleDoSignup}
      />
      <footer className="bg-slate-900/70 border-t border-slate-800 mt-12">
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
                <div>
                    <h4 className="font-bold text-white mb-2">마인랭크</h4>
                    <p className="text-sm text-slate-400">마인크래프트 서버를 찾고 순위를 매기는 최고의 장소입니다.</p>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-200 mb-2">탐색</h4>
                    <ul className="space-y-1 text-sm text-slate-400">
                        <li><a href="#" onClick={(e) => { e.preventDefault(); handleBackToList(); }} className="hover:text-emerald-400">홈</a></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); handleShowRegisterForm(); }} className="hover:text-emerald-400">서버 등록</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-200 mb-2">법적 고지</h4>
                    <ul className="space-y-1 text-sm text-slate-400">
                        <li><a href="#" className="hover:text-emerald-400">서비스 이용약관</a></li>
                        <li><a href="#" className="hover:text-emerald-400">개인정보 처리방침</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-200 mb-2">연결</h4>
                      <ul className="space-y-1 text-sm text-slate-400">
                        <li><a href="#" className="hover:text-emerald-400">문의하기</a></li>
                        <li><a href="#" className="hover:text-emerald-400">디스코드</a></li>
                    </ul>
                </div>
            </div>
            <div className="text-center py-4 text-slate-500 text-sm border-t border-slate-800 mt-8">
                <p>MineRank는 Mojang Studios와 관련이 없습니다.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;