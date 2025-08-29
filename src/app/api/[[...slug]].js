
import { GONE_PATHS } from '../../../gonePaths';

export default function handler(req, res) {
  const path = req.url;
  const fullUrl = `https://www.mannubhai.com${path}`;
  
  if (GONE_PATHS.has(fullUrl)) {
    return res.status(410).json({ error: 'Gone' });
  }
  
  // Handle normal requests here
  res.status(404).json({ error: 'Not Found' });
}