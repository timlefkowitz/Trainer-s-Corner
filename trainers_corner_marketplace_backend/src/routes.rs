use actix_web::{get, post, put, web, Responder, HttpResponse, HttpRequest};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use crate::schema::{users, cards};
use crate::models::{User, Portfolio, Card};
use crate::DbPool;
use crate::UserId;
use actix_web::HttpMessage;


#[derive(Deserialize)]
pub struct QueryParams {
    pub set: Option<String>,
    pub search: Option<String>,
}

#[derive(Deserialize)]
struct FollowRequest {
    friend_id: String,
}

#[derive(Serialize)]
struct PortfolioItem {
    card: Card,
    quantity: i32,
}

#[derive(Deserialize)]
struct PortfolioRequest {
    card_id: i32,
    quantity: Option<i32>,
}


#[get("/api/cards")]
pub async fn get_cards(pool: web::Data<DbPool>, query: web::Query<QueryParams>) -> impl Responder {
    use crate::schema::cards::dsl::*;
    let mut conn = pool.get().expect("Couldn't get DB connection");
    let mut card_query = cards.into_boxed();
    if let Some(ref set_name) = query.set {
        card_query = card_query.filter(set.eq(set_name));
    }
    if let Some(ref search_term) = query.search {
        card_query = card_query.filter(name.ilike(format!("%{}%", search_term)));
    }
    let card_list = match card_query.load::<Card>(&mut conn) {
        Ok(list) => list,
        Err(e) => {
            eprintln!("Error loading cards: {:?}", e);
            return HttpResponse::InternalServerError().body("Failed to load cards");
        }
    };
    HttpResponse::Ok().json(card_list)
}

#[get("/api/cards/{id}")]
pub async fn get_card(pool: web::Data<DbPool>, card_id: web::Path<i32>) -> impl Responder {
    use crate::schema::cards::dsl::*;
    let mut conn = pool.get().expect("Couldn't get DB connection");
    let card = cards
        .filter(id.eq(*card_id))
        .first::<Card>(&mut conn)
        .optional();
    match card {
        Ok(Some(card)) => HttpResponse::Ok().json(card),
        Ok(None) => HttpResponse::NotFound().json("Card not found"),
        Err(e) => {
            eprintln!("Error querying card: {:?}", e);
            HttpResponse::InternalServerError().body("Error querying card")
        }
    }
}

#[get("/api/following")]
pub async fn get_following(pool: web::Data<DbPool>, req: HttpRequest) -> impl Responder {
    use crate::schema::friendships::dsl::*;
    use crate::schema::users::dsl as users_dsl;

    let current_user_id = req.extensions()
        .get::<UserId>()
        .map(|u| u.0.clone())
        .unwrap_or("guest".to_string());
    let mut conn = pool.get().expect("Couldn't get DB connection");

    let following_list = friendships
        .inner_join(users::table.on(users_dsl::id.eq(friend_id)))
        .filter(user_id.eq(current_user_id))
        .select(User::as_select())
        .load::<User>(&mut conn);

    match following_list {
        Ok(friends) => HttpResponse::Ok().json(friends),
        Err(e) => {
            eprintln!("Error fetching following: {:?}", e);
            HttpResponse::InternalServerError().body("Error fetching following")
        }
    }
}


