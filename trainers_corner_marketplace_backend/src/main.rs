use actix_web::{get, web, App, HttpServer, HttpResponse, Responder};
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager};
use serde::Deserialize;

// Assuming these are in separate files
mod models;
mod schema;

type DbPool = r2d2::Pool<ConnectionManager<PgConnection>>;

#[derive(Deserialize)]
struct QueryParams {
    set: Option<String>,
    search: Option<String>,
}

#[get("/api/cards")]
async fn get_cards(pool: web::Data<DbPool>, query: web::Query<QueryParams>) -> impl Responder {
    use crate::schema::cards::dsl::*;

    let mut conn = pool.get().expect("Couldn't get DB connection");
    let mut card_query = cards.into_boxed();

    if let Some(set_name) = &query.set {
        card_query = card_query.filter(set.ilike(set_name));
    }
    if let Some(search_term) = &query.search {
        card_query = card_query.filter(name.ilike(format!("%{}%", search_term)));
    }

    match card_query.load::<models::Card>(&mut conn) {
        Ok(cards_list) => {
            println!("Fetched {} cards", cards_list.len());
            HttpResponse::Ok().json(cards_list)
        }
        Err(e) => {
            eprintln!("Error fetching cards: {:?}", e);
            HttpResponse::InternalServerError().body("Error fetching cards")
        }
    }
}

#[get("/api/sets")]
async fn get_sets(pool: web::Data<DbPool>, query: web::Query<QueryParams>) -> impl Responder {
    use crate::schema::cards::dsl::*;

    let mut conn = pool.get().expect("Couldn't get DB connection");
    let sets = if let Some(search_term) = &query.search {
        cards
            .select(set)
            .distinct()
            .filter(set.is_not_null())
            .filter(set.ilike(format!("%{}%", search_term)))
            .load::<Option<String>>(&mut conn)
    } else {
        cards
            .select(set)
            .distinct()
            .filter(set.is_not_null())
            .load::<Option<String>>(&mut conn)
    };

    match sets {
        Ok(set_list) => HttpResponse::Ok().json(
            set_list
                .into_iter()
                .map(|s| models::Set { name: s.unwrap() })
                .collect::<Vec<_>>(),
        ),
        Err(e) => {
            eprintln!("Error fetching sets: {:?}", e);
            HttpResponse::InternalServerError().body("Error fetching sets")
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok(); // Load .env file
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    let pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool");

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