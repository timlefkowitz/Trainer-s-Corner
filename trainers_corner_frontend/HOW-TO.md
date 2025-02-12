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
        

    CREATE USER trainers_corner_noob WITH PASSWORD 'password';
    ALTER ROLE trainers_corner_noob SET client_encoding TO 'utf8';
    ALTER ROLE trainers_corner_noob SET default_transaction_isolation TO 'read committed';
    ALTER ROLE trainers_corner_noob SET timezone TO 'UTC';
    GRANT ALL PRIVILEGES ON DATABASE trainers_corner TO trainers_corner_noob;
