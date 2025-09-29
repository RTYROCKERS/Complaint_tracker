import pkg from 'pg';
const {Pool} = pkg;
const pool = new Pool({
  user: "postgres",        //  postgres username
  host: "localhost",
  database: "SANTOSH_DB",  //  database name
  password: "santosh@8528095052",      //  postgres password
  port: 5432,
});

export default pool;
