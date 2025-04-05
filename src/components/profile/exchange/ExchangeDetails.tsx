
import React from "react";
import { Loader2, Info, Wallet } from "lucide-react";

interface ExchangeDetailsProps {
  exchangeDirection: 'eth_to_usdt' | 'usdt_to_eth';
  exchangeRate: number | null;
  reverseExchangeRate: number | null;
  isLoadingRate: boolean;
  availableBalance: string; // Changed from number to string to match the actual usage
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
  return (
    <div className={`space-y-3 p-4 rounded-lg bg-${accentColor}-500/5 border border-${accentColor}-500/10`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-full bg-${accentColor}-500/20`}>
            <Info className={`h-3.5 w-3.5 text-${accentColor}-400`} />
          </div>
          <span className="text-xs text-white/70">Exchange Rate</span>
        </div>
        
        {isLoadingRate ? (
          <div className="flex items-center gap-1.5">
            <Loader2 className="h-3 w-3 animate-spin text-white/60" />
            <span className="text-xs text-white/60">Loading...</span>
          </div>
        ) : (
          <span className={`text-xs font-medium text-${accentColor}-300`}>
            {exchangeDirection === 'eth_to_usdt' 
              ? `1 ETH ≈ ${exchangeRate?.toFixed(2)} USDT` 
              : `1 USDT ≈ ${reverseExchangeRate?.toFixed(6)} ETH`
            }
          </span>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-full bg-${accentColor}-500/20`}>
            <Wallet className={`h-3.5 w-3.5 text-${accentColor}-400`} />
          </div>
          <span className="text-xs text-white/70">Available Balance</span>
        </div>
        
        <span className={`text-xs font-medium text-${accentColor}-300`}>
          {availableBalance}
        </span>
      </div>
    </div>
  );
};
