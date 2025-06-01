export default async function handler(req, res) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const BASE_URL = "https://material.voistock.com/photo/image.php?id=67ac9bb358473&photo=67ac9bb360a";
  let found = [];

  for (let i = 0; i < chars.length ** 2; i++) {
    const suffix = chars[Math.floor(i / chars.length)] + chars[i % chars.length];
    const url = BASE_URL + suffix;
    try {
      const response = await fetch(url, { method: "GET" }); // ← HEAD → GET に変更
      if (response.ok && response.headers.get("content-type")?.startsWith("image/")) {
        found.push(url);
      }
    } catch (e) { }
  }

  res.status(200).json({ validUrls: found });
}
