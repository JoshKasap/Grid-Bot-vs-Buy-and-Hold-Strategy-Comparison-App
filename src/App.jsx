import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import Results from './components/Results';

function App() {
  const [results, setResults] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Prevent scrolling when the modal is open
    if (isModalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup when the component unmounts
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isModalOpen]);

  const calculateStrategies = (inputData) => {
    const {
      targetStartPrice,
      targetEndPrice,
      gridLowerPriceRange,
      gridUpperPriceRange,
      totalGridLevels,
      totalInvestment,
      tradingFees,
      tradingStrategy,
    } = inputData;

    // Buy and Hold Strategy Calculations
    const buyAndHoldProfit = (targetEndPrice - targetStartPrice) * (totalInvestment / targetStartPrice);
    const buyAndHoldTotal = parseFloat(buyAndHoldProfit) + parseFloat(totalInvestment);

    // Grid Bot Calculations
    const gridSize = (gridUpperPriceRange - gridLowerPriceRange) / totalGridLevels;
    const investmentPerGrid = totalInvestment / totalGridLevels;
    const tradingFeesDecimal = tradingFees / 100;

    let gridBotProfit = 0;
    let buyTrades = 0;
    let sellTrades = 0;
    let tradeHistory = [];
    let currentPrice = targetStartPrice;
    let currentGridLevel = Math.ceil((currentPrice - gridLowerPriceRange) / gridSize);
    let direction = 1; // 1 for up, -1 for down
    let totalTrades = 0;
    let pairNumber = 1;
    let openBuyOrders = []; // Array to store open buy orders

    // Simulate Grid Bot Trading until it reaches the Buy and Hold total
    const maxTrades = 1000; // Limit the number of trades to prevent infinite loops
    let tradeCount = 0;

    while (parseFloat(gridBotProfit) + parseFloat(totalInvestment) < buyAndHoldTotal && tradeCount < maxTrades) {
      // Sequential Movement Up and Down
      if (inputData.tradingStrategy === 'Sequential Movement Up and Down') {
        currentGridLevel += direction;

        if (currentGridLevel >= totalGridLevels) {
          currentGridLevel = totalGridLevels - 1;
          direction = -1;
        } else if (currentGridLevel < 0) {
          currentGridLevel = 0;
          direction = 1;
        }
      } else {
        // Random Movement Up or Down
        direction = Math.random() < 0.5 ? -1 : 1;
        currentGridLevel += direction;

        if (currentGridLevel >= totalGridLevels) {
          currentGridLevel = totalGridLevels - 1;
        } else if (currentGridLevel < 0) {
          currentGridLevel = 0;
        }
      }

      currentPrice = gridLowerPriceRange + currentGridLevel * gridSize;
      const targetSellPrice = gridLowerPriceRange + (currentGridLevel + 1) * gridSize;

      // Buy/Sell Logic
      if (tradeCount % 2 === 0) {
        // Buy
        const trade_volume = investmentPerGrid/(gridSize/currentPrice);
        const buyFee = trade_volume * tradingFeesDecimal;
        // gridBotProfit -= currentPrice * investmentPerGrid + buyFee;
        gridBotProfit -= trade_volume + buyFee;

        buyTrades++;

        const buyOrder = {
          pairNumber: pairNumber,
          price: currentPrice.toFixed(8),
          fee: buyFee.toFixed(8),
          volume: trade_volume.toFixed(8),
          targetSellPrice: targetSellPrice.toFixed(8),
        };

        openBuyOrders.push(buyOrder);
        tradeHistory.push({ ...buyOrder, type: 'Buy' }); // Add buy order to trade history
        pairNumber++;
      } else {
        // Sell
        // Find the buy order with the matching target sell price
        const buyOrderIndex = openBuyOrders.findIndex(order => order.targetSellPrice === currentPrice.toFixed(8));

        if (buyOrderIndex !== -1) {
          const buyOrder = openBuyOrders[buyOrderIndex];
          openBuyOrders.splice(buyOrderIndex, 1); // Remove the buy order from the open orders

          const trade_volume = investmentPerGrid/(gridSize/currentPrice);
          const profitExcludingFee = trade_volume - parseFloat(buyOrder.volume); // Calculate profit excluding fee
          const sellFee = trade_volume * tradingFeesDecimal;
          // const profit = currentPrice - parseFloat(buyOrder.price) - buyOrder.fee - sellFee;
          const profit = profitExcludingFee - parseFloat(buyOrder.fee) - sellFee;
          gridBotProfit += profit;
          sellTrades++;

          const sellOrder = {
            pairNumber: buyOrder.pairNumber,
            price: currentPrice.toFixed(8),
            fee: sellFee.toFixed(8),
            volume: trade_volume.toFixed(8),
            profit: profit.toFixed(8),
            profitExcludingFee: profitExcludingFee.toFixed(8), // Add profitExcludingFee
          };

          tradeHistory.push({ ...sellOrder, type: 'Sell' }); // Add sell order to trade history
        } else {
          console.error("No matching buy order found for sell order at price:", currentPrice.toFixed(8));
        }
      }

      totalTrades = buyTrades + sellTrades;
      tradeCount++;
    }

    setResults({
      gridBot: {
        totalProfit: gridBotProfit.toFixed(8),
        totalInvestmentPlusProfit: (parseFloat(gridBotProfit) + parseFloat(totalInvestment)).toFixed(8),
        buyTrades,
        sellTrades,
        totalTrades,
        tradeHistory,
        investmentPerGrid: investmentPerGrid.toFixed(8),
      },
      buyAndHold: {
        totalProfit: buyAndHoldProfit.toFixed(8),
        totalInvestmentPlusProfit: buyAndHoldTotal.toFixed(8),
      },
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Grid Bot vs Buy and Hold
        </h1>
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <InputForm onSubmit={calculateStrategies} />
        </div>
        {results && <Results results={results} setIsModalOpen={setIsModalOpen} />}
      </div>
    </div>
  );
}

export default App;
