import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { artist } = req.query;
  if (!artist) return res.status(400).json([]);

  const BANDS_URL = `https://rest.bandsintown.com/artists/${encodeURIComponent(artist as string)}/events?app_id=musicweb_v2`;

  try {
    const response = await fetch(BANDS_URL);
    if (!response.ok) return res.status(200).json([]); // Return empty list rather than erroring out

    const data = await response.json();
    return res.status(200).json(Array.isArray(data) ? data : []);
  } catch (error) {
    return res.status(200).json([]);
  }
}
