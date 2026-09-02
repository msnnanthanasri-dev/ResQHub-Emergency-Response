import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "resqhub",
  user: "postgres",
  password: "project",
});

export default pool;