=====  TIPS AND TRICKS ==== 

    front_end
        we are running the front end with npm 
            cd into the frontend
             npm run dev

    back_end
        we are running the backend with cargo ( let's run the backend first )
            cd into the backend 
            cargo run


    database
        

    diesel migration generate add_card_fields


    CREATE USER trainers_corner_noob WITH PASSWORD 'password';
    ALTER ROLE trainers_corner_noob SET client_encoding TO 'utf8';
    ALTER ROLE trainers_corner_noob SET default_transaction_isolation TO 'read committed';
    ALTER ROLE trainers_corner_noob SET timezone TO 'UTC';
    GRANT ALL PRIVILEGES ON DATABASE trainers_corner TO trainers_corner_noob;



pub struct Card {
pub id: i32,
pub name: String,
pub rarity: String,
pub price: f64,
pub set: String,
pub year: u16,
pub condition: String,
pub image_url: String,
pub card_type: String,
pub language: String,

}