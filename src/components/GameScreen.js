import React, { useState } from 'react';
import { MapPin, Camera, QrCode, Beer, Palette, ShoppingBag, Coffee, Music, BookOpen, CheckCircle, Dices, Trophy } from 'lucide-react';
import { useMemo } from 'react';

const locationsData = [
    { id: 0, name: "Hotel Frances Site", coords: { lat: 40.4922, lng: -86.1315 }, challenge: "Take a photo in the 'Window to the Past' frame!", type: "photo_composite", points: 150, prizeWord: "ART", ar: "See a 3D recreation of the 1920s hotel lobby.", postcard: "https://placehold.co/600x400/8B4513/FFFFFF?text=Hotel+Frances+1925" },
    { id: 1, name: "Seiberling Mansion", coords: { lat: 40.4828, lng: -86.1411 }, challenge: "Photograph a stained-glass window made from local opalescent glass.", type: "photo", points: 125, prizeWord: "BRINGS", ar: "Meet a 3D 'ghost' of Monroe Seiberling who tells you about the gas boom.", postcard: "https://placehold.co/600x400/556B2F/FFFFFF?text=Seiberling+Mansion" },
    { id: 2, name: "Kokomo Opalescent Glass", coords: { lat: 40.4684, lng: -86.1312 }, challenge: "Count the primary colors in the main window display.", type: "count", answer: 12, points: 100, prizeWord: "COMMUNITY", ar: "Watch virtual molten glass swirl and form in your hand.", postcard: "https://placehold.co/600x400/4682B4/FFFFFF?text=Opalescent+Glass" },
    { id: 3, name: "Elwood Haynes Museum", coords: { lat: 40.4648, lng: -86.1332 }, challenge: "What year did Haynes test-drive 'The Pioneer'?", type: "trivia", answer: "1894", points: 100, prizeWord: "TOGETHER", ar: "See a life-sized AR model of 'The Pioneer' drive across the lawn.", postcard: "https://placehold.co/600x400/696969/FFFFFF?text=Elwood+Haynes+Museum" },
    { id: 4, name: "Howard County Courthouse", coords: { lat: 40.4884, lng: -86.1319 }, challenge: "Take a creative photo of the Art Deco bronze doors.", type: "photo", points: 100, prizeWord: "THROUGH", ar: "Watch a time-lapse of the courthouse's construction overlay the real building.", postcard: "https://placehold.co/600x400/CD853F/FFFFFF?text=Courthouse" },
    { id: 5, name: "Artist Alley", coords: { lat: 40.4889, lng: -86.1317 }, challenge: "How many rotating murals are currently on display?", type: "count", answer: 8, points: 125, prizeWord: "CREATIVITY", ar: "Use your phone to 'spray paint' a temporary virtual mural on the wall.", postcard: "https://placehold.co/600x400/8A2BE2/FFFFFF?text=Artist+Alley" },
    { id: 6, name: "KokoMantis Sculpture", coords: { lat: 40.4876, lng: -86.1305 }, challenge: "Take a selfie with the 'Mantis'.", type: "photo", points: 100, prizeWord: "SHARED", ar: "AR butterflies flutter around the sculpture and land on your shoulder.", postcard: "https://placehold.co/600x400/32CD32/FFFFFF?text=KokoMantis" },
    { id: 7, name: "Industrial Heritage Trail", coords: { lat: 40.4895, lng: -86.1330 }, challenge: "Find and photograph the Basset Hound in the trail murals.", type: "photo", points: 100, prizeWord: "DISCOVERY", ar: "The painted figures in the murals animate and wave at you.", postcard: "https://placehold.co/600x400/B22222/FFFFFF?text=Heritage+Trail" },
    { id: 8, name: "Artworks Gallery", coords: { lat: 40.4889, lng: -86.1317 }, challenge: "Scan the QR code at the entrance to finish the hunt!", type: "final", points: 150, prizeWord: "IN KOKOMO", ar: "Meet AR avatars of local artists who tell you about their work.", postcard: "https://placehold.co/600x400/008080/FFFFFF?text=Artworks+Gallery" },
];
const sideQuestsData = [
    { id: 10, name: "The Coterie", challenge: "Snap a photo with their neon Indiana sign.", points: 75, prizeWord: "CHEERS", icon: Beer },
    { id: 11, name: "Fired Arts Studio", challenge: "Paint a mini ceramic piece.", points: 75, prizeWord: "CREATE", icon: Palette },
    { id: 12, name: "Kokomo Toys & Collectibles", challenge: "Pose with a vintage toy from your birth decade.", points: 75, prizeWord: "PLAY", icon: ShoppingBag },
    { id: 13, name: "MO Joe Coffee House", challenge: "Sketch art while sipping an ‘Artist’s Blend’.", points: 75, prizeWord: "FUEL", icon: Coffee },
    { id: 14, name: "Outhouse Records", challenge: "Find a record by an Indiana artist.", points: 75, prizeWord: "MUSIC", icon: Music },
    { id: 15, name: "Chapter 2 Books", challenge: "Read page 1 of an art/Indiana-history title aloud.", points: 75, prizeWord: "READ", icon: BookOpen },
];

