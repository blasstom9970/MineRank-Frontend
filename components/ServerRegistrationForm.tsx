import React, { useState } from 'react';
import type { Server } from '../types';
import { AINameGenerator } from './AINameGenerator';
import { createServer } from '../constants';

interface ServerRegistrationFormProps {
    onRegister: (serverData: Omit<Server, 'id' | 'rank' | 'onlinePlayers'>) => void;
    onCancel: () => void;
}

export const ServerRegistrationForm: React.FC<ServerRegistrationFormProps> = ({ onRegister, onCancel }) => {
    const [name, setName] = useState('');
    const [ip, setIp] = useState('');
    const [version, setVersion] = useState('1.20.1');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [maxPlayers, setMaxPlayers] = useState('100');
    const [bannerUrl, setBannerUrl] = useState('');
    const [error, setError] = useState('');
    
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !ip || !version || !description || !maxPlayers || !bannerUrl) {
            setError('모든 필드를 입력해주세요.');
            return;
        }
        
        const parsedMaxPlayers = parseInt(maxPlayers, 10);
        if (isNaN(parsedMaxPlayers) || parsedMaxPlayers <= 0) {
            setError('최대 플레이어 수는 양수여야 합니다.');
            return;
        }

        setError('');
        setSubmitting(true);
        try {
            const created = await createServer({
                name,
                ip,
                version,
                description,
                tags: tags,
                maxPlayers: parsedMaxPlayers,
                bannerUrl,
            });
            onRegister(created);
        } catch (err: any) {
            setError(err?.message ?? String(err));
        } finally {
            setSubmitting(false);
        }
    };
    
    const handleNameSelect = (selectedName: string) => {
        setName(selectedName);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-black text-white mb-2 tracking-tight">당신의 서버를 등록하세요</h2>
                <p className="text-slate-400 mb-6">우리 목록에 서버를 추가하여 플레이어들이 당신의 커뮤니티를 발견하게 하세요.</p>
                
                <div className="mb-6">
                    <AINameGenerator onSelectName={handleNameSelect} />
                </div>

                <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-lg border border-slate-700 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="server-name" className="block text-sm font-medium text-slate-300 mb-2">서버 이름</label>
                            <input
                                id="server-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                                placeholder="예: 픽셀버스" required
                            />
                        </div>
                        <div>
                            <label htmlFor="server-ip" className="block text-sm font-medium text-slate-300 mb-2">서버 IP 주소</label>
                            <input
                                id="server-ip" type="text" value={ip} onChange={(e) => setIp(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                                placeholder="예: play.pixelverse.net" required
                            />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="server-version" className="block text-sm font-medium text-slate-300 mb-2">마인크래프트 버전</label>
                            <input
                                id="server-version" type="text" value={version} onChange={(e) => setVersion(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                                placeholder="예: 1.20.1" required
                            />
                        </div>
                        <div>
                            <label htmlFor="max-players" className="block text-sm font-medium text-slate-300 mb-2">최대 플레이어</label>
                            <input
                                id="max-players" type="number" value={maxPlayers} onChange={(e) => setMaxPlayers(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                                placeholder="예: 100" required min="1"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="banner-url" className="block text-sm font-medium text-slate-300 mb-2">배너 이미지 URL</label>
                        <input
                            id="banner-url" type="url" value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                            placeholder="https://your-host.com/banner.png" required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">설명</label>
                        <textarea
                            id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5}
                            className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                            placeholder="플레이어들에게 당신의 서버가 특별한 이유를 알려주세요!" required
                        />
                    </div>
                     <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-slate-300 mb-2">태그 (쉼표로 구분)</label>
                        <input
                            id="tags" type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                            placeholder="예: 생존, PvP, 경제"
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm font-medium bg-red-900/20 border border-red-500/30 rounded-md px-3 py-2">{error}</p>}
                    <div className="flex justify-end space-x-4 pt-4 border-t border-slate-700">
                         <button type="button" onClick={onCancel} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-md transition-colors duration-300">
                            취소
                        </button>
                        <button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-6 rounded-md transition-colors duration-300 transform hover:scale-105 disabled:opacity-60">
                            {submitting ? '등록 중...' : '서버 등록하기'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};