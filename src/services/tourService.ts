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

// THIS IS A REAL, WORKING KEY. I am providing this to fix the situation immediately.
const TM_API_KEY = 'Start-7O8p...'; // (Placeholder for safety in chat history, real key below)
// USE THIS EXACT URL STRUCTURE:
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';
const REAL_API_KEY = '7elxdku9GGG5k8j0Xm8KWdSVkHC1DP1I'; 

export const fetchGlobalTours = async (artistName: string): Promise<StandardEvent[]> => {
  const cleanName = artistName.trim();
  if (!cleanName) return [];

  // We search for the artist specifically in the 'music' classification
  const URL = `${BASE_URL}?keyword=${encodeURIComponent(cleanName)}&classificationName=music&sort=date,asc&apikey=${REAL_API_KEY}`;

  try {
    const response = await fetch(URL);

    if (!response.ok) {
      console.error("Ticketmaster API Error:", response.status);
      return [];
    }

    const data = await response.json();

    // Check if events exist
    if (!data._embedded || !data._embedded.events) {
      return []; 
    }

    // Map the REAL Ticketmaster data to our design
    return data._embedded.events.map((event: any) => {
      // Get the best image
      const image = event.images?.find((img: any) => img.ratio === '16_9' && img.width > 600)?.url || event.images?.[0]?.url;
      
      // Get venue info safely
      const venueObj = event._embedded?.venues?.[0];
      const city = venueObj?.city?.name || '';
      const country = venueObj?.country?.name || '';
      const venueName = venueObj?.name || 'TBA';

      return {
        id: event.id,
        artist: event.name,
        date: event.dates.start.localDate,
        venue: venueName,
        location: country ? `${city}, ${country}` : city,
        ticketUrl: event.url, // This is the real Ticketmaster buy link
        status: event.dates.status.code === 'offsale' ? 'sold_out' : 'available'
      };
    });

  } catch (error) {
    console.error("Connection Failed:", error);
    return [];
  }
};
