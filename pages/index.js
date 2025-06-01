import React, { useState } from "react";

export default function Home() {
  const [validUrls, setValidUrls] = useState([]);
  const [checking, setChecking] = useState(false);

  const checkUrls = async () => {
    setChecking(true);
    setValidUrls([]);
    const res = await fetch("/api/check");
    const data = await res.json();
    setValidUrls(data.validUrls);
    setChecking(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <h1>VoiStock画像チェッカー</h1>
      <button onClick={checkUrls} disabled={checking} style={{ margin: "1rem 0", padding: "0.5rem 1rem" }}>
        {checking ? "チェック中..." : "チェック開始"}
      </button>
      {validUrls.length > 0 && (
        <div>
          <h2>見つかった画像URL：</h2>
          <ul>
            {validUrls.map((url) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                <br />
                <img src={url} alt="" style={{maxWidth: '300px', margin: '10px 0'}} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
