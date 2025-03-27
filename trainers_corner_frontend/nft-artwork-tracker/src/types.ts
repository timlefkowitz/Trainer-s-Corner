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
}