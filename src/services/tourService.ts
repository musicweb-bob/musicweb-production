import { Ticket, MapPin, Calendar } from 'lucide-react';

// 1. Define the Shape of a Concert Event
// We keep your interface exactly as is to prevent errors.
export interface StandardEvent {
  id: string;
  artist: string;
  date: string;
  venue: string;
  location: string;
  ticketUrl: string;
  status: 'available' | 'sold_out' | 'limited';
}

// 2. The "Brain" Function
export const fetchGlobalTours = async (query: string): Promise<StandardEvent[]> => {
  console.log(`Searching for: ${query}`);

  // Simulate a network delay so it feels real (0.8 seconds)
  await new Promise(resolve => setTimeout(resolve, 800));

  // --- MOCK DATA ---
  // This is the "Safety Data" that will force the cards to appear.
  const mockData: StandardEvent[] = [
    {
      id: '101',
      artist: 'Taylor Swift',
      date: '2025-10-18',
      venue: 'Hard Rock Stadium',
      location: 'Miami, FL',
      ticketUrl: 'https://ticketmaster.com',
      status: 'available'
    },
    {
      id: '102',
      artist: 'Taylor Swift',
      date: '2025-10-25',
      venue: 'Caesars Superdome',
      location: 'New Orleans, LA',
      ticketUrl: 'https://ticketmaster.com',
      status: 'available'
    },
    {
      id: '103',
      artist: 'Taylor Swift',
      date: '2025-11-01',
      venue: 'Lucas Oil Stadium',
      location: 'Indianapolis, IN',
      ticketUrl: 'https://ticketmaster.com',
      status: 'sold_out'
    },
    {
      id: '104',
      artist: 'Taylor Swift',
      date: '2025-11-14',
      venue: 'Rogers Centre',
      location: 'Toronto, ON',
      ticketUrl: 'https://ticketmaster.com',
      status: 'available'
    },
    {
      id: '105',
      artist: 'Taylor Swift',
      date: '2025-12-06',
      venue: 'BC Place',
      location: 'Vancouver, BC',
      ticketUrl: 'https://ticketmaster.com',
      status: 'limited'
    }
  ];

  return mockData;
};
