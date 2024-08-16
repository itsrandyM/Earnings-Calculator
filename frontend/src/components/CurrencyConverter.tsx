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
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});
  const [cacheTimestamp, setCacheTimestamp] = useState<number | null>(null);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      const cacheDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const currentTime = new Date().getTime();

      if (cacheTimestamp && currentTime - cacheTimestamp < cacheDuration) {
        // Use cached rates if within the cache duration
        setExchangeRates(exchangeRates);
      } else {
        try {
          const apiKey = 'cur_live_N2xlPYcorZQICVcf54LkjkrGzS7WsMk3EprATtMM'; 
          const response = await axios.get(
            `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=KES&currencies=USD,EUR,GBP`
          );
          const rates = {
            USD: response.data.data.USD.value,
            EUR: response.data.data.EUR.value,
            GBP: response.data.data.GBP.value,
          };
          setExchangeRates(rates);
          setCacheTimestamp(currentTime); // Update cache timestamp
        } catch (error) {
          console.error('Error fetching exchange rates:', error);
        }
      }
    };

    fetchExchangeRates();
  }, [currency, cacheTimestamp]);

  useEffect(() => {
    if (exchangeRates[currency]) {
      setConvertedAmount(amount * exchangeRates[currency]);
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
      <p>{convertedAmount.toFixed(2)}</p>
      {onCurrencyChange && (
        <select
          value={currency}
          onChange={handleCurrencyChange}
          className="p-1 cursor-pointer border-0"
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
