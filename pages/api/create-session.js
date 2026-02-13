export default async function handler(req, res) {
  try {
    const response = await fetch("https://engine.hyperbeam.com/v0/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HYPERBEAM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ region: "iad" }),
    });

    const data = await response.json();

    if (!data.embed_url) {
      return res.status(500).json({ error: "Failed to create session" });
    }

    res.status(200).json({ embed_url: data.embed_url });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
