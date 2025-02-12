#[macro_use] extern crate rocket;

use rocket::serde::json::Json;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
// u32 is an unsigned 32-bit integer
// f64 64-bit floating point number
struct Card {
    id: u32,
    name: String,
    rarity: String,
    price: f64,
    set: String,
    year: u16,
    condition: String,
    image_url: String,
    card_type: String,
    language: String,

}

#[get("/cards")]
fn get_cards() -> Json<Vec<Card>> {
    let sample_cards = vec! [
        Card {
            id: 1, name: "Blue-Eyes White Dragon".to_string(),
            rarity: "Ultra Rare".to_string(),
            price: 50.0,
            set: "".to_string(),
            year: 0,
            condition: "".to_string(),
            image_url: "".to_string(),
            card_type: "".to_string(),
            language: "".to_string(),
        },
        Card {
            id: 2,
            name: "Charizard".to_string(),
            rarity: "Holo Rare".to_string(),
            price: 120.0,
            set: "".to_string(),
            year: 0,
            condition: "".to_string(),
            image_url: "".to_string(),
            card_type: "".to_string(),
            language: "".to_string(),
        },
        ];
        Json(sample_cards)
    }
#[launch]
fn rocket() -> _ {rocket::build().mount("/api", routes![get_cards])}