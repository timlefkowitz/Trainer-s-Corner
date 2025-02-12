-- This file should undo anything in `up.sql`
ALTER TABLE cards
DROP COLUMN set,
    DROP COLUMN year,
    DROP COLUMN condition,
    DROP COLUMN image_url,
    DROP COLUMN card_type,
    DROP COLUMN language;
