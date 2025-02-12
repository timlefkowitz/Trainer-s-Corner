#[macro_use] extern crate rocket;
#[macro_use] extern crate diesel;


use diesel::*;
use dotenvy::dotenv;
use rocket::serde::json::Json;
use serde::{Serialize, Deserialize};
use std::env;

mod schema;


// u32 is an unsigned 32-bit integer
// f64 64-bit floating point number
#[derive(Queryable)]
pub struct Card {
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

fn establish_connection() -> PgConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url).expect(&format!("Error connecting to {}", database_url))
}

#[get("/cards")]
fn get_cards() -> Json<Vec<Card>> {
    use schema::cards::dsl::*;
    let connection = establish_connection();
    let results = cards.load::<Card>(&connection).expect("Error loading cards");
    Json(results)
}
#[launch]
fn rocket() -> _ {rocket::build().mount("/api", routes![get_cards])}