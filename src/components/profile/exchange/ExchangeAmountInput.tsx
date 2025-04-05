
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
    const baseClasses = "bg-opacity-20 border-opacity-30 focus:border-opacity-50 pl-12 pr-4 h-14 text-lg shadow-inner";
    
    if (accentColor === 'amber') {
      // Enhanced contrast for frozen exchange
      return `text-amber-100 bg-black/40 border-amber-500 focus:border-amber-400 ${baseClasses} shadow-amber-600/30`;
    } else {
      // Regular exchange
      return `text-white bg-purple-900/20 border-purple-500/30 focus:border-purple-400 ${baseClasses} shadow-purple-600/20`;
    }
  };

  return (
    <div className="space-y-1">
      <Label className={`text-base font-medium text-${accentColor}-300 flex items-center gap-2`}>
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
            <img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="ETH" className="h-6 w-6" />
          ) : (
            <div className="h-6 w-6 flex items-center justify-center bg-usdt rounded-full text-white font-bold text-xs">
              $
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
