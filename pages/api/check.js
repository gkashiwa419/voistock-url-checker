export default async function handler(req, res) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const BASE_URL = "https://material.voistock.com/photo/image.php?id=67ac9bb358473&photo=67ac9bb360a";
  const concurrency = 36; // 並列数を調整（Vercel無料枠でも安定する値）

  const combinations = [];
  for (let i = 0; i < chars.length; i++) {
    for (let j = 0; j < chars.length; j++) {
      combinations.push(chars[i] + chars[j]);
    }
  }

  let found = [];

  async function checkUrl(suffix) {
    const url = BASE_URL + suffix;
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      if (buffer.byteLength > 1000) { // 1000バイト以上の画像なら有効と判断
        found.push(url);
      }
    } catch (e) {
      // 失敗は無視
    }
  }

  // 並列実行（最大 concurrency 並列）
  const chunks = [];
  for (let i = 0; i < combinations.length; i += concurrency) {
    chunks.push(combinations.slice(i, i + concurrency));
  }

  for (const chunk of chunks) {
    await Promise.all(chunk.map(checkUrl));
  }

  res.status(200).json({ validUrls: found });
}
