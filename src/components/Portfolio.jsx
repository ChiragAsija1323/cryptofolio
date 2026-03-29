import React from "react";
import CryptoCard from "./CryptoCard";

function Portfolio({ portfolio, deleteCrypto }) {
  return (
    <div className="portfolio">
      {portfolio.map((crypto, index) => (
        <CryptoCard
          key={index}
          crypto={crypto}
          index={index}
          deleteCrypto={deleteCrypto}
        />
      ))}
    </div>
  );
}

export default Portfolio;
