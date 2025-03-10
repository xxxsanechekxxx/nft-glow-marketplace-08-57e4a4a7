
import React from "react";
import { ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ExchangeDirectionSelectorProps {
  direction: 'eth_to_usdt' | 'usdt_to_eth';
  onToggleDirection: () => void;
}

export const ExchangeDirectionSelector = ({ 
  direction, 
  onToggleDirection 
}: ExchangeDirectionSelectorProps) => {
  return (
    <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/10 shadow-inner">
      <Label className="text-sm font-medium text-purple-400 mb-3 block">Exchange Direction</Label>
      
      <div className="flex items-center justify-between">
        <div className={`flex-1 p-3 rounded-lg ${direction === 'eth_to_usdt' ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-transparent'} text-center`}>
          <div className="flex flex-col items-center justify-center gap-2">
            <img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="ETH" className="h-8 w-8" />
            <span className="text-sm font-medium text-purple-100">Ethereum</span>
          </div>
        </div>
        
        <Button 
          type="button"
          onClick={onToggleDirection}
          variant="circularSmall"
          size="circleSmall"
          className="mx-2"
        >
          <ArrowRightLeft className="h-5 w-5" />
        </Button>
        
        <div className={`flex-1 p-3 rounded-lg ${direction === 'usdt_to_eth' ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-transparent'} text-center`}>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="h-8 w-8 flex items-center justify-center bg-usdt rounded-full text-white font-bold text-sm">
              $
            </div>
            <span className="text-sm font-medium text-purple-100">USDT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