const GameScreen = ({ playerData, location, onComplete, onSideQuestComplete, setShowModal, callGemini }) => {
    const [answer, setAnswer] = useState('');
    const [notification, setNotification] = useState('');
    const showNotification = (msg) => { setNotification(msg); setTimeout(() => setNotification(''), 3000); };
    const handleSubmit = () => {
        if (location.type === 'trivia' && answer.toLowerCase() !== location.answer.toLowerCase()) { showNotification('Not quite! Try again.'); return; }
        if (location.type === 'count' && parseInt(answer) !== location.answer) { showNotification('Not quite! Try again.'); return; }
        onComplete(location);
        setAnswer('');
    };
    const handleSurpriseQuest = () => {
        const prompt = `You are a creative guide for a scavenger hunt in Kokomo, Indiana. The user is currently at "${location.name}". Generate a fun, simple, and creative side quest (1-2 sentences) they can do right here. The quest should be related to art, history, or local culture.`;
        callGemini(prompt, "✨ A Surprise Quest!");
    };
    const renderChallengeInput = () => {
        switch (location.type) {
            case 'trivia': case 'count': return <input type={location.type === 'count' ? 'number' : 'text'} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Your answer here" className="w-full max-w-xs px-4 py-2 text-center bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"/>;
            case 'photo': return <button onClick={() => setShowModal('photo')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"><Camera /> Take Photo</button>;
            case 'photo_composite': return <button onClick={() => setShowModal('composite')} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"><Camera /> Create Composite Photo</button>;
            case 'final': return <button onClick={() => setShowModal('qr')} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"><QrCode /> Scan QR Code</button>;
            default: return null;
        }
    };
    return (
        <div className="flex-grow flex flex-col lg:flex-row gap-4 relative">
            {notification && <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-40 animate-bounce">{notification}</div>}
            <div className="lg:w-2/3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col items-center text-center animate-slide-in">
                <div className="flex items-center text-teal-500 mb-2"><MapPin size={28} className="mr-2" /><h2 className="text-3xl font-bold">{location.name}</h2></div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">You've arrived! Your distance is <span className="font-bold text-green-500">15 feet</span>.</p>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg w-full mb-4"><h3 className="font-semibold text-xl mb-2">Challenge:</h3><p className="text-lg">{location.challenge}</p></div>
                <div className="flex flex-col items-center gap-4 mb-4">{renderChallengeInput()}<button onClick={() => setShowModal('ar')} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg">Launch AR Experience</button></div>
                <button onClick={handleSubmit} className="mt-auto bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105 w-full max-w-md">Simulate Presence & Complete</button>
            </div>
            <div className="lg:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl animate-slide-in-right">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-center">Side Quests</h3>
                    <button onClick={handleSurpriseQuest} className="bg-pink-500 hover:bg-pink-600 text-white font-bold p-2 rounded-full flex items-center justify-center gap-2" title="Get a surprise quest!"><Dices size={20}/></button>
                </div>
                <div className="space-y-3">
                    {sideQuestsData.map(quest => (<button key={quest.id} onClick={() => onSideQuestComplete(quest)} disabled={playerData.completedQuests.includes(quest.id)} className={`w-full p-3 rounded-lg flex items-center gap-3 transition ${playerData.completedQuests.includes(quest.id) ? 'bg-green-200 dark:bg-green-800 cursor-not-allowed' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}><quest.icon className={`w-6 h-6 ${playerData.completedQuests.includes(quest.id) ? 'text-green-700 dark:text-green-300' : 'text-teal-500'}`} /><span className="font-semibold">{quest.name}</span>{playerData.completedQuests.includes(quest.id) && <CheckCircle className="ml-auto text-green-600 dark:text-green-400" />}</button>))}
                </div>
                 <button onClick={() => setShowModal('leaderboard')} className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"><Trophy/> View Leaderboard</button>
            </div>
        </div>
    );
};
