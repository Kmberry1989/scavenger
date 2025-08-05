import React from 'react';
import { X } from 'lucide-react';

const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

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