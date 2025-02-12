extern crate diesel;
extern crate dotenv;

use actix_web::{get, web, App, HttpResponse, HttpServer, Responder}; // Web server
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager}; // Connection pooling
use dotenv::dotenv;
use std::env;

pub mod schema;
pub mod models;

// Type alias for database pool
type DbPool = r2d2::Pool<ConnectionManager<PgConnection>>;

// Connect to the database
fn establish_connection() -> DbPool {
    dotenv().ok(); // Load environment variables from .env

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set in .env");
    let manager = ConnectionManager::<PgConnection>::new(database_url);

    r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create database pool")
}

// Define an API route to get all cards
#[get("/cards")]
async fn get_cards(pool: web::Data<DbPool>) -> impl Responder {
    use crate::schema::cards::dsl::*; // Import schema
    let mut conn = pool.get().expect("Couldn't get DB connection");

    let results = cards
        .load::<models::Card>(&mut conn)
        .expect("Error loading cards");

    HttpResponse::Ok().json(results)
}

// Start the web server
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let pool = establish_connection();

    println!("Starting server on http://127.0.0.1:8080...");
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone())) // Pass DB pool to routes
            .service(get_cards)
    })
        .bind("127.0.0.1:8080")?
        .run()
        .await
}
