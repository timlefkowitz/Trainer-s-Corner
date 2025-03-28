use actix_web::{web, Responder, HttpResponse};
use std::collections::HashMap;

pub async fn steam_login() -> impl Responder {
    HttpResponse::Ok().body("Steam login not implemented yet")
}

pub async fn steam_callback() -> impl Responder {
    HttpResponse::Ok().body("Steam callback not implemented yet")
}

pub async fn google_callback(_query: web::Query<HashMap<String, String>>) -> impl Responder {
    HttpResponse::Ok().body("Google callback not implemented yet")
}