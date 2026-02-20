import { sql } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  // 1. Auto-create the table if it doesn't exist yet
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS community_streams (
        id SERIAL PRIMARY KEY,
        url VARCHAR(1000) NOT NULL,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
  } catch (e) {
    console.error("Table creation error:", e);
  }

  // 2. GET: Fetch all live tracks for the community board
  if (req.method === 'GET') {
    try {
      const { rows } = await sql`SELECT * FROM community_streams ORDER BY id DESC;`;
      return res.status(200).json({ streams: rows });
    } catch (error) {
      return res.status(500).json({ error: 'Database error fetching streams' });
    }
  }

  // 3. POST: Save a new track
  if (req.method === 'POST') {
    const { url, email } = req.body;
    if (!url || !email) return res.status(400).json({ error: 'Missing fields' });
    
    try {
      await sql`INSERT INTO community_streams (url, email) VALUES (${url}, ${email});`;
      return res.status(200).json({ message: 'Success' });
    } catch (error) {
      return res.status(500).json({ error: 'Database error saving stream' });
    }
  }

  // 4. DELETE: Admin removal
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing ID' });

    try {
      await sql`DELETE FROM community_streams WHERE id = ${id};`;
      return res.status(200).json({ message: 'Deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Database error deleting stream' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
