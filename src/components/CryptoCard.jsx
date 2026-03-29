import React, { useEffect, useState, useMemo } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler);

// ─── Lock-in helper ─────────────────────────────────────────────────────────
function getLockStatus(lockInDays, buyDate) {
  if (!lockInDays || !buyDate) return null;
  const daysPassed = Math.floor(
    (new Date() - new Date(buyDate)) / (1000 * 60 * 60 * 24)
  );
  const remaining = lockInDays - daysPassed;
  const progress = Math.min(100, Math.round((daysPassed / lockInDays) * 100));
  return {
    isLocked: remaining > 0,
    remaining: Math.max(0, remaining),
    progress,
    daysPassed: Math.min(daysPassed, lockInDays),
  };
}

// ─── LockProgress bar ────────────────────────────────────────────────────────
function LockProgressBar({ progress, isLocked }) {
  return (
    <div className="lock-progress-wrap">
      <div className="lock-progress-bg">
        <div
          className={"lock-progress-fill " + (isLocked ? "lock-progress-active" : "lock-progress-done")}
          style={{ width: progress + "%" }}
        />
      </div>
      <span className="lock-progress-label">{progress}% completed</span>
    </div>
  );
}

function CryptoCard({ crypto, index, deleteCrypto, updateLivePrice }) {
  const { name, image, quantity, buyPrice, lockInDays, buyDate, isSimulation } = crypto;

  const [chartData, setChartData] = useState([]);
  const [livePrice, setLivePrice] = useState(crypto.currentPrice || 0);

  const totalInvestment = quantity * buyPrice;
  const currentValue = quantity * livePrice;
  const profitLoss = currentValue - totalInvestment;
  const profitPercent = buyPrice > 0 ? ((livePrice - buyPrice) / buyPrice) * 100 : 0;

  let signal = "HOLD";
  let signalColor = "#facc15";
  if (profitPercent > 10) { signal = "SELL"; signalColor = "#dc2626"; }
  else if (profitPercent < -10) { signal = "BUY"; signalColor = "#16a34a"; }

  const lockStatus = useMemo(() => getLockStatus(lockInDays, buyDate), [lockInDays, buyDate]);

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      try {
        if (!navigator.onLine) return;
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${name}?sparkline=true&localization=false`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!ignore) {
          const inrPrice = data?.market_data?.current_price?.inr;
          const usdPrice = data?.market_data?.current_price?.usd;
          if (inrPrice) {
            setLivePrice(inrPrice);
            if (updateLivePrice) updateLivePrice(index, inrPrice);
          }
          const sparkline = data?.market_data?.sparkline_7d?.price;
          if (sparkline && usdPrice && inrPrice) {
            const rate = inrPrice / usdPrice;
            setChartData(sparkline.map((p) => p * rate));
          }
        }
      } catch { console.log("Safe fetch fail"); }
    };
    const timeout = setTimeout(fetchData, 400 * index);
    return () => { ignore = true; clearTimeout(timeout); };
  }, [name, index, updateLivePrice]);

  const chartConfig = {
    labels: chartData.map((_, i) => i + 1),
    datasets: [{
      data: chartData,
      borderColor: profitLoss >= 0 ? "#16a34a" : "#dc2626",
      backgroundColor: profitLoss >= 0 ? "rgba(22,163,74,0.15)" : "rgba(220,38,38,0.15)",
      fill: true, tension: 0.4, pointRadius: 0, pointHoverRadius: 5,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => "₹ " + Number(ctx.parsed.y).toLocaleString("en-IN"),
        },
      },
    },
    scales: {
      x: { display: false },
      y: {
        ticks: { callback: (v) => "₹ " + Number(v).toLocaleString("en-IN") },
      },
    },
  };

  return (
    <div className={"card" + (isSimulation ? " card-sim" : "")}>
      {/* BADGES */}
      <div className="card-badges">
        {isSimulation && <span className="badge badge-sim">🧪 Simulation</span>}
        {lockStatus && lockStatus.isLocked && (
          <span className="badge badge-locked">🔒 Locked</span>
        )}
        {lockStatus && !lockStatus.isLocked && lockInDays && (
          <span className="badge badge-unlocked">✅ Unlocked</span>
        )}
      </div>

      {/* DELETE BUTTON */}
      <button
        className={"delete-btn" + (lockStatus?.isLocked ? " delete-btn-disabled" : "")}
        onClick={() => deleteCrypto(index)}
        title={lockStatus?.isLocked ? `Locked for ${lockStatus.remaining} more days` : "Remove asset"}
        disabled={lockStatus?.isLocked}
      >
        {lockStatus?.isLocked ? "🔒" : "×"}
      </button>

      <div style={{
        display: "grid",
        gridTemplateColumns: "320px 1fr",
        gap: "40px",
        alignItems: "center",
      }}>
        {/* LEFT */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {image && <img src={image} alt="" width="36" style={{ borderRadius: "50%" }} />}
            <h3 style={{ margin: 0 }}>{name.toUpperCase()}</h3>
          </div>

          <p>Quantity: {quantity}</p>
          <p>Buy Price: ₹ {buyPrice.toLocaleString("en-IN")}</p>
          <p>Live Price: ₹ {livePrice.toLocaleString("en-IN")}</p>

          <p style={{
            color: profitLoss >= 0 ? "#16a34a" : "#dc2626",
            fontWeight: "bold",
            fontSize: "18px",
          }}>
            Profit/Loss: ₹ {profitLoss.toLocaleString("en-IN")}
          </p>

          <p>Profit %: {profitPercent.toFixed(2)}%</p>

          <p style={{ color: signalColor, fontWeight: "bold" }}>
            AI Signal: {signal}
          </p>

          {/* LOCK-IN STATUS */}
          {lockStatus && (
            <div className="lockin-status">
              {lockStatus.isLocked ? (
                <>
                  <p className="lockin-msg lockin-active">
                    🔒 Locked for <strong>{lockStatus.remaining}</strong> more day{lockStatus.remaining !== 1 ? "s" : ""}
                  </p>
                  <LockProgressBar progress={lockStatus.progress} isLocked={true} />
                </>
              ) : (
                <>
                  <p className="lockin-msg lockin-done">✅ Lock-in completed</p>
                  <LockProgressBar progress={100} isLocked={false} />
                </>
              )}
            </div>
          )}
        </div>

        {/* RIGHT — sparkline */}
        <div style={{ height: "350px", width: "100%" }}>
          {chartData.length > 0 ? (
            <Line data={chartConfig} options={chartOptions} />
          ) : (
            <p style={{ opacity: 0.5 }}>Loading chart...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CryptoCard;
