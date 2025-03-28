use diesel::prelude::*;

table! {
    cards (id) {
        id -> Int4,
        name -> Varchar,
        rarity -> Nullable<Varchar>,
        price -> Nullable<Int8>,
        set -> Nullable<Varchar>,
    }
}

table! {
    portfolio (id) {
        id -> Int4,
        user_id -> Varchar,
        card_id -> Int4,
        quantity -> Int4,
    }
}

table! {
    friendships (id) {
        id -> Int4,
        user_id -> Varchar,
        friend_id -> Varchar,
    }
}

table! {
    users (id) {
        id -> Varchar,
        name -> Varchar,
        email -> Nullable<Varchar>,
        profile_picture -> Nullable<Varchar>,
        metadata -> Nullable<Jsonb>,
    }
}

// Allow tables to be joined in queries
allow_tables_to_appear_in_same_query!(users, friendships);
allow_tables_to_appear_in_same_query!(portfolio, cards);