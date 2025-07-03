// app/api/bookings/route.js
export const dynamic = 'force-dynamic'; // Disable caching

export async function POST(request) {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    const { user_no, status } = await request.json();
    
    // Forward to external API
    const formData = new URLSearchParams();
    formData.append('user_no', user_no);
    if (status) formData.append('status', status);

    const externalApiResponse = await fetch(
      'https://www.waterpurifierservicecenter.in/customer/app/all_complaints_mb.php',
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      }
    );

    if (!externalApiResponse.ok) {
      throw new Error(`External API error: ${externalApiResponse.status}`);
    }

    const data = await externalApiResponse.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Booking API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch bookings', details: error.message }),
      { status: 500, headers }
    );
  }
}