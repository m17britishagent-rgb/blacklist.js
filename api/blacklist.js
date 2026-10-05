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
    const json = await response.json();

    // If Google returned { success: true, data: { ... } }
    if (json.success && json.data) {
      return res.status(200).json({
        found: true,
        user: json.data.user || "N/A",
        reason: json.data.reason || "N/A",
        status: json.data.status || "N/A",
        dateIssued: json.data.dateIssued || "N/A",
        appealStatus: json.data.appealStatus || "N/A",
        ableToAppeal: json.data.ableToAppeal || "N/A",
        dateAppealed: json.data.dateAppealed || "N/A",
        admin: json.data.admin || "N/A"
      });
    }

    // If Google returned found: true directly
    if (json.found) {
      return res.status(200).json(json);
    }

    // Default: User not found
    return res.status(200).json({
      found: false,
      message: "User not found on blacklist."
    });

  } catch (error) {
    return res.status(500).json({ 
      found: false, 
      error: 'Failed to communicate with Google Apps Script endpoint',
      details: error.message 
    });
  }
};
