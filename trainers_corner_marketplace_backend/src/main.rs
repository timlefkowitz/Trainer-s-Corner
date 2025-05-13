use actix_web::{web, App, HttpServer, HttpResponse, Responder, middleware::Logger, get, HttpMessage};
use actix_web::dev::{ServiceRequest, ServiceResponse, Service, Transform};
use actix_web::http::header::HeaderValue;
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager};
use futures::future::LocalBoxFuture;

mod models;
mod schema;
mod routes;
mod auth;

type DbPool = r2d2::Pool<ConnectionManager<PgConnection>>;

struct UserId(String);

struct AuthMiddleware;

impl<S, B> Transform<S, ServiceRequest> for AuthMiddleware
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = actix_web::Error> + 'static,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = actix_web::Error;
    type InitError = ();
    type Transform = AuthMiddlewareService<S>;
    type Future = futures::future::Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        futures::future::ok(AuthMiddlewareService { service })
    }
}

struct AuthMiddlewareService<S> {
    service: S,
}

impl<S, B> Service<ServiceRequest> for AuthMiddlewareService<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = actix_web::Error> + 'static,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = actix_web::Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    actix_web::dev::forward_ready!(service);

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let user_id = req.headers()
            .get("X-User-ID")
            .unwrap_or(&HeaderValue::from_static("guest"))
            .to_str()
            .unwrap_or("guest")
            .to_string();

        req.extensions_mut().insert(UserId(user_id));
        let fut = self.service.call(req);
        Box::pin(fut)
    }
}

#[get("/api/sets")]
async fn get_sets(pool: web::Data<DbPool>) -> impl Responder {
    use crate::schema::cards::dsl::*;
    let mut conn = pool.get().expect("Couldn't get DB connection");
    let set_list = cards
        .select(set)
        .distinct()
        .load::<Option<String>>(&mut conn)
        .expect("Error loading sets");
    HttpResponse::Ok().json(set_list.into_iter().flatten().collect::<Vec<String>>())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    env_logger::init_from_env(env_logger::Env::default().default_filter_or("info"));
    println!("Loading environment...");
    let database_url = match std::env::var("DATABASE_URL") {
        Ok(url) => url,
        Err(e) => {
            eprintln!("DATABASE_URL not set: {:?}", e);
            std::process::exit(1);
        }
    };
    println!("Connecting to database: {}", database_url);
    let manager = ConnectionManager::<PgConnection>::new(&database_url);
    let pool = match r2d2::Pool::builder().build(manager) {
        Ok(pool) => {
            println!("Database pool created successfully");
            pool
        }
        Err(e) => {
            eprintln!("Failed to create pool: {:?}", e);
            std::process::exit(1);
        }
    };

    println!("Starting server at http://127.0.0.1:8080");
    match HttpServer::new(move || {
        println!("Initializing app...");
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .wrap(Logger::default())
            .wrap(AuthMiddleware)
            .service(routes::get_card)
            .service(routes::get_cards)
            .service(routes::add_friend)
            .service(routes::get_following)
            .service(routes::update_user)
            .service(routes::get_portfolio)
            .service(routes::add_to_portfolio)
            .service(get_sets)
            .service(web::resource("/auth/steam/login").route(web::get().to(auth::steam_login)))
            .service(web::resource("/auth/steam/callback").route(web::get().to(auth::steam_callback)))
    })
        .bind("127.0.0.1:8080")
    {
        Ok(server) => {
            println!("Server bound to 127.0.0.1:8080");
            server.run().await
        }
        Err(e) => {
            eprintln!("Failed to bind server: {:?}", e);
            Err(e)
        }
    }
}