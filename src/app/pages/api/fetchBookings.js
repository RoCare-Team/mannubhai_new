export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { user_no } = req.body;
    if (!user_no) {
      return res.status(400).json({ message: 'User phone number is required' });
    }

    const response = await fetch(
      'https://waterpurifierservicecenter.in/customer/ro_customer/all_complaints.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_no }),
      }
    );
 console.log('mobile api -----------',response);
 
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Booking fetch error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch bookings',
      error: error.message 
    });
  }
}