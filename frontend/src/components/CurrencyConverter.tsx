import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface CurrencyConverterProps {
  amount: number;
  currency: string;
  onCurrencyChange?: (currency: string) => void;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  amount,
  currency,
  onCurrencyChange,
}) => {
  const [convertedAmount, setConvertedAmount] = useState<number>(amount);
  const [exchangeRates, setExchangeRates] = useState<any>({});

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const apiKey = 'cur_live_N2xlPYcorZQICVcf54LkjkrGzS7WsMk3EprATtMM&currencies=EUR%2CUSD%2CGBP'; // Replace with your actual API key
        const response = await axios.get(
          `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=KES`
        );
        setExchangeRates(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  useEffect(() => {
    if (exchangeRates[currency]) {
      setConvertedAmount(amount * exchangeRates[currency].value);
    } else {
      setConvertedAmount(amount);
    }
  }, [amount, currency, exchangeRates]);

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = event.target.value;
    if (onCurrencyChange) {
      onCurrencyChange(newCurrency);
    }
  };

  return (
    <div className="flex flex-row items-center">
      <p>
        {convertedAmount.toFixed(2)} 
      </p>
      {onCurrencyChange && (
        <select
          value={currency}
          onChange={handleCurrencyChange}
          className="p-1"
        >
          <option value="KES">KES</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      )}
    </div>
  );
};

export default CurrencyConverter;
