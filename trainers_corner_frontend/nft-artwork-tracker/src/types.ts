export interface Card {
    id: number;
    name: string;
    rarity: string;
    price: number;
    set: string | null;
}

export interface Set {
    name: string;
}

export interface User {
    id: string;
    name: string;
    email?: string;
    profilePicture?: string; // URL or base64 string for the image
    metadata?: Record<string, any>; // JSON-like object for extra data
}