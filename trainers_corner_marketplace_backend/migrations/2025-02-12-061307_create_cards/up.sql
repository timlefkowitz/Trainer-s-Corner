-- Your SQL goes here
CREATE TABLE cards (
                       id SERIAL PRIMARY KEY,
                       name TEXT NOT NULL,
                       rarity TEXT NOT NULL,
                       price DOUBLE PRECISION NOT NULL
);
