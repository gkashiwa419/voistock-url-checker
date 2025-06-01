export default async function handler(req, res) {
  const digits = ['358', '359', '360', '361', '362', '363'];
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const BASE_URL = "https://material.voistock.com/photo/image.php?id=67ac9bb358473&photo=67ac9bb35";
  const concurrency = 50; // 並列実行数（Vercel無料枠でも安定稼働）
  const sizeThreshold = 1000; // 画像サイズ判定閾値

  const combinations = [];

  // 先に全組み合わせを生成
  for (let prefix of digits) {
    for (let i = 0; i < chars.length; i++) {
      for (let j = 0; j < chars.length; j++) {
        for (let k = 0; k < chars.length; k++) {
          const suffix = prefix + chars[i] + chars[j] + chars[k];
          combinations.push(suffix);
        }
      }
    }
  }

  let found = [];

  // 1件のURL確認処理
  async function checkUrl(suffix) {
    const url = `${BASE_URL}${suffix}`;
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      if (buffer.byteLength > sizeThreshold) {
        found.push(url);
      }
    } catch (e) {}
  }

  // 並列実行管理
  const chunks = [];
  for (let i = 0; i < combinations.length; i += concurrency) {
    chunks.push(combinations.slice(i, i + concurrency));
  }

  for (const chunk of chunks) {
    await Promise.all(chunk.map(checkUrl));
  }

  res.status(200).json({ validUrls: found });
}
