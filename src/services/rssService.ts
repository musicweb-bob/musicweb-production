interface RSSArticle {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  link: string;
  image?: string;
}

function parseRSSXML(xmlString: string): RSSArticle[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  const items = xmlDoc.querySelectorAll('item');
  const articles: RSSArticle[] = [];

  items.forEach((item, index) => {
    const title = item.querySelector('title')?.textContent || 'Untitled';
    const link = item.querySelector('link')?.textContent || '#';
    const pubDate = item.querySelector('pubDate')?.textContent || '';
    const description = item.querySelector('description')?.textContent || '';
    const guid = item.querySelector('guid')?.textContent || `pitchfork-${index}`;

    // Extract image from description
    let image = '';
    const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
      image = imgMatch[1];
    }

    // Clean up description text (remove HTML tags)
    const excerpt = description.replace(/<[^>]*>/g, '').substring(0, 200).trim();

    // Format date
    const date = pubDate ? new Date(pubDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) : 'Recent';

    articles.push({
      id: guid,
      title,
      date,
      category: 'Pitchfork News',
      excerpt,
      link,
      image,
    });
  });

  return articles;
}

export async function fetchPitchforkNews(limit: number = 10): Promise<RSSArticle[]> {
  try {
    // Using a CORS proxy for development - in production you'd want your own backend
    const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
    const RSS_URL = 'https://pitchfork.com/rss/news/';

    const response = await fetch(CORS_PROXY + encodeURIComponent(RSS_URL));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlText = await response.text();
    const articles = parseRSSXML(xmlText);

    return articles.slice(0, limit);
  } catch (error) {
    console.error('Error fetching Pitchfork RSS feed:', error);
    // Return empty array on error so the page doesn't break
    return [];
  }
}
