import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Camera, Star, Clock, Award, CheckCircle, Gift, QrCode, BookOpen, Coffee, Music, Palette, Beer, ShoppingBag, X, Trophy, Image as ImageIcon, Route, Sparkles, PenSquare, Dices } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc, updateDoc, collection, query, orderBy, limit } from 'firebase/firestore';

// --- File: src/firebase/config.js ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- File: src/data/locations.js ---
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
    { id: 13, name: "MO Joe Coffee House", challenge: "Sketch art while sipping an 'Artist’s Blend'.", points: 75, prizeWord: "FUEL", icon: Coffee },
    { id: 14, name: "Outhouse Records", challenge: "Find a record by an Indiana artist.", points: 75, prizeWord: "MUSIC", icon: Music },
    { id: 15, name: "Chapter 2 Books", challenge: "Read page 1 of an art/Indiana-history title aloud.", points: 75, prizeWord: "READ", icon: BookOpen },
];

// --- File: src/api/gemini.js ---
const callGemini = async (prompt) => {
    const apiKey = ""; // Handled by environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };
    try {
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        return result.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Sorry, an error occurred. Please try again.";
    }
};

// --- Helper Function ---
const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

// --- File: src/components/WelcomeScreen.js ---
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

// --- File: src/components/Header.js ---
const Header = ({ score, time, collectedWords }) => {
    const finalPhrase = useMemo(() => locationsData.map(l => l.prizeWord).join(' '), []);
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

// --- File: src/components/GameScreen.js ---
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

// --- File: src/components/FinishedScreen.js ---
const FinishedScreen = ({ playerData, setShowModal, callGemini }) => {
    const finalPhrase = useMemo(() => locationsData.map(l => l.prizeWord).join(' '), []);
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

// --- File: src/components/Modal.js ---
const Modal = ({ showModal, setShowModal, location, postcards, leaderboard, geminiResponse }) => {
    if (!showModal) return null;
    const modalContent = {
        ar: { title: "AR Experience", body: <p>{location?.ar}</p>, image: "https://placehold.co/600x400/FF8C00/FFFFFF?text=Simulated+AR+View" },
        photo: { title: "Photo Challenge", body: <p>Point your camera and capture the perfect shot!</p>, image: "https://placehold.co/600x400/4169E1/FFFFFF?text=Live+Camera+View" },
        composite: { title: "Window to the Past", body: <p>Your selfie is blended with a historic view of the Hotel Frances!</p>, image: "https://placehold.co/600x400/800080/FFFFFF?text=Composite+Photo+Result" },
        qr: { title: "Final Scan", body: <p>Scan the QR code at Artworks Gallery to complete your journey!</p>, image: "https://placehold.co/400x400/228B22/FFFFFF?text=Scan+This+QR" },
        route: { title: "Your Art & Heritage Trail", body: <p>Here's the path you took through Kokomo's historic downtown!</p>, image: "https://placehold.co/600x400/00008B/FFFFFF?text=Map+of+Your+Route" },
        album: { title: "Postcard Album", body: <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{postcards.map((p,i) => <div key={i}><img src={p.image} alt={p.name} className="rounded-md shadow-md" /><p className="text-sm mt-1">{p.name}</p></div>)}</div> },
        leaderboard: { title: "Leaderboard", body: <div className="space-y-2 text-left">{leaderboard.map((p, i) => <div key={p.id} className={`p-2 rounded-md flex justify-between items-center ${i === 0 ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-gray-100 dark:bg-gray-700'}`}><div className="flex items-center gap-3"><span className="font-bold w-6">{i+1}.</span><span>{p.playerName}</span></div><div className="flex items-center gap-4"><span className="font-bold text-yellow-500">{p.score} pts</span><span className="font-mono text-sm">{formatTime(p.time)}</span></div></div>)}</div> },
        gemini: { title: geminiResponse.title, body: geminiResponse.isLoading ? <div className="flex justify-center items-center h-48"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div></div> : <p className="whitespace-pre-wrap">{geminiResponse.content}</p> }
    };
    const currentContent = modalContent[showModal];
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowModal(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-2 sm:p-6 w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold">{currentContent.title}</h2>
                    <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-gray-800 dark:hover:text-white"><X size={28}/></button>
                </div>
                <div className="p-4 overflow-y-auto">
                    {currentContent.image && <img src={currentContent.image} alt={currentContent.title} className="w-full h-auto rounded-lg mb-4" />}
                    <div className="text-gray-600 dark:text-gray-300">{currentContent.body}</div>
                </div>
            </div>
        </div>
    );
};

// --- File: src/App.js ---
export default function App() {
    const [user, setUser] = useState(null);
    const [playerData, setPlayerData] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(null);
    const [geminiResponse, setGeminiResponse] = useState({ title: '', content: '', isLoading: false });

    // Authentication
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                try {
                    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                        await signInWithCustomToken(auth, __initial_auth_token);
                    } else {
                        await signInAnonymously(auth);
                    }
                } catch (error) {
                    console.error("Authentication Error:", error);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    // Player Data and Leaderboard Listener
    useEffect(() => {
        if (!user) return;
        const playerDocRef = doc(db, `artifacts/${appId}/users/${user.uid}/gamedata`, 'player');
        const unsubscribePlayer = onSnapshot(playerDocRef, (doc) => {
            setPlayerData(doc.exists() ? doc.data() : null);
            setLoading(false);
        });
        const leaderboardColRef = collection(db, `artifacts/${appId}/public/data/leaderboard`);
        const q = query(leaderboardColRef, orderBy("score", "desc"), orderBy("time", "asc"), limit(10));
        const unsubscribeLeaderboard = onSnapshot(q, (snapshot) => {
            setLeaderboard(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => {
            unsubscribePlayer();
            unsubscribeLeaderboard();
        };
    }, [user]);

    // Timer logic
    useEffect(() => {
        let interval;
        if (playerData && playerData.gameState === 'playing') {
            interval = setInterval(async () => {
                const playerDocRef = doc(db, `artifacts/${appId}/users/${user.uid}/gamedata`, 'player');
                await updateDoc(playerDocRef, { timer: (playerData.timer || 0) + 1 });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [playerData, user]);

    const startGame = async (name) => {
        if (!name.trim() || !user) return;
        setLoading(true);
        const initialData = { playerName: name.trim(), gameState: 'playing', currentLocationIndex: 0, score: 0, timer: 0, collectedWords: [], sideQuestWords: [], completedQuests: [], postcards: [] };
        const playerDocRef = doc(db, `artifacts/${appId}/users/${user.uid}/gamedata`, 'player');
        await setDoc(playerDocRef, initialData);
        setPlayerData(initialData);
        setLoading(false);
    };

    const updatePlayerInFirestore = async (updates) => {
        if (!user) return;
        const playerDocRef = doc(db, `artifacts/${appId}/users/${user.uid}/gamedata`, 'player');
        await updateDoc(playerDocRef, updates);
    };

    const handleChallengeComplete = async (location) => {
        const newScore = playerData.score + location.points;
        const newWords = [...playerData.collectedWords, location.prizeWord];
        const newPostcards = [...playerData.postcards, {name: location.name, image: location.postcard}];
        let updates = { score: newScore, collectedWords: newWords, postcards: newPostcards };
        if (location.type === 'final') {
            updates.gameState = 'finished';
            const leaderboardDocRef = doc(db, `artifacts/${appId}/public/data/leaderboard`, user.uid);
            await setDoc(leaderboardDocRef, { playerName: playerData.playerName, score: newScore, time: playerData.timer });
        } else {
            updates.currentLocationIndex = playerData.currentLocationIndex + 1;
        }
        await updatePlayerInFirestore(updates);
    };

    const handleSideQuestComplete = async (quest) => {
        if (playerData.completedQuests.includes(quest.id)) return;
        let newScore = playerData.score + quest.points;
        const newSideQuestWords = [...playerData.sideQuestWords, quest.prizeWord];
        const newCompletedQuests = [...playerData.completedQuests, quest.id];
        const newPostcards = [...playerData.postcards, {name: quest.name, image: `https://placehold.co/600x400/333333/FFFFFF?text=${quest.name.replace(' ', '+')}`}];
        if (newSideQuestWords.length === sideQuestsData.length) newScore += 200;
        await updatePlayerInFirestore({ score: newScore, sideQuestWords: newSideQuestWords, completedQuests: newCompletedQuests, postcards: newPostcards });
    };

    const handleGeminiCall = async (prompt, title) => { // This function will be kept for now but its calls removed from components
        setGeminiResponse({ title, content: '', isLoading: true });
        // Placeholder for Gemini API call, will be restored later
        const responseText = "Simulated Gemini Response: This feature is currently being re-enabled.";
        setGeminiResponse({ title, content: responseText, isLoading: false });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;

    const renderContent = () => {
        const gameState = playerData ? playerData.gameState : 'welcome';
        switch (gameState) {
        }