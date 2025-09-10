export async function POST(request) {
  try {
    const body = await request.json();
    const { lead_id, reason, comment } = body;

    // Validate required fields
    if (!lead_id || !reason) {
      return Response.json({
        success: false,
        error: 'Lead ID and reason are required'
      }, { status: 400 });
    }

    // Prepare form data for the PHP API
    const formData = new FormData();
    formData.append('lead_id', lead_id.toString());
    formData.append('reason', reason);
    formData.append('comment', comment || '');
    formData.append('source', 'mannubhai_website');

    const response = await fetch('https://waterpurifierservicecenter.in/customer/app/cancel_complaint_mb.php', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
        
    // Check if cancellation was successful based on API response
    if (data.error === false || data.success === true || data.status === 'success') {
      return Response.json({
        success: true,
        message: data.message || 'Booking cancelled successfully',
        data: data
      });
    } else {
      return Response.json({
        success: false,
        error: data.message || data.error || 'Failed to cancel booking'
      }, { status: 400 });
    }
   
  } catch (error) {
    console.error('Error cancelling booking:', error);
        
    return Response.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}