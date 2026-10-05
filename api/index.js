export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ found: false, error: "Missing username parameter" });
  }

  // Your new Google Apps Script Web App URL for User Blacklists
  const gasUrl = `https://script.google.com/macros/s/AKfycbxz2J3X2TBX80dX-zzLy9vGBp6P9yuP4Ktq7qY852Jj2ICccLAElSWaKu_Z11QpNQcZDw/exec?username=${encodeURIComponent(username)}`;

  try {
    const response = await fetch(gasUrl);
    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ found: false, error: err.message });
  }
}
