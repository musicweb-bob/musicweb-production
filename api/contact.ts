import { Resend } from 'resend';

// Initialize Resend with your active API Key
const resend = new Resend('re_5adX9Dyq_3vFK5bdV3CvWUambg7n1PFZ4'); 

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    const { name, email, message } = body;

    // Send the email using Resend
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', 
      to: 'bob@musicweb.com',        
      reply_to: email,               
      subject: `New Contact Form Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error("Error sending email via Resend:", error);
    return new Response(JSON.stringify({ error: "Failed to send message" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
