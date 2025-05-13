ALTER TABLE cards
    ADD COLUMN last_sale_price TEXT NOT NULL DEFAULT '0.00',
    ADD COLUMN last_sale_date TEXT NOT NULL DEFAULT '1970-01-01';-- Your SQL goes here
