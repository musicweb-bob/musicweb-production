import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  try {
    // 1. Reset ONLY the News table (Marketplace is safe!)
    await sql`DROP TABLE IF EXISTS news_items;`;

    // 2. Create the News table
    // We need: Title, Date, Author, The Article Text (Content), and a Photo
    await sql`
      CREATE TABLE news_items (
        id SERIAL PRIMARY KEY,
        title TEXT,
        date TEXT,
        author TEXT,
        content TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return response.status(200).json({ message: "News Database Created Successfully!" });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
