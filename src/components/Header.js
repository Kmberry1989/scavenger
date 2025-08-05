import React, { useMemo } from 'react';
import { Star, Clock } from 'lucide-react';

const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const Header = ({ score, time, collectedWords }) => {
    const finalPhrase = useMemo(() => ["ART", "BRINGS", "COMMUNITY", "TOGETHER", "THROUGH", "CREATIVITY", "SHARED", "DISCOVERY", "IN KOKOMO"].join(' '), []);
    const revealedPhrase = finalPhrase.split(' ').map((word, index) => index < collectedWords.length ? word : '_'.repeat(word.length)).join(' ');
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-30">
            <div className="container mx-auto p-3 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-yellow-500"><Star size={24} /><span className="font-bold text-xl">{score}</span></div>
                    <div className="flex items-center gap-2"><Clock size={24} /><span className="font-mono text-xl">{formatTime(time)}</span></div>
                </div>
                <div className="w-full md:w-auto text-center font-mono text-sm md:text-base tracking-widest bg-gray-100 dark:bg-gray-700 p-2 rounded">{revealedPhrase}</div>
            </div>
        </header>
    );
};
