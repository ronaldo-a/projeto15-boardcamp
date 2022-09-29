import dotenv from "dotenv";
import pg from "pg";

dotenv.config();
const {Pool} = pg;

const connection = new Pool ({

    //connectionString: process.env.DATABASE_URL 
    
    user: 'postgres',
    password: 'orkutorkut',
    host: 'localhost',
    port: 5432,
    database: 'boardcamp'
});

export default connection;

