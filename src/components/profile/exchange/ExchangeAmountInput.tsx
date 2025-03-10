
import React from "react";
import { DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExchangeAmountInputProps {
  exchangeAmount: string;
  exchangeDirection: 'eth_to_usdt' | 'usdt_to_eth';
  setExchangeAmount: (value: string) => void;
}

export const ExchangeAmountInput = ({
  exchangeAmount,
  exchangeDirection,
  setExchangeAmount
}: ExchangeAmountInputProps) => {
  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium text-purple-400/90 flex items-center gap-2">
        <DollarSign className="h-4 w-4" />
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
          className="bg-purple-900/10 border-purple-500/20 focus:border-purple-500/40 pl-12 pr-4 h-14 text-lg text-purple-100" 
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
