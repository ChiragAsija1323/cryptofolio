import React, { useEffect, useState } from "react";

function AddCrypto({ addCrypto, mode, virtualBalance }) {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [lockInDays, setLockInDays] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const isSimulation = mode === "simulation";

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr")
      .then((res) => res.json())
      .then((data) => setCoins(data.slice(0, 50)))
      .catch(() => console.log("Coin list fetch failed"));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCoin || quantity <= 0 || buyPrice <= 0) return;

    const coinData = coins.find((coin) => coin.id === selectedCoin);
    if (!coinData) return;

    const estimatedCost = Number(quantity) * coinData.current_price;

    if (isSimulation && estimatedCost > virtualBalance) {
      alert(
        `Insufficient virtual balance!\nRequired: ₹${estimatedCost.toLocaleString("en-IN")}\nAvailable: ₹${virtualBalance.toLocaleString("en-IN")}`
      );
      return;
    }

    addCrypto({
      name: coinData.id,
      image: coinData.image,
      quantity: Number(quantity),
      buyPrice: Number(buyPrice),
      currentPrice: coinData.current_price,
      buyDate: new Date().toISOString(),
      lockInDays: lockInDays ? Number(lockInDays) : null,
      isSimulation,
    });

    setQuantity("");
    setBuyPrice("");
    setLockInDays("");
    setSelectedCoin("");
  };

  const selectedCoinData = coins.find((c) => c.id === selectedCoin);
  const estimatedCost = selectedCoinData && quantity > 0
    ? Number(quantity) * selectedCoinData.current_price
    : null;
  const insufficientBalance = isSimulation && estimatedCost !== null && estimatedCost > virtualBalance;

  return (
    <div className="add-crypto-wrapper">
      {isSimulation && (
        <div className="sim-form-label">
          🧪 Adding to Simulation Portfolio
        </div>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <select
          value={selectedCoin}
          onChange={(e) => setSelectedCoin(e.target.value)}
        >
          <option value="">Select Coin</option>
          {coins.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="0"
          step="any"
        />

        <input
          type="number"
          placeholder="Buy Price (INR)"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          min="0"
          step="any"
        />

        <button
          type="button"
          className="ctrl-btn"
          style={{ whiteSpace: "nowrap", fontSize: "13px" }}
          onClick={() => setShowAdvanced((v) => !v)}
        >
          {showAdvanced ? "▲ Less" : "🔒 Lock-in"}
        </button>

        <button
          type="submit"
          disabled={insufficientBalance}
          style={{ opacity: insufficientBalance ? 0.5 : 1 }}
        >
          {isSimulation ? "🧪 Buy (Sim)" : "Add Asset"}
        </button>
      </form>

      {/* ADVANCED: Lock-in period */}
      {showAdvanced && (
        <div className="lockin-row">
          <label style={{ opacity: 0.7, fontSize: "14px" }}>
            🔒 Lock-in Period (days, optional)
          </label>
          <input
            type="number"
            className="lockin-input"
            placeholder="e.g. 30"
            value={lockInDays}
            onChange={(e) => setLockInDays(e.target.value)}
            min="1"
          />
          <span style={{ opacity: 0.5, fontSize: "12px" }}>
            Asset cannot be deleted before this period expires.
          </span>
        </div>
      )}

      {/* COST PREVIEW */}
      {estimatedCost !== null && (
        <div className={"cost-preview" + (insufficientBalance ? " cost-danger" : "")}>
          {insufficientBalance ? "❌ " : "💸 "}
          Estimated cost:{" "}
          <strong>₹{estimatedCost.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong>
          {isSimulation && (
            <span style={{ marginLeft: "10px", opacity: 0.7 }}>
              | Remaining: ₹
              {Math.max(0, virtualBalance - estimatedCost).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default AddCrypto;
