module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ 
      found: false, 
      error: 'Missing required query parameter: username' 
    });
  }

  const googleScriptUrl = `https://script.google.com/macros/s/AKfycbyGlMyPne_lLboKzRMYx0hUnxBkWy1PyzXk5uZ0D8Xx1hcksDeWaV48kF51NQpOxXRVyQ/exec?username=${encodeURIComponent(username)}`;

  try {
    const response = await fetch(googleScriptUrl, { redirect: 'follow' });
    const text = await response.text();

    // Check if response is HTML instead of JSON
    if (text.trim().startsWith('<')) {
      return res.status(400).json({
        found: false,
        error: 'Google Apps Script returned HTML instead of JSON. Ensure deployment access is set to "Anyone" and "Execute as: Me".'
      });
    }

    const data = JSON.parse(text);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ 
      found: false, 
      error: 'Failed to communicate with Google Apps Script endpoint',
      details: error.message 
    });
  }
};
