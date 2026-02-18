import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { artist } = req.query;

  if (!artist) {
    return res.status(400).json({ error: 'Artist name is required' });
  }

  // This request runs on Vercel's server, bypassing your Mac's browser security blocks.
  const BANDS_URL = `https://rest.bandsintown.com/artists/${encodeURIComponent(artist as string)}/events?app_id=musicweb_v2`;

  try {
    const response = await fetch(BANDS_URL);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch tour data' });
  }
}
