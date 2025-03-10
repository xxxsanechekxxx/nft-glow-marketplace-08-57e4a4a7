
import React from "react";
import { ArrowDown } from "lucide-react";

interface EstimatedResultProps {
  estimatedResult: number | null;
  exchangeDirection: 'eth_to_usdt' | 'usdt_to_eth';
}

export const EstimatedResult = ({
  estimatedResult,
  exchangeDirection
}: EstimatedResultProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-2 text-center">
      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-2 border border-purple-500/20">
        <ArrowDown className="h-5 w-5 text-purple-400" />
      </div>
      
      <div className="bg-purple-900/20 rounded-xl p-4 w-full border border-purple-500/10">
        {estimatedResult !== null ? (
          <div className="space-y-1">
            <p className="text-sm text-purple-400">You will receive approximately:</p>
            <p className="text-xl font-semibold text-purple-100">
              {estimatedResult.toFixed(4)} {exchangeDirection === 'eth_to_usdt' ? 'USDT' : 'ETH'}
            </p>
          </div>
        ) : (
          <p className="text-sm text-purple-400">Enter an amount to see conversion</p>
        )}
      </div>
    </div>
  );
};
