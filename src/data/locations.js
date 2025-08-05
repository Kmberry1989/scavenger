import { MapPin, Camera, Star, Clock, Award, CheckCircle, Gift, QrCode, BookOpen, Coffee, Music, Palette, Beer, ShoppingBag, X, Trophy, Image as ImageIcon, Route, Sparkles, PenSquare, Dices } from 'lucide-react';

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
    { id: 13, name: "MO Joe Coffee House", challenge: "Sketch art while sipping an ‘Artist’s Blend’.", points: 75, prizeWord: "FUEL", icon: Coffee },
    { id: 14, name: "Outhouse Records", challenge: "Find a record by an Indiana artist.", points: 75, prizeWord: "MUSIC", icon: Music },
    { id: 15, name: "Chapter 2 Books", challenge: "Read page 1 of an art/Indiana-history title aloud.", points: 75, prizeWord: "READ", icon: BookOpen },
];
