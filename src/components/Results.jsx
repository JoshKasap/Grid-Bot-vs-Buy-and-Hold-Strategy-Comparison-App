import React, { useState, useEffect } from 'react';

function Results({ results, setIsModalOpen }) {
  const [showModal, setShowModal] = useState(false);
  const [tradePairs, setTradePairs] = useState([]);

  useEffect(() => {
    if (results && results.gridBot && results.gridBot.tradeHistory) {
      const trades = results.gridBot.tradeHistory;
      const pairs = [];

      // Group trades by pairNumber
      const groupedTrades = {};
      trades.forEach(trade => {
        if (!groupedTrades[trade.pairNumber]) {
          groupedTrades[trade.pairNumber] = [];
        }
        groupedTrades[trade.pairNumber].push(trade);
      });

      // Create trade pairs
      for (const pairNumber in groupedTrades) {
        const trades = groupedTrades[pairNumber];
        const buy = trades.find(trade => trade.type === 'Buy');
        const sell = trades.find(trade => trade.type === 'Sell');

        if (buy) {
          pairs.push({
            pairNumber: buy.pairNumber,
            buy: buy,
            sell: sell || null,
            profit: sell ? sell.profit : 'N/A',
            profitExcludingFee: sell ? sell.profitExcludingFee : 'N/A',
          });
        }
      }

      setTradePairs(pairs);
    }
  }, [results]);

  const boxStyles = {
    gridBot: "bg-green-100 p-6 rounded-lg shadow-md",
    buyAndHold: "bg-blue-100 p-6 rounded-lg shadow-md",
  };

  const modalStyles = {
    overlay: "fixed z-10 inset-0",
    container: "flex items-center justify-center min-h-screen px-4",
    background: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity",
    content: "inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-full sm:w-full max-h-[calc(100vh - 60px)] max-w-[calc(100vw - 60px)] overflow-hidden", // Adjusted max-w and max-h
    header: "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4",
    title: "text-lg leading-6 font-medium text-gray-900",
    body: "mt-2",
    list: "list-none m-0 p-0",
    listItem: "py-2 border-b border-gray-200",
    footer: "bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse",
    closeButton: "mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm",
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 8,
      maximumFractionDigits: 8,
    }).format(amount);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowModal(false);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Results</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={boxStyles.gridBot}>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Grid Bot Strategy</h3>
          <p className="text-gray-600 mb-2">Total Profit: <span className="font-medium">{formatCurrency(results.gridBot.totalProfit)}</span></p>
          <p className="text-gray-600 mb-2">Total Investment + Profit: <span className="font-medium">{formatCurrency(results.gridBot.totalInvestmentPlusProfit)}</span></p>
          <p className="text-gray-600 mb-2">Buy Trades: <span className="font-medium">{results.gridBot.buyTrades}</span></p>
          <p className="text-gray-600 mb-2">Sell Trades: <span className="font-medium">{results.gridBot.sellTrades}</span></p>
          <p className="text-gray-600 mb-4">Total Trades: <span className="font-medium">{results.gridBot.totalTrades}</span></p>
          <button onClick={handleOpenModal} className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            View Trade History
          </button>
        </div>

        <div className={boxStyles.buyAndHold}>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Buy and Hold Strategy</h3>
          <p className="text-gray-600 mb-2">Total Profit: <span className="font-medium">{formatCurrency(results.buyAndHold.totalProfit)}</span></p>
          <p className="text-gray-600 mb-2">Total Investment + Profit: <span className="font-medium">{formatCurrency(results.buyAndHold.totalInvestmentPlusProfit)}</span></p>
        </div>
      </div>

      {showModal && (
        <div className={modalStyles.overlay} aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className={modalStyles.container}>
            <div className={modalStyles.background}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className={modalStyles.content}>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Trade History
                </h3>
                <div className="overflow-x-auto" style={{ maxHeight: 'calc(100vh - 180px)' , overflowY: 'auto' }}>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          #/Profit USD
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price USD
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Profit (Excl. Fee) USD
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fee
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tradePairs.map((pair, index) => (
                        <tr key={index} className={`${pair.sell ? 'bg-green-50' : 'bg-gray-100'}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div className={`font-bold ${pair.profit === 'N/A' ? 'text-gray-500' : (parseFloat(pair.profit) >= 0 ? 'text-green-500' : 'text-red-500')}`}>
                                {pair.profit === 'N/A' ? 'N/A' : formatCurrency(pair.profit)}
                              </div>
                              <div className="text-xs text-gray-500">#{pair.pairNumber}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div>Buy: {formatCurrency(pair.buy.price)}</div>
                              <div>Sell: {pair.sell ? formatCurrency(pair.sell.price) : 'N/A'}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {pair.sell ? formatCurrency(pair.sell.profitExcludingFee) : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div>Buy: {formatCurrency(pair.buy.fee)}</div>
                              <div>Sell: {pair.sell ? formatCurrency(pair.sell.fee) : 'N/A'}</div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse sticky bottom-0">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Results;
