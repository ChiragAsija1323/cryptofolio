import React, { useEffect, useState } from "react";

function MarketTicker() {
  const [coins, setCoins] = useState([]);

  const coinIds =
    "bitcoin,ethereum,solana,binancecoin,ripple,cardano,dogecoin,tron,polkadot,polygon";

  useEffect(() => {
    let ignore = false;

    const fetchPrices = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=inr&include_24hr_change=true`
        );

        const data = await res.json();

        if (!ignore) {
          const formatted = Object.keys(data).map((key) => ({
            name: key.toUpperCase(),
            price: data[key].inr,
            change: data[key].inr_24h_change,
          }));

          setCoins(formatted);
        }
      } catch (err) {
        console.log("Ticker fetch failed");
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 15000);

    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      style={{
        background: "#111",
        color: "white",
        overflow: "hidden",
        whiteSpace: "nowrap",
        padding: "10px 0",
        borderBottom: "1px solid #222",
      }}
    >
      <div
        style={{
          display: "inline-block",
          animation: "scroll 25s linear infinite",
        }}
      >
        {coins.map((coin, index) => (
          <span key={index} style={{ marginRight: "50px" }}>
            {coin.name} ₹ {coin.price?.toLocaleString("en-IN")}{" "}
            <span
              style={{
                color: coin.change >= 0 ? "#16a34a" : "#dc2626",
                fontWeight: "bold",
              }}
            >
              {coin.change >= 0 ? "▲" : "▼"}{" "}
              {coin.change?.toFixed(2)}%
            </span>
          </span>
        ))}

        {/* duplicate for infinite smooth loop */}
        {coins.map((coin, index) => (
          <span key={`dup-${index}`} style={{ marginRight: "50px" }}>
            {coin.name} ₹ {coin.price?.toLocaleString("en-IN")}{" "}
            <span
              style={{
                color: coin.change >= 0 ? "#16a34a" : "#dc2626",
                fontWeight: "bold",
              }}
            >
              {coin.change >= 0 ? "▲" : "▼"}{" "}
              {coin.change?.toFixed(2)}%
            </span>
          </span>
        ))}
      </div>

      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
    </div>
  );
}

export default MarketTicker;