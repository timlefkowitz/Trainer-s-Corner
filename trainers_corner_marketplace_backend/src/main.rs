use actix_web::{get, web, App, HttpServer, HttpResponse, Responder};
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager};
use serde::Deserialize;
use std::collections::HashMap;
use url::Url;

mod models;
mod schema;
mod routes;
mod Auth;

type DbPool = r2d2::Pool<ConnectionManager<PgConnection>>;

#[derive(Deserialize)]
struct QueryParams {
    set: Option<String>,
    search: Option<String>,
}



#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    let pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool");

    println!("Starting server at http://127.0.0.1:8080");
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .service(routes::get_cards)
            .service(routes::get_sets)
            .service(Auth::steam_login)
            .service(Auth::steam_callback)
    })
        .bind("127.0.0.1:8080")?
        .run()
        .await
}