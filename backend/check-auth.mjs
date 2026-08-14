import "dotenv/config";
import pg from "pg";
import bcrypt from "bcryptjs";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

try {
  const result = await pool.query(
    "SELECT password_hash FROM users WHERE email = $1",
    ["admin@workspace.edu"]
  );

  console.log("User found:", result.rows.length === 1);

  if (result.rows.length === 1) {
    const matches = await bcrypt.compare(
      "admin123",
      result.rows[0].password_hash
    );

    console.log("Password matches:", matches);
  }
} catch (error) {
  console.error(error);
} finally {
  await pool.end();
}