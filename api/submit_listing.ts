import { sql } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  // 1. INPUT CLEANING
  let { url, email, isBulk, currentCount, totalCount, bulkTitles } = req.body;
  if (!url || !email) return res.status(400).json({ message: 'Missing fields' });
  
  email = email.toLowerCase().trim();

  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("CONFIGURATION ERROR: Vercel is missing the RESEND_API_KEY.");
    }

    // 2. INTELLIGENT SCOUTING
    let title = 'New Submission';
    let artist = 'See Details';
    let image_url = '';
    let price = 'Pending';
    let condition = 'Used';
    // Default category is Misc until we prove otherwise
    let category = 'Misc';

    // A. REVERB SPECIFIC SCOUT
    if (url.includes('reverb.com/item/')) {
      try {
        const slug = url.split('reverb.com/item/')[1].split('?')[0];
        const reverbRes = await fetch(`https://api.reverb.com/api/listings/${slug}`, {
          headers: { 'Accept-Version': '3.0', 'Content-Type': 'application/json' }
        });
        if (reverbRes.ok) {
          const data = await reverbRes.json();
          if (data.title) title = data.title;
          if (data.make && data.model) artist = `${data.make} ${data.model}`;
          if (data.price && data.price.amount) price = `$${data.price.amount}`;
          if (data.condition && data.condition.display_name) condition = data.condition.display_name;
          if (data.photos && data.photos.length > 0) image_url = data.photos[0]._links.large_crop.href;
        }
      } catch (e) { console.error("Reverb Scout Failed"); }
    } 
    
    // B. UNIVERSAL SCOUT (eBay, Social Media, etc.)
    else {
      try {
        const isSocial = url.includes('facebook.com') || url.includes('instagram.com');
        const isEbay = url.includes('ebay.com');
        
        const params = new URLSearchParams({
          url: url,
          'palette': 'true',
          'prerender': (isSocial || isEbay) ? 'true' : 'auto', 
          'data.title.selector': 'title',
          'data.image.selector': 'meta[property="og:image"]',
          'data.image.attr': 'content',
          'data.metaPrice.selector': 'meta[property="product:price:amount"]',
          'data.metaPrice.attr': 'content',
          'data.ebayPrice.selector': '.x-price-primary',
        });

        const scoutUrl = `https://api.microlink.io/?${params.toString()}`;
        const response = await fetch(scoutUrl);
        
        if (response.ok) {
          const result = await response.json();
          const data = result.data;
          
          if (data) {
             if (data.title) title = data.title;
             if (data.image && data.image.url) image_url = data.image.url;
             let rawPrice = data.metaPrice || data.ebayPrice;
             if (rawPrice) {
                const moneyMatch = rawPrice.toString().match(/[\d,]+\.\d{2}/);
                if (moneyMatch) price = `$${moneyMatch[0]}`;
                else price = rawPrice;
             }
          }
        }
      } catch (e) { console.error('Universal Scout Failed'); }
    }

    if (title.includes('|')) title = title.split('|')[0].trim();

    // 3. AUTO-CATEGORIZATION LOGIC (The Expanded Brain)
    const lowerTitle = title.toLowerCase();
    const lowerUrl = url.toLowerCase();
    const combinedText = lowerTitle + " " + lowerUrl;

    // VINYL & RECORDS
    if (combinedText.includes('vinyl') || combinedText.includes('lp') || combinedText.includes('record') || combinedText.includes('12-inch') || combinedText.includes('45rpm')) {
      category = 'Vinyl';
    } 
    // CDs
    else if (combinedText.includes('cd') || combinedText.includes('compact disc') || combinedText.includes('digipak')) {
      category = 'CDs';
    } 
    // CASSETTES
    else if (combinedText.includes('cassette') || combinedText.includes('tape') || combinedText.includes('mc')) {
      category = 'Cassettes';
    } 
    // MEMORABILIA (Posters, Apparel)
    else if (combinedText.includes('poster') || combinedText.includes('print') || combinedText.includes('lithograph') || combinedText.includes('shirt') || combinedText.includes('hoodie') || combinedText.includes('hat') || combinedText.includes('sticker') || combinedText.includes('patch')) {
      category = 'Memorabilia';
    } 
    // BOOKS
    else if (combinedText.includes('book') || combinedText.includes('paperback') || combinedText.includes('hardcover') || combinedText.includes('biography') || combinedText.includes('tablature')) {
      category = 'Books';
    } 
    // EQUIPMENT (The "Big Net" for Instruments & Gear)
    else if (
      combinedText.includes('guitar') || combinedText.includes('stratocaster') || combinedText.includes('telecaster') || combinedText.includes('les paul') ||
      combinedText.includes('amp') || combinedText.includes('cabinet') || combinedText.includes('pedal') || combinedText.includes('fuzz') || combinedText.includes('overdrive') ||
      combinedText.includes('synth') || combinedText.includes('keyboard') || combinedText.includes('piano') || combinedText.includes('organ') || combinedText.includes('eurorack') ||
      combinedText.includes('drum') || combinedText.includes('snare') || combinedText.includes('cymbal') || combinedText.includes('percussion') ||
      combinedText.includes('microphone') || combinedText.includes('interface') || combinedText.includes('mixer') || combinedText.includes('preamp') || combinedText.includes('compressor') ||
      combinedText.includes('ukulele') || combinedText.includes('mandolin') || combinedText.includes('banjo') || combinedText.includes('violin') || combinedText.includes('cello') || combinedText.includes('saxophone') || combinedText.includes('trumpet') || combinedText.includes('flute') ||
      combinedText.includes('turntable') || combinedText.includes('dj') || combinedText.includes('controller')
    ) {
      category = 'Equipment';
    }

    // 4. SAVE TO DATABASE
    await sql`
      INSERT INTO marketplace_items (title, artist, price, category, image_url, link, condition, seller_email)
      VALUES (${title}, ${artist}, ${price}, ${category}, ${image_url}, ${url}, ${condition}, ${email});
    `;

    // 5. THE ITEMIZED EMAIL LOGIC
    const isLastItem = isBulk && Number(currentCount) === Number(totalCount);
    const shouldSendEmail = !isBulk || isLastItem;

    if (shouldSendEmail) {
      let htmlBody = '';
      let subjectLine = '';

      if (isBulk) {
        const allTitles = Array.isArray(bulkTitles) ? [...bulkTitles, title] : [title];
        const listItems = allTitles.map(t => `<li>${t}</li>`).join('');

        subjectLine = `Bulk Upload Success: ${totalCount} Items Added`;
        htmlBody = `
          <div style="font-family: sans-serif; line-height: 1.6;">
            <h2 style="color: #9333ea;">Bulk Inventory Update Complete</h2>
            <p>Your spreadsheet of <b>${totalCount} items</b> has been processed.</p>
            <p>The following items are now live on MusicWeb:</p>
            <ul style="background: #f4f4f4; padding: 20px; border-radius: 8px; list-style-type: none;">
              ${listItems.replace(/<li>/g, '<li style="margin-bottom: 8px; border-bottom: 1px solid #ddd; padding-bottom: 4px;">✅ ')}
            </ul>
            <p>Best,<br/>The MusicWeb Team</p>
          </div>
        `;
      } else {
        subjectLine = `Submission Received: ${title}`;
        htmlBody = `
          <div style="font-family: sans-serif;">
            <h3>Thanks for your submission!</h3>
            <p>We have received your link for: <strong>${title}</strong></p>
            <p>It is now live in the marketplace.</p>
            <p><a href="${url}" style="color: #9333ea; font-weight: bold;">View Original Listing</a></p>
          </div>
        `;
      }

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'MusicWeb Support <service@musicweb.com>',
          to: ['bob@musicweb.com', email], 
          subject: subjectLine,
          html: htmlBody
        })
      });
    }

    return res.status(200).json({ 
      message: 'SUCCESS',
      scoutedTitle: title 
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return res.status(500).json({ message: error.message });
  }
}
