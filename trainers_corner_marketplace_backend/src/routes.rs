use actix_web::{get, web, Responder, HttpResponse};
use diesel::prelude::*;
use serde::Deserialize;
use crate::schema; // Access schema from main.rs
use crate::models; // Access models from main.rs
use crate::DbPool; // Use the type alias from main.rs

#[derive(Deserialize)] // Ensure this is present
pub struct QueryParams {
    pub set: Option<String>,
    pub search: Option<String>,
}

#[get("/api/cards")]
pub async fn get_cards(pool: web::Data<DbPool>, query: web::Query<QueryParams>) -> impl Responder {
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
async fn get_sets(pool: web::Data<DbPool>, query: web::Query<crate::QueryParams>) -> impl Responder {
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