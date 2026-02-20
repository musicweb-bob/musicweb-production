import { sql } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  // 1. Ensure the stats table exists
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS site_stats (
        id INT PRIMARY KEY,
        total_hits BIGINT DEFAULT 0
      );
    `;
    const { rowCount } = await sql`SELECT * FROM site_stats WHERE id = 1;`;
    if (rowCount === 0) {
      await sql`INSERT INTO site_stats (id, total_hits) VALUES (1, 0);`;
    }
  } catch (e) {
    console.error("Stats DB error:", e);
  }

  // 2. Record a new visit
  if (req.method === 'POST') {
    try {
      await sql`UPDATE site_stats SET total_hits = total_hits + 1 WHERE id = 1;`;
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to record hit' });
    }
  }

  // 3. Fetch total for the Command Center
  if (req.method === 'GET') {
    try {
      const { rows } = await sql`SELECT total_hits FROM site_stats WHERE id = 1;`;
      return res.status(200).json({ total: rows[0].total_hits });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
