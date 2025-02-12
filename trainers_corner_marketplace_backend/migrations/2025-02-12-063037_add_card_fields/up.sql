-- Your SQL goes here
ALTER TABLE cards
    ADD COLUMN set TEXT,
    ADD COLUMN year SMALLINT,
    ADD COLUMN condition TEXT,
    ADD COLUMN image_url TEXT,
    ADD COLUMN card_type TEXT,
    ADD COLUMN language TEXT;
