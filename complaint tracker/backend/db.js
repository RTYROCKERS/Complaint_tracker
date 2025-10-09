import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres.ymdphoefdmgbnhblkvia",
  host: "aws-1-us-east-1.pooler.supabase.com", // <-- Session Pooler host
  database: "postgres",
  password: "CircusHunters",
  port: 6543, // <-- Pooler port (different from 5432)
  ssl: { rejectUnauthorized: false },
});

export default pool;


//CircusHunters
//5432