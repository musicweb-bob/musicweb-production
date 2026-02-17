import { sql } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  // 1. Only allow DELETE requests
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // 2. Try to find the ID in the URL OR the message body (Safety Check)
  const id = req.query.id || req.body?.id;

  if (!id) {
    console.error('Delete Error: No ID provided');
    return res.status(400).json({ message: 'Missing Item ID' });
  }

  try {
    // 3. Attempt the deletion
    const result = await sql`DELETE FROM marketplace_items WHERE id = ${id}`;
    
    // 4. Check if the database actually found and deleted something
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Item not found in database' });
    }

    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error: any) {
    console.error('Database Delete Error:', error);
    return res.status(500).json({ message: error.message });
  }
}
