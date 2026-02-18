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

  console.log(`Searching via Vercel Bridge for: ${cleanName}`);

  try {
    const response = await fetch(`/api/tours?artist=${encodeURIComponent(cleanName)}`);
    
    if (!response.ok) {
      console.error("Bridge Connection Failed. Status:", response.status);
      return [];
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.log("No event array found for this artist.");
      return []; 
    }

    return data.map((event: any) => ({
      id: event.id.toString(),
      artist: cleanName,
      date: event.datetime,
      venue: event.venue?.name || 'Venue TBA',
      location: `${event.venue?.city || ''}, ${event.venue?.country || ''}`,
      ticketUrl: event.offers?.[0]?.url || event.url,
      status: event.offers?.[0]?.status === 'available' ? 'available' : 'sold_out'
    }));

  } catch (error) {
    console.error("Critical Sync Error:", error);
    return [];
  }
};
