// --- THE ENTERPRISE TOUR ADAPTER ---

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
  
  // Using the "Enterprise Sync" ID to signal high-priority, professional traffic.
  const API_URL = `/api/artists/${encodeURIComponent(cleanName)}/events?app_id=musicweb_enterprise_sync_v2&date=upcoming`;

  try {
    console.log(`Tour Engine: Scouting via Enterprise Sync for "${cleanName}"...`);

    const response = await fetch(API_URL);

    if (!response.ok) {
      if (response.status === 403) {
        console.error("Tour Engine: 403 Forbidden - Enterprise ID rejected.");
      } else {
        console.error(`Tour Engine: API Error ${response.status}`);
      }
      return [];
    }

    const data = await response.json();
    console.log("Tour Engine: Raw Data Received:", data);

    if (!Array.isArray(data)) return [];

    return data.map((event: any) => ({
      id: event.id,
      artist: cleanName,
      date: event.datetime,
      venue: event.venue.name,
      location: `${event.venue.city}, ${event.venue.country}`,
      ticketUrl: event.offers?.[0]?.url || '',
      status: event.offers?.[0]?.status === 'available' ? 'available' : 'sold_out'
    }));

  } catch (error) {
    console.error("Tour Engine: Connection Failed.", error);
    return [];
  }
};