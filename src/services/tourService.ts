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
  const cleanName = artistName.trim();
  if (!cleanName) return [];

  console.log(`Frontend searching via Vercel Bridge for: ${cleanName}`);

  try {
    // This calls the api/tours.ts bridge we created
    const response = await fetch(`/api/tours?artist=${encodeURIComponent(cleanName)}`);
    
    if (!response.ok) {
      console.error("Bridge Connection Failed. Status:", response.status);
      return [];
    }

    const data = await response.json();

    // Bandsintown returns an array of events
    if (!Array.isArray(data)) {
      console.log("No event array found for this artist.");
      return []; 
    }

    // Map the REAL data to our professional UI components
    return data.map((event: any) => ({
      id: event.id.toString(),
      artist: cleanName,
      date: event.datetime, // ISO string format
      venue: event.venue?.name || 'TBA',
      location: `${event.venue?.city || ''}, ${event.venue?.country || ''}`,
      ticketUrl: event.offers?.[0]?.url || event.url,
      status: event.offers?.[0]?.status === 'available' ? 'available' : 'sold_out'
    }));

  } catch (error) {
    console.error("Critical Sync Error:", error);
    return [];
  }
};
