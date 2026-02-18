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
    // Calling your Vercel serverless bridge directly
    const response = await fetch(`/api/tours?artist=${encodeURIComponent(cleanName)}`);
    
    if (!response.ok) {
      console.error(`Bridge Error: ${response.status}`);
      return [];
    }
    
    const data = await response.json();

    // Map the real data from the bridge to your design
    if (!Array.isArray(data)) return [];

    return data.map((event: any) => ({
      id: event.id,
      artist: cleanName,
      date: event.datetime,
      venue: event.venue?.name || 'Venue TBA',
      location: `${event.venue?.city || ''}, ${event.venue?.country || ''}`,
      ticketUrl: event.offers?.[0]?.url || event.url,
      status: event.offers?.[0]?.status === 'available' ? 'available' : 'sold_out'
    }));

  } catch (error) {
    console.error("Connection Failure:", error);
    return [];
  }
};
