import pkg from 'pg';
const {Pool} = pkg;
const pool = new Pool({
  user: "postgres",        //  postgres username
  host: "localhost",
  database: "circus_grievance",  //  database name
  password: "ruchir2005",      //  postgres password
  port: 5433,
});

export default pool;