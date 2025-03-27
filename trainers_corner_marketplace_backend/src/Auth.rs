use actix_web::{get, web, Responder, HttpResponse};
use std::collections::HashMap;
use url::Url;



#[get("/auth/google")]
pub async fn google_login() -> impl Responder {
    // TODO: Implement Google OAuth redirect
    HttpResponse::Ok().body("Google login placeholder")
}

// Add callback similarly
#[get("/auth/google/callback")]
pub async fn google_callback(query: web::Query<HashMap<String, String>>) -> impl Responder {
    // TODO: Handle Google callback
    HttpResponse::Ok().body("Google callback placeholder")
}


#[get("/auth/steam")]
pub async fn steam_login() -> impl Responder {
    let mut params = HashMap::new();
    params.insert("openid.ns".to_string(), "http://specs.openid.net/auth/2.0".to_string());
    params.insert("openid.mode".to_string(), "checkid_setup".to_string());
    params.insert("openid.return_to".to_string(), "http://localhost:8080/auth/steam/callback".to_string());
    params.insert("openid.realm".to_string(), "http://localhost:8080".to_string());
    params.insert("openid.identity".to_string(), "http://specs.openid.net/auth/2.0/identifier_select".to_string());
    params.insert("openid.claimed_id".to_string(), "http://specs.openid.net/auth/2.0/identifier_select".to_string());

    let auth_url = Url::parse_with_params("https://steamcommunity.com/openid/login", &params).unwrap();
    HttpResponse::Found()
        .append_header(("Location", auth_url.to_string()))
        .finish()
}

#[get("/auth/steam/callback")]
pub async fn steam_callback(query: web::Query<HashMap<String, String>>) -> impl Responder {
    let query_params = query.into_inner();
    let mut validation_params = query_params.clone();
    validation_params.insert("openid.mode".to_string(), "check_authentication".to_string());

    let client = reqwest::Client::new();
    let response = client
        .post("https://steamcommunity.com/openid/login")
        .form(&validation_params)
        .send()
        .await;

    match response {
        Ok(resp) => {
            let text = resp.text().await.unwrap_or_default();
            if text.contains("is_valid:true") {
                if let Some(claimed_id) = query_params.get("openid.claimed_id") {
                    let steam_id = claimed_id.split('/').last().unwrap_or("Unknown");
                    println!("Steam user ID: {}", steam_id);
                    HttpResponse::Found()
                        .append_header(("Location", format!("http://localhost:3000/profile?steam_id={}", steam_id)))
                        .finish()
                } else {
                    HttpResponse::BadRequest().body("No claimed_id in response")
                }
            } else {
                HttpResponse::BadRequest().body("Steam validation failed")
            }
        }
        Err(e) => {
            eprintln!("Steam validation error: {:?}", e);
            HttpResponse::InternalServerError().body("Steam login failed")
        }
    }
}