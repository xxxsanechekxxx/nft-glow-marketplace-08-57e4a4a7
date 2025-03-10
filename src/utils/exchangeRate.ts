
/**
 * Fetches the current ETH to USD exchange rate from CoinGecko API
 */
export const fetchExchangeRate = async (): Promise<number> => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await response.json();
    if (data && data.ethereum && data.ethereum.usd) {
      return data.ethereum.usd;
    }
    return 2074; // Fallback value if API fails
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 2074; // Default fallback value
  }
};

/**
 * Calculate the reverse exchange rate (USDT to ETH)
 */
export const calculateReverseRate = (rate: number): number => {
  return rate > 0 ? (1 / rate) : 0.000482;
};

/**
 * Calculate estimated result based on input amount, rate and direction
 */
export const calculateEstimatedResult = (
  amount: string, 
  exchangeRate: number, 
  reverseExchangeRate: number, 
  direction: 'eth_to_usdt' | 'usdt_to_eth'
): number | null => {
  if (amount && !isNaN(parseFloat(amount))) {
    const rate = direction === 'eth_to_usdt' ? exchangeRate : reverseExchangeRate;
    return parseFloat(amount) * rate;
  }
  return null;
};
