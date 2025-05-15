use serde::{Serialize, Deserialize};
use diesel::prelude::*;

#[derive(Queryable, Selectable, Serialize, Deserialize, AsChangeset)]
#[diesel(table_name = crate::schema::users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct User {
    pub id: String,
    pub name: String,
    pub email: Option<String>,
    pub profile_picture: Option<String>,
    pub metadata: Option<serde_json::Value>,
}

#[derive(Queryable, Serialize)]
#[diesel(table_name = crate::schema::friendships)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Friendship {
    pub id: i32,
    pub user_id: Option<String>,
    pub friend_id: Option<String>,
}

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = crate::schema::cards)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Card {
    pub id: i32,
    pub name: String,
    pub rarity: String,
    pub price: f64,
    pub set: Option<String>,
    pub year: Option<i16>,
    pub condition: Option<String>,
    pub image_url: Option<String>,
    pub card_type: Option<String>,
    pub language: Option<String>,
    pub last_sale_price: String,
    pub last_sale_date: String,
    pub hp: Option<String>,
    pub stage: Option<String>,
    pub attack1: Option<String>,
    pub attack2: Option<String>,
    pub weakness: Option<String>,
    pub resistance: Option<String>,
    pub retreat_cost: Option<String>,
    pub card_number: Option<String>,
}

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = crate::schema::portfolio)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Portfolio {
    pub id: i32,
    pub user_id: String,
    pub card_id: i32,
    pub quantity: i32,
}
