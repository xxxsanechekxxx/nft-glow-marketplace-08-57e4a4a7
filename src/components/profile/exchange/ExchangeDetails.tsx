
import React from "react";

interface ExchangeDetailsProps {
  exchangeDirection: 'eth_to_usdt' | 'usdt_to_eth';
  exchangeRate: number;
  reverseExchangeRate: number;
  isLoadingRate: boolean;
  availableBalance: string;
}

export const ExchangeDetails = ({
  exchangeDirection,
  exchangeRate,
  reverseExchangeRate,
  isLoadingRate,
  availableBalance
}: ExchangeDetailsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-500/10">
        <p className="text-xs text-purple-400 mb-1">Exchange Rate</p>
        <div className="flex items-center justify-between">
          <p className="text-sm text-purple-300">
            1 {exchangeDirection === 'eth_to_usdt' ? 'ETH' : 'USDT'} = 
          </p>
          <p className="text-sm text-purple-300 font-medium ml-1">
            {isLoadingRate ? (
              <span className="text-purple-400/70">Loading...</span>
            ) : (
              <>
                {exchangeDirection === 'eth_to_usdt' 
                  ? exchangeRate.toFixed(2) 
                  : reverseExchangeRate.toFixed(6)} {exchangeDirection === 'eth_to_usdt' ? 'USDT' : 'ETH'}
              </>
            )}
          </p>
        </div>
      </div>
      
      <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-500/10">
        <p className="text-xs text-purple-400 mb-1">Available</p>
        <p className="text-sm text-purple-300">{availableBalance}</p>
      </div>
    </div>
  );
};
