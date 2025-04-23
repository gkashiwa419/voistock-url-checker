import React, { useState } from "react";

export default function Home() {
  const [validUrls, setValidUrls] = useState([]);
  const [checking, setChecking] = useState(false);
  const [progress, setProgress] = useState(0);

  const BASE_URL = "https://material.voistock.com/photo/image.php?id=67ac9bb358473&photo=67ac9bb360a";
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const allCombos = Array.from({ length: chars.length ** 2 }, (_, i) =>
    chars[Math.floor(i / chars.length)] + chars[i % chars.length]
  );

  const checkUrls = async () => {
    setChecking(true);
    const found = [];
    for (let i = 0; i < allCombos.length; i++) {
      const suffix = allCombos[i];
      const url = BASE_URL + suffix;
      try {
        const res = await fetch(url, { method: "HEAD" });
        if (res.ok) {
          found.push(url);
          setValidUrls([...found]);
        }
      } catch (err) {
        // Ignore
      }
      setProgress(Math.round(((i + 1) / allCombos.length) * 100));
    }
    setChecking(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <h1>VoiStock リンクチェッカー</h1>
      <p>
        「XX」部分の全英数字2文字組み合わせを総当たりでチェックします。
        <br />
        <button onClick={checkUrls} disabled={checking} style={{ margin: "1rem 0", padding: "0.5rem 1rem" }}>
          {checking ? `チェック中... (${progress}%)` : "チェック開始"}
        </button>
      </p>
      {validUrls.length > 0 && (
        <div>
          <h2>見つかったURL：</h2>
          <ul>
            {validUrls.map((url) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
