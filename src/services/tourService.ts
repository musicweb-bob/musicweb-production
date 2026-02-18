import { Ticket, MapPin, Calendar } from 'lucide-react';

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
  // 1. Clean the input
  const cleanName = artistName.trim();
  if (!cleanName) return [];

  console.log(`Searching Bandsintown for: ${cleanName}`);

  // 2. USE THE PUBLIC TEST ID (No sign-up required)
  // We use "123" or "test" as the app_id, which is allowed for public display
  const APP_ID = 'musicweb_public_test'; 
  const URL = `https://rest.bandsintown.com/artists/${encodeURIComponent(cleanName)}/events?app_id=${APP_ID}`;

  try {
    const response = await fetch(URL);

    if (!response.ok) {
      console.error("Bandsintown API Error:", response.status);
      return [];
    }

    const data = await response.json();

    // 3. If no artist found or no events, return empty
    if (!Array.isArray(data)) {
      return []; 
    }

    // 4. Map the REAL data to our design
    return data.map((event: any) => ({
      id: event.id,
      artist: cleanName,
      date: event.datetime,
      venue: event.venue.name,
      location: `${event.venue.city}, ${event.venue.country}`,
      ticketUrl: event.offers?.[0]?.url || `https://www.google.com/search?q=${cleanName}+tickets`,
      status: event.offers?.[0]?.status === 'available' ? 'available' : 'sold_out'
    }));

  } catch (error) {
    console.error("Connection Failed:", error);
    return [];
  }
};
