extern crate diesel;
extern crate dotenv;

use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager};
use dotenv::dotenv;
use std::env;
use actix_web::web::Query;
use serde::Deserialize;

pub mod schema;
pub mod models;

type DbPool = r2d2::Pool<ConnectionManager<PgConnection>>;

fn establish_connection() -> Result<DbPool, String> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").map_err(|_| "DATABASE_URL must be set".to_string())?;
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    r2d2::Pool::builder()
        .build(manager)
        .map_err(|_| "Failed to create database pool".to_string())
}

#[derive(Deserialize)]
struct CardQuery {
    set: Option<String>,
}

#[actix_web::get("/api/cards")]
async fn get_cards(pool: web::Data<DbPool>, query: Query<CardQuery>) -> impl Responder {
    use crate::schema::cards::dsl::*;

    let mut conn = pool.get().expect("Couldn't get DB connection");
    let mut card_query = cards.into_boxed();

    if let Some(set_name) = &query.set {
        card_query = card_query.filter(diesel::dsl::lower(set).eq(set_name.to_lowercase()));
    }

    match card_query.load::<models::Card>(&mut conn) {
        Ok(cards_list) => {
            println!("Fetched {} cards for set {:?}", cards_list.len(), query.set);
            HttpResponse::Ok().json(cards_list)
        }
        Err(e) => {
            eprintln!("Error fetching cards: {:?}", e);
            HttpResponse::InternalServerError().body(format!("Error fetching cards: {}", e))
        }
    }
}

#[actix_web::get("/api/sets")]
async fn get_sets(pool: web::Data<DbPool>) -> impl Responder {
    use crate::schema::cards::dsl::{cards, set};

    let mut conn = pool.get().expect("Couldn't get DB connection");

    match cards
        .select(set)
        .distinct()
        .filter(set.is_not_null())
        .order(set.asc())
        .load::<Option<String>>(&mut conn)
    {
        Ok(set_options) => {
            let sets: Vec<models::Set> = set_options
                .into_iter()
                .filter_map(|opt| opt.map(|s| models::Set { name: s }))
                .collect();
            HttpResponse::Ok().json(sets)
        }
        Err(e) => {
            eprintln!("Error fetching sets: {:?}", e);
            HttpResponse::InternalServerError().body("Error fetching sets")
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let pool = establish_connection().expect("Failed to establish DB connection");

    println!("Starting server at http://127.0.0.1:8080");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .service(get_cards)
            .service(get_sets)
    })
        .bind("127.0.0.1:8080")?
        .run()
        .await
}