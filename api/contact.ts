export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    const { name, email, message } = body;

    // TODO: Add your logic here to send an email or save to database
    console.log("New contact received:", { name, email, message });

    return new Response(JSON.stringify({ success: true, message: "Message sent!" }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error("Error processing contact form:", error);
    return new Response(JSON.stringify({ error: "Failed to send message" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
