import { sql } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  // 1. Auto-create the secure settings table if it doesn't exist
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS admin_settings (
        id INT PRIMARY KEY,
        password VARCHAR(255) NOT NULL
      );
    `;
    // Insert the default password 'musicweb' ONLY if the table is brand new
    const { rowCount } = await sql`SELECT * FROM admin_settings WHERE id = 1;`;
    if (rowCount === 0) {
      await sql`INSERT INTO admin_settings (id, password) VALUES (1, 'musicweb');`;
    }
  } catch (e) {
    console.error("Auth table error:", e);
  }

  if (req.method === 'POST') {
    const { action, password, newPassword } = req.body;

    // 2. Handle Login Verification
    if (action === 'login') {
      try {
        const { rows } = await sql`SELECT password FROM admin_settings WHERE id = 1;`;
        if (rows[0].password === password) {
          return res.status(200).json({ success: true });
        }
        return res.status(401).json({ success: false, message: 'Invalid password' });
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }
    }

    // 3. Handle Password Updates
    if (action === 'update') {
      try {
        await sql`UPDATE admin_settings SET password = ${newPassword} WHERE id = 1;`;
        return res.status(200).json({ success: true });
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to update password' });
      }
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
