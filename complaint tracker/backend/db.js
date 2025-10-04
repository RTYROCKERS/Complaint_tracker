import pkg from 'pg';
const {Pool} = pkg;
const pool = new Pool({
  user: "--------",        //  postgres username
  host: "-------",
  database: "-------",  //  database name
  password: "------",      //  postgres password
  port: ------,
});

export default pool;
