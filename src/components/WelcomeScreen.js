import React, { useState } from 'react';

const WelcomeScreen = ({ onStart }) => {
    const [name, setName] = useState('');
    return (
        <div className="flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl flex-grow animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-teal-500 mb-2">Kokomo</h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">City of Firsts Art & Heritage Hunt</h2>
            <p className="max-w-prose mb-6 text-gray-600 dark:text-gray-300">Embark on a journey through Kokomo's rich history. Discover art, solve challenges, and see the city like never before.</p>
            <div className="w-full max-w-sm">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name to begin" className="w-full px-4 py-3 mb-4 text-lg text-center bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                <button onClick={() => onStart(name)} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-transform transform hover:scale-105 shadow-lg">Start the Hunt!</button>
            </div>
        </div>
    );
};
