// Lists the user accounts Neon Auth stored in your Neon database.
// Usage: npm run users   (reads DATABASE_URL from .env.local; never prints it)
// Passwords are NOT in this table: Neon Auth keeps only a hashed password,
// in neon_auth.account, and this script never reads that table.
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Run `vercel env pull .env.local` first.");
  process.exit(1);
}

const sql = neon(url);
const rows = await sql`SELECT * FROM neon_auth."user" ORDER BY "createdAt" DESC`;

const show = ["id", "name", "email", "emailVerified", "createdAt"];
console.log(`\n${rows.length} RunReady account(s) in neon_auth.user:\n`);
console.table(rows.map((r) => Object.fromEntries(show.map((k) => [k, r[k]]))));
