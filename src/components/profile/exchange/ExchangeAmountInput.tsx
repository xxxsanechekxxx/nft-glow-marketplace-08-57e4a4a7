
import React from "react";
import { DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExchangeAmountInputProps {
  exchangeAmount: string;
  exchangeDirection: 'eth_to_usdt' | 'usdt_to_eth';
  setExchangeAmount: (value: string) => void;
  accentColor?: string;
}

export const ExchangeAmountInput = ({
  exchangeAmount,
  exchangeDirection,
  setExchangeAmount,
  accentColor = 'purple'
}: ExchangeAmountInputProps) => {
  // Get the appropriate input styling based on the accent color
  const getInputClass = () => {
    const baseClasses = "pl-12 pr-4 h-14 text-lg shadow-inner focus:ring-1";
    
    if (accentColor === 'amber') {
      // Enhanced contrast for frozen exchange
      return `text-white bg-black/70 border-amber-500/50 focus:border-amber-400 focus:ring-amber-400/50 ${baseClasses} shadow-amber-600/30`;
    } else {
      // Regular exchange
      return `text-white bg-black/50 border-purple-500/50 focus:border-purple-400 focus:ring-purple-400/50 ${baseClasses} shadow-purple-600/30`;
    }
  };

  return (
    <div className="space-y-2">
      <Label className={`text-base font-medium text-${accentColor}-200 flex items-center gap-2`}>
        <DollarSign className={`h-4 w-4 text-${accentColor}-400`} />
        Amount to Exchange
      </Label>
      <div className="relative">
        <Input 
          type="number" 
          step="0.0001" 
          min="0.0001" 
          value={exchangeAmount} 
          onChange={e => setExchangeAmount(e.target.value)} 
          placeholder={`Enter amount in ${exchangeDirection === 'eth_to_usdt' ? 'ETH' : 'USDT'}`} 
          className={getInputClass()} 
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {exchangeDirection === 'eth_to_usdt' ? (
            <div className="w-7 h-7 bg-black/60 rounded-full p-0.5 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="ETH" className="h-5 w-5" />
            </div>
          ) : (
            <div className="h-7 w-7 flex items-center justify-center bg-usdt rounded-full text-white font-bold text-xs shadow-lg">
              $
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