#[post("/api/follow")]
pub async fn add_friend(pool: web::Data<DbPool>, req: HttpRequest, body: web::Json<FollowRequest>) -> impl Responder {
    use crate::schema::friendships::dsl::*;
    use crate::schema::users::dsl as users_dsl;

    let current_user_id = req.extensions()
        .get::<UserId>()
        .map(|u| u.0.clone())
        .unwrap_or("guest".to_string());
    let mut conn = pool.get().expect("Couldn't get DB connection");

    let friend = users_dsl::users
        .filter(users_dsl::id.eq(&body.friend_id))
        .select(User::as_select())
        .first::<User>(&mut conn)
        .optional();

    match friend {
        Ok(Some(friend_data)) => {
            let new_friendship = diesel::insert_into(friendships)
                .values((
                    user_id.eq(current_user_id),
                    friend_id.eq(&body.friend_id),
                ))
                .execute(&mut conn);

            match new_friendship {
                Ok(_) => HttpResponse::Ok().json(friend_data),
                Err(e) => {
                    eprintln!("Error adding friend: {:?}", e);
                    HttpResponse::InternalServerError().body("Failed to add friend")
                }
            }
        }
        Ok(None) => HttpResponse::NotFound().body("Friend not found"),
        Err(e) => {
            eprintln!("Error finding friend: {:?}", e);
            HttpResponse::InternalServerError().body("Error checking friend")
        }
    }
}

#[put("/api/user")]
pub async fn update_user(pool: web::Data<DbPool>, req: HttpRequest, body: web::Json<User>) -> impl Responder {
    use crate::schema::users::dsl::*;

    let current_user_id = req.extensions()
        .get::<UserId>()
        .map(|u| u.0.clone())
        .unwrap_or("guest".to_string());
    let mut conn = pool.get().expect("Couldn't get DB connection");

    let updated = diesel::update(users.filter(id.eq(current_user_id)))
        .set(&*body)
        .execute(&mut conn);

    match updated {
        Ok(_) => HttpResponse::Ok().json(body.into_inner()),
        Err(e) => {
            eprintln!("Error updating user: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to update user")
        }
    }
}

#[get("/portfolio")]
pub async fn get_portfolio(pool: web::Data<DbPool>, req: HttpRequest) -> impl Responder {
    use crate::schema::portfolio::dsl::*;
    use crate::schema::cards::dsl as cards_dsl;

    let user_id_from_token = req
        .headers()
        .get("X-User-Id")
        .and_then(|h| h.to_str().ok());

    let user_id_str = match user_id_from_token {
        Some(uid) => uid.to_string(),
        None => return HttpResponse::Unauthorized().body("No user ID found in token"),
    };

    let mut conn = match pool.get() {
        Ok(c) => c,
        Err(_) => return HttpResponse::InternalServerError().body("Failed to get DB connection"),
    };

    let result = portfolio
        .filter(user_id.eq(&user_id))
        .inner_join(cards::table.on(cards::id.eq(card_id)))
        .select((cards::all_columns, quantity))
        .load::<(Card, i32)>(&mut conn);


    match result {
        Ok(data) => {
            let items: Vec<PortfolioItem> = data.into_iter()
                .map(|(card, qty)| PortfolioItem { card, quantity: qty })
                .collect();
            HttpResponse::Ok().json(items)
        }
        Err(_) => HttpResponse::InternalServerError().body("Failed to load portfolio"),
    }
}

#[post("/api/portfolio")]
pub async fn add_to_portfolio(pool: web::Data<DbPool>, req: HttpRequest, body: web::Json<PortfolioRequest>) -> impl Responder {
    use crate::schema::portfolio::dsl::*;

    let current_user_id = req.extensions()
        .get::<UserId>()
        .map(|u| u.0.clone())
        .unwrap_or("guest".to_string());
    let mut conn = pool.get().expect("Couldn't get DB connection");

    let qty = body.quantity.unwrap_or(1);
    let new_portfolio_entry = diesel::insert_into(portfolio)
        .values((
            user_id.eq(current_user_id),
            card_id.eq(&body.card_id),
            quantity.eq(qty),
        ))
        .on_conflict((user_id, card_id))
        .do_update()
        .set(quantity.eq(quantity + qty))
        .execute(&mut conn);

    match new_portfolio_entry {
        Ok(_) => HttpResponse::Ok().body("Card added to portfolio"),
        Err(e) => {
            eprintln!("Error adding to portfolio: {:?}", e);
            HttpResponse::InternalServerError().body("Error adding to portfolio")
        }
    }
}