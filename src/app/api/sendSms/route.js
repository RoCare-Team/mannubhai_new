export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  try {
    const url = `https://api.savshka.co.in/api/sms?${new URLSearchParams({
      key: 'dVHOFwEe',
      from: 'MANNBH', // ✅ Updated sender ID
      to: searchParams.get('to'),
      body: searchParams.get('body'),
      entityid: '1001762193665245675', // ✅ New entity ID
      templateid: '1007963727820356167' // ✅ New template ID
    })}`;

    const response = await fetch(url);
    const result = await response.text();

    return new Response(result, {
      status: response.status,
      headers: {
        'Content-Type': 'text/plain'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to send SMS' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
