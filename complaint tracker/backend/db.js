import pkg from 'pg';
const {Pool} = pkg;
const pool = new Pool({
  user: "postgres",        //  postgres username
  host: "localhost",
<<<<<<< Updated upstream
  database: "SANTOSH_DB",  //  database name
=======
  database: "COMPLAINT_TRACKER_1",  //  database name
>>>>>>> Stashed changes
  password: "santosh@8528095052",      //  postgres password
  port: 5432,
});

export default pool;
