// pages/api/get-app-link.js or app/api/get-app-link/route.js

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { lead_id } = req.query;

    if (!lead_id) {
      return res.status(400).json({ 
        error: true, 
        message: 'Missing lead_id parameter' 
      });
    }

    // Get dynamic app link based on lead_id
    const appLink = await getDynamicAppLink(lead_id);
    
    return res.status(200).json({ 
      error: false,
      app_link: appLink,
      lead_id: lead_id
    });

  } catch (error) {
    console.error('App Link API Error:', error);
    return res.status(500).json({ 
      error: true, 
      message: 'Internal server error' 
    });
  }
}

async function getDynamicAppLink(leadId) {
  try {
    // Method 1: Check if it's a franchise lead and get custom app link
    const isFranchiseLead = await checkFranchiseLead(leadId);
    
    if (isFranchiseLead) {
      // Get franchise-specific app link
      const franchiseAppLink = await getFranchiseAppLink(leadId);
      if (franchiseAppLink) {
        return franchiseAppLink;
      }
    }

    // Method 2: Get app link based on service engineer or area
    const serviceBasedLink = await getServiceBasedAppLink(leadId);
    if (serviceBasedLink) {
      return serviceBasedLink;
    }

    // Method 3: Get app link based on lead category or type
    const categoryBasedLink = await getCategoryBasedAppLink(leadId);
    if (categoryBasedLink) {
      return categoryBasedLink;
    }

    // Default fallback
    return 'https://www.mannubhai.com';

  } catch (error) {
    console.error('Error getting dynamic app link:', error);
    return 'https://www.mannubhai.com'; // Fallback
  }
}

// Database helper functions
async function checkFranchiseLead(leadId) {
  // Simulate database query
  // SELECT * FROM lead_full_details WHERE franchise_lead=1 AND lead_id=?
  console.log('Checking franchise lead for app link:', leadId);
  return Math.random() > 0.5; // Random simulation
}

async function getFranchiseAppLink(leadId) {
  // Get franchise-specific app link
  // This could be from users table or franchise_settings table
  console.log('Getting franchise app link for:', leadId);
  
  // Simulate getting franchise app link
  const franchiseLinks = [
    'https://play.google.com/store/apps/details?id=com.franchise1',
    'https://apps.apple.com/app/franchise-app-1',
    'https://www.franchise-portal.com/app'
  ];
  
  // Return random franchise link for simulation
  return Math.random() > 0.5 ? franchiseLinks[Math.floor(Math.random() * franchiseLinks.length)] : null;
}

async function getServiceBasedAppLink(leadId) {
  // Get app link based on service engineer or area
  console.log('Getting service-based app link for:', leadId);

  
  const serviceLinks = [
    'https://play.google.com/store/apps/details?id=com.rocare',
    'https://apps.apple.com/app/water-service-pro',
    'https://www.serviceapp.com/download'
  ];
  
  return Math.random() > 0.7 ? serviceLinks[Math.floor(Math.random() * serviceLinks.length)] : null;
}

async function getCategoryBasedAppLink(leadId) {
  // Get app link based on lead category, product type, or location
  console.log('Getting category-based app link for:', leadId);
  

  const categoryLinks = [
    'https://play.google.com/store/apps/details?id=com.watercare',
    'https://apps.apple.com/app/aqua-service',
    'https://www.mannubhai.com/mobile-app'
  ];
  
  return Math.random() > 0.8 ? categoryLinks[Math.floor(Math.random() * categoryLinks.length)] : null;
}
