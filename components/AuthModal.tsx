import React, { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onLogin: (payload: { username: string; password: string }) => Promise<void>;
  onSignup: (payload: { username: string; password: string }) => Promise<void>;
}

const AuthModal: React.FC<Props> = ({ open, onClose, onLogin, onSignup }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (mode === 'login') {
        await onLogin({ username, password });
      } else {
        await onSignup({ username, password });
      }
      setUsername('');
      setPassword('');
      onClose();
    } catch (err: any) {
      setError(err?.message ?? '요청 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{mode === 'login' ? '로그인' : '회원가입'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <div className="flex space-x-2 mb-4">
          <button
            className={`flex-1 py-2 rounded-md ${mode === 'login' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-200'}`}
            onClick={() => setMode('login')}
          >로그인</button>
          <button
            className={`flex-1 py-2 rounded-md ${mode === 'signup' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-200'}`}
            onClick={() => setMode('signup')}
          >회원가입</button>
        </div>

        {error && (
          <div className="mb-3 text-sm text-red-400">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">아이디</label>
            <input
              className="w-full bg-slate-700 text-white rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={2}
              maxLength={32}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">비밀번호</label>
            <input
              className="w-full bg-slate-700 text-white rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
              maxLength={64}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-md disabled:opacity-50"
          >{submitting ? '처리 중...' : (mode === 'login' ? '로그인' : '회원가입')}</button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
