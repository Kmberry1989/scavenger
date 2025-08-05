import React, { useMemo } from 'react';
import { Award, Trophy, Route, ImageIcon, Sparkles, PenSquare } from 'lucide-react';

const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const FinishedScreen = ({ playerData, setShowModal, callGemini }) => {
    const finalPhrase = useMemo(() => ["ART", "BRINGS", "COMMUNITY", "TOGETHER", "THROUGH", "CREATIVITY", "SHARED", "DISCOVERY", "IN KOKOMO"].join(' '), []);
    const handleStoryClick = () => {
        const prompt = `Tell me a short, captivating story (2-3 paragraphs) about the history and atmosphere of downtown Kokomo, Indiana, around the time the Hotel Frances was in its prime.`;
        callGemini(prompt, "A Story from Old Kokomo");
    };
    const handlePostClick = () => {
        const prompt = `I just finished the Kokomo Art & Heritage Scavenger Hunt! My final score was ${playerData.score}. Draft a fun, engaging social media post for me to share on Facebook or Instagram. Mention the Kokomo Art Association and how much fun I had exploring the city's history. Include relevant hashtags like #KokomoArt, #CityOfFirsts, #KAA, and #ArtHunt.`;
        callGemini(prompt, "Draft Social Media Post");
    };
    const handleHuntStoryClick = () => {
        const prompt = `My name is ${playerData.playerName}. I just completed the Kokomo Art & Heritage Scavenger Hunt in ${formatTime(playerData.timer)}. My final score was ${playerData.score}. Write a fun, personalized, one-paragraph summary of my adventure, celebrating my achievements as a "Kokomo Explorer".`;
        callGemini(prompt, "✨ Your Unique Adventure");
    };
    return (
        <div className="flex-grow flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl animate-fade-in">
            <Award size={64} className="text-yellow-500 mb-4" />
            <h1 className="text-4xl font-bold mb-2">Congratulations, {playerData.playerName}!</h1>
            <p className="text-xl mb-6">You've completed the Kokomo Art & Heritage Hunt!</p>
            <div className="flex gap-8 mb-6"><div className="text-center"><p className="text-lg font-semibold">Final Score</p><p className="text-3xl font-bold text-yellow-500">{playerData.score}</p></div><div className="text-center"><p className="text-lg font-semibold">Total Time</p><p className="text-3xl font-bold font-mono">{formatTime(playerData.timer)}</p></div></div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg w-full max-w-2xl mb-4"><h3 className="font-semibold text-lg mb-1">Main Phrase Unlocked:</h3><p className="font-mono tracking-widest text-teal-500">{finalPhrase}</p></div>
            {playerData.sideQuestWords.length > 0 && <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg w-full max-w-2xl mb-6"><h3 className="font-semibold text-lg mb-1">Side Quest Phrase:</h3><p className="font-mono tracking-widest text-orange-500">{playerData.sideQuestWords.join(' ')}</p></div>}
            <div className="border-t dark:border-gray-700 w-full max-w-2xl my-6 pt-6">
                <h3 className="text-2xl font-bold mb-4">Creative Corner ✨</h3>
                <div className="flex flex-wrap justify-center gap-4">
                    <button onClick={handleStoryClick} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"><Sparkles size={18}/> Tell Me a Story</button>
                    <button onClick={handlePostClick} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"><PenSquare size={18}/> Draft Social Post</button>
                    <button onClick={handleHuntStoryClick} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"><Sparkles size={18}/> My Hunt Story</button>
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
                <button onClick={() => setShowModal('leaderboard')} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"><Trophy/> Leaderboard</button>
                <button onClick={() => setShowModal('route')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"><Route/> Your Route</button>
                <button onClick={() => setShowModal('album')} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"><ImageIcon/> Postcard Album</button>
            </div>
        </div>
    );
};
