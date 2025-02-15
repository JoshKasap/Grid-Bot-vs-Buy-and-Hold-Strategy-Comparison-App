import React, { useState } from 'react';

function InputForm({ onSubmit }) {
  const [inputData, setInputData] = useState({
    targetStartPrice: 90,
    targetEndPrice: 110,
    gridLowerPriceRange: 90,
    gridUpperPriceRange: 110,
    totalGridLevels: 10,
    totalInvestment: 1000,
    tradingFees: 0.5,
    tradingStrategy: 'Sequential Movement Up and Down',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    if (name === 'tradingFees') {
      // Parse as a percentage and convert to decimal
      const percentageValue = parseFloat(value);
      parsedValue = percentageValue / 100;
    } else {
      parsedValue = parseFloat(value);
    }

    setInputData(prevState => ({
      ...prevState,
      [name]: isNaN(parsedValue) ? value : parsedValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(inputData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="mb-4">
        <label htmlFor="targetStartPrice" className="block text-gray-700 text-sm font-bold mb-2">
          Target Start Price:
        </label>
        <input
          type="number"
          id="targetStartPrice"
          name="targetStartPrice"
          value={inputData.targetStartPrice}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="targetEndPrice" className="block text-gray-700 text-sm font-bold mb-2">
          Target End Price:
        </label>
        <input
          type="number"
          id="targetEndPrice"
          name="targetEndPrice"
          value={inputData.targetEndPrice}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="gridLowerPriceRange" className="block text-gray-700 text-sm font-bold mb-2">
          Grid Lower Price Range:
        </label>
        <input
          type="number"
          id="gridLowerPriceRange"
          name="gridLowerPriceRange"
          value={inputData.gridLowerPriceRange}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="gridUpperPriceRange" className="block text-gray-700 text-sm font-bold mb-2">
          Grid Upper Price Range:
        </label>
        <input
          type="number"
          id="gridUpperPriceRange"
          name="gridUpperPriceRange"
          value={inputData.gridUpperPriceRange}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="totalGridLevels" className="block text-gray-700 text-sm font-bold mb-2">
          Total Grid Levels:
        </label>
        <input
          type="number"
          id="totalGridLevels"
          name="totalGridLevels"
          value={inputData.totalGridLevels}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="totalInvestment" className="block text-gray-700 text-sm font-bold mb-2">
          Total Investment:
        </label>
        <input
          type="number"
          id="totalInvestment"
          name="totalInvestment"
          value={inputData.totalInvestment}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="tradingFees" className="block text-gray-700 text-sm font-bold mb-2">
          Trading Fees (%):
        </label>
        <input
          type="number"
          id="tradingFees"
          name="tradingFees"
          value={inputData.tradingFees * 100}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="tradingStrategy" className="block text-gray-700 text-sm font-bold mb-2">
          Trading Strategy:
        </label>
        <select
          id="tradingStrategy"
          name="tradingStrategy"
          value={inputData.tradingStrategy}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option>Sequential Movement Up and Down</option>
          <option>Random Movement Up or Down</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <button type="submit" className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
          Calculate
        </button>
      </div>
    </form>
  );
}

export default InputForm;
