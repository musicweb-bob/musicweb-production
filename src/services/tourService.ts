import { StandardEvent } from '../types'; // Adjust if needed

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

  // THE PROXY: This is the tunnel we discussed yesterday to bypass the Mac's browser block.
  const PROXY = "https://api.allorigins.win/get?url=";
  const BANDS_URL = `https://rest.bandsintown.com/artists/${encodeURIComponent(cleanName)}/events?app_id=musicweb_v2`;

  try {
    const response = await fetch(PROXY + encodeURIComponent(BANDS_URL));
    
    if (!response.ok) throw new Error("Network response was not ok");
    
    const wrapper = await response.json();
    // AllOrigins returns the data as a string inside 'contents', so we parse it.
    const data = JSON.parse(wrapper.contents); 

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
    console.error("Proxy Connection Failed:", error);
    return [];
  }
};
