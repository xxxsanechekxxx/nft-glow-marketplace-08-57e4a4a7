
import React from "react";
import { ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ExchangeDirectionSelectorProps {
  direction: 'eth_to_usdt' | 'usdt_to_eth';
  onToggleDirection: () => void;
  accentColor?: string;
}

export const ExchangeDirectionSelector = ({ 
  direction, 
  onToggleDirection,
  accentColor = 'purple'
}: ExchangeDirectionSelectorProps) => {
  return (
    <div className={`p-5 rounded-xl bg-${accentColor}-500/10 border border-${accentColor}-500/20 shadow-inner backdrop-blur-sm`}>
      <Label className={`text-sm font-medium text-${accentColor}-300 mb-3 block`}>Exchange Direction</Label>
      
      <div className="flex items-center justify-between">
        <div className={`flex-1 p-3 rounded-lg ${direction === 'eth_to_usdt' ? `bg-${accentColor}-500/30 border border-${accentColor}-500/40 shadow-inner` : 'bg-transparent'} text-center transition-all duration-300`}>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 bg-black/40 rounded-full p-0.5 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="ETH" className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-white/90">Ethereum</span>
          </div>
        </div>
        
        <Button 
          type="button"
          onClick={onToggleDirection}
          variant="circularSmall"
          size="circleSmall"
          className={`mx-2 hover:bg-${accentColor}-500/40 bg-${accentColor}-500/20 border-${accentColor}-500/50 shadow-lg`}
        >
          <ArrowRightLeft className="h-5 w-5" />
        </Button>
        
        <div className={`flex-1 p-3 rounded-lg ${direction === 'usdt_to_eth' ? `bg-${accentColor}-500/30 border border-${accentColor}-500/40 shadow-inner` : 'bg-transparent'} text-center transition-all duration-300`}>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="h-8 w-8 flex items-center justify-center bg-usdt rounded-full text-white font-bold text-sm shadow-lg">
              $
            </div>
            <span className="text-sm font-medium text-white/90">USDT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
