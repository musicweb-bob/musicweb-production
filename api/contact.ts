export default async function handler(req: any, res: any) {
  // 1. Check for POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // 2. Extract data exactly how your working file does
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    // 3. Send email using native fetch, exactly like submit_listing.ts
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer re_5adX9Dyq_3vFK5bdV3CvWUambg7n1PFZ4`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'MusicWeb Support <service@musicweb.com>', // Using your verified sender
        to: ['bob@musicweb.com'], 
        reply_to: email,
        subject: `New Contact Form Message from ${name}`,
        html: `
          <div style="font-family: sans-serif;">
            <h3>New Message from ${name}</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
              ${message}
            </div>
          </div>
        `
      })
    });

    if (!response.ok) {
       const errorText = await response.text();
       console.error("Resend API Error:", errorText);
       return res.status(500).json({ message: 'Resend API rejected the email' });
    }

    // 4. Return the exact success format your frontend needs
    return res.status(200).json({ success: true, message: 'SUCCESS' });
    
  } catch (error: any) {
    console.error("API Error:", error);
    return res.status(500).json({ message: error.message });
  }
}
