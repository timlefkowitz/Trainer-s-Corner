// @generated automatically by Diesel CLI.
// todo : add artist; description;
diesel::table! {
    cards (id) {
        id -> Integer,
        name -> Text,
        rarity -> Text,
        price -> Double,
        set -> Nullable<Text>,
        year -> Nullable<SmallInt>,
        condition -> Nullable<Text>,
        image_url -> Nullable<Text>,
        card_type -> Nullable<Text>,
        language -> Nullable<Text>,
    }
}

