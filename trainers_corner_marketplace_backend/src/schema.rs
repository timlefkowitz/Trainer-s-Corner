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
    }
}

