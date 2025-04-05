
import React from "react";
import { ArrowDownIcon } from "lucide-react";

interface EstimatedResultProps {
  estimatedResult: number | null;
  exchangeDirection: 'eth_to_usdt' | 'usdt_to_eth';
  accentColor?: string;
}

export const EstimatedResult = ({
  estimatedResult,
  exchangeDirection,
  accentColor = 'purple'
}: EstimatedResultProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className={`h-8 w-8 rounded-full bg-${accentColor}-500/20 flex items-center justify-center mb-2`}>
        <ArrowDownIcon className={`h-4 w-4 text-${accentColor}-400`} />
      </div>
      
      <div className={`w-full p-4 rounded-lg bg-${accentColor}-500/10 border border-${accentColor}-500/20 flex items-center justify-between shadow-inner`}>
        <div className="flex items-center gap-2">
          {exchangeDirection === 'eth_to_usdt' ? (
            <div className="h-6 w-6 flex items-center justify-center bg-usdt rounded-full text-white font-bold text-xs">
              $
            </div>
          ) : (
            <img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="ETH" className="h-6 w-6" />
          )}
          <span className="text-sm text-white/70">You'll receive</span>
        </div>
        
        <div className="flex items-center gap-1">
          <span className={`text-lg font-bold text-${accentColor === 'purple' ? 'indigo' : 'yellow'}-300`}>
            {estimatedResult ? parseFloat(estimatedResult.toFixed(6)) : '0.00'}
          </span>
          <span className="text-xs text-white/60 mt-1">
            {exchangeDirection === 'eth_to_usdt' ? 'USDT' : 'ETH'}
          </span>
        </div>
      </div>
    </div>
  );
};
