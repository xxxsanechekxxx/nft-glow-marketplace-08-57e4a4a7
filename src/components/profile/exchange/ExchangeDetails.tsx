
import React from "react";
import { Loader2, Info, Wallet } from "lucide-react";

interface ExchangeDetailsProps {
  exchangeDirection: 'eth_to_usdt' | 'usdt_to_eth';
  exchangeRate: number | null;
  reverseExchangeRate: number | null;
  isLoadingRate: boolean;
  availableBalance: string;
  accentColor?: string;
}

export const ExchangeDetails = ({
  exchangeDirection,
  exchangeRate,
  reverseExchangeRate,
  isLoadingRate,
  availableBalance,
  accentColor = 'purple'
}: ExchangeDetailsProps) => {
  const getBackgroundGradient = () => {
    return accentColor === 'amber'
      ? 'bg-gradient-to-br from-black/60 to-amber-950/60'
      : 'bg-gradient-to-br from-black/60 to-purple-950/60';
  };

  return (
    <div className={`space-y-3 p-4 rounded-lg ${getBackgroundGradient()} border border-${accentColor}-500/30 shadow-inner`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-full bg-${accentColor}-500/40 shadow-inner`}>
            <Info className={`h-3.5 w-3.5 text-${accentColor}-300`} />
          </div>
          <span className="text-sm text-white/90 font-medium">Exchange Rate</span>
        </div>
        
        {isLoadingRate ? (
          <div className="flex items-center gap-1.5">
            <Loader2 className={`h-3.5 w-3.5 animate-spin text-${accentColor}-300`} />
            <span className={`text-sm text-${accentColor}-300`}>Loading...</span>
          </div>
        ) : (
          <span className={`text-sm font-medium text-${accentColor}-200`}>
            {exchangeDirection === 'eth_to_usdt' 
              ? `1 ETH ≈ ${exchangeRate?.toFixed(2)} USDT` 
              : `1 USDT ≈ ${reverseExchangeRate?.toFixed(6)} ETH`
            }
          </span>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-full bg-${accentColor}-500/40 shadow-inner`}>
            <Wallet className={`h-3.5 w-3.5 text-${accentColor}-300`} />
          </div>
          <span className="text-sm text-white/90 font-medium">Available Balance</span>
        </div>
        
        <span className={`text-sm font-medium text-${accentColor}-200 px-2 py-1 rounded-md bg-${accentColor}-500/20 border border-${accentColor}-500/30`}>
          {availableBalance}
        </span>
      </div>
    </div>
  );
};
