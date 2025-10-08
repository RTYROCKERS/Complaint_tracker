// backend/db.js
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
<<<<<<< Updated upstream
  user: "postgres",        //  postgres username
  host: "localhost",
<<<<<<< Updated upstream
  database: "COMPLAINT_TRACKER",  //  database name
=======
  database: "COMPLAINT_TRACKER_1",  //  database name
>>>>>>> Stashed changes
  password: "santosh@8528095052",      //  postgres password
  port: 5432,
=======
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
>>>>>>> Stashed changes
});

export default pool;
