// @generated automatically by Diesel CLI.

diesel::table! {
    cards (id) {
        id -> Int4,
        name -> Text,
        rarity -> Text,
        price -> Float8,
        set -> Nullable<Text>,
        year -> Nullable<Int2>,
        condition -> Nullable<Text>,
        image_url -> Nullable<Text>,
        card_type -> Nullable<Text>,
        language -> Nullable<Text>,
        last_sale_price -> Text,
        last_sale_date -> Text,
    }
}

diesel::table! {
    friendships (id) {
        id -> Int4,
        user_id -> Nullable<Varchar>,
        friend_id -> Nullable<Varchar>,
    }
}

diesel::table! {
    portfolio (id) {
        id -> Int4,
        user_id -> Nullable<Varchar>,
        card_id -> Nullable<Int4>,
        quantity -> Nullable<Int4>,
    }
}

diesel::table! {
    users (id) {
        id -> Varchar,
        name -> Varchar,
        email -> Nullable<Varchar>,
        profile_picture -> Nullable<Varchar>,
        metadata -> Nullable<Jsonb>,
    }
}

diesel::joinable!(portfolio -> cards (card_id));
diesel::joinable!(portfolio -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    cards,
    friendships,
    portfolio,
    users,
);
