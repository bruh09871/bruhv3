export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code } = req.body;

  if (code === process.env.ACCESS_CODE) {
    return res.status(200).json({ access: true });
  }

  return res.status(200).json({ access: false });
}
