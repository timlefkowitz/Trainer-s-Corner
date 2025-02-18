extern crate diesel;
extern crate dotenv;

use actix_web::{web, App, HttpResponse, HttpServer, Responder}; // Web server
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager}; // Connection pooling
use dotenv::dotenv;
use std::env;

pub mod schema;
pub mod models;

// Type alias for database pool
type DbPool = r2d2::Pool<ConnectionManager<PgConnection>>;

// Connect to the database
fn establish_connection() -> Result<DbPool, String> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").map_err(|_| "DATABASE_URL must be set".to_string())?;
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    r2d2::Pool::builder().build(manager).map_err(|_| "Failed to create database pool".to_string())
}


// Define an API route to get all cards
#[actix_web::get("/cards")]
async fn get_cards(pool: web::Data<DbPool>) -> impl Responder {
    use crate::schema::cards::dsl::*;
    let mut conn = pool.get().expect("Couldn't get DB connection");

    match cards.load::<models::Card>(&mut conn) {
        Ok(cards) => HttpResponse::Ok().json(cards),
        Err(_) => HttpResponse::InternalServerError().body("Error fetching cards"),
    }
}


// Start the web server

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let pool = establish_connection().expect("Failed to establish DB connection");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .route("/cards", web::get().to(get_cards))
    })
        .bind("127.0.0.1:8080")?
        .run()
        .await
}

