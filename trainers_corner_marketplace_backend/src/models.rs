use diesel::Queryable;
use serde::{Serialize, Deserialize};

#[derive(Queryable, Serialize, Deserialize)]
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
}

#[derive(Serialize, Deserialize)]
pub struct Set {
    pub name: String,
}