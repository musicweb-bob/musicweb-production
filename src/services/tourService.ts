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

  try {
    // Calling your NEW Vercel serverless bridge
    const response = await fetch(`/api/tours?artist=${encodeURIComponent(cleanName)}`);
    
    if (!response.ok) throw new Error("Server bridge error");
    
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
    console.error("The Server Bridge is not responding:", error);
    return [];
  }
};
