import { StandardEvent } from '../types';

export interface StandardEvent {
  id: string;
  artist: string;
  date: string;
  venue: string;
  location: string;
  ticketUrl: string;
  status: 'available' | 'sold_out' | 'limited';
}

export const fetchGlobalTours = async (artistName: string): Promise<StandardEvent[]> => {
  const cleanName = artistName.trim();
  if (!cleanName) return [];

  // Bypassing the broken AllOrigins proxy with a direct, secure bridge
  const PROXY = "https://cors-anywhere.herokuapp.com/";
  const BANDS_URL = `https://rest.bandsintown.com/artists/${encodeURIComponent(cleanName)}/events?app_id=musicweb_v2`;

  try {
    // We fetch directly from the bridge
    const response = await fetch(PROXY + BANDS_URL, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    
    if (!response.ok) throw new Error("Bridge connection failed");
    
    const data = await response.json();
    if (!Array.isArray(data)) return [];

    return data.map((event: any) => ({
      id: event.id,
      artist: cleanName,
      date: event.datetime,
      venue: event.venue.name,
      location: `${event.venue.city}, ${event.venue.country}`,
      ticketUrl: event.offers?.[0]?.url || event.url,
      status: event.offers?.[0]?.status === 'available' ? 'available' : 'sold_out'
    }));

  } catch (error) {
    console.error("Tour Engine Sync Error:", error);
    return [];
  }
};
