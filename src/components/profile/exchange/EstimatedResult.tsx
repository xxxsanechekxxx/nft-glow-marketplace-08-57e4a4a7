
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
  const getGlowEffect = () => {
    return accentColor === 'amber' 
      ? 'shadow-[0_0_15px_rgba(245,158,11,0.25)]'
      : 'shadow-[0_0_15px_rgba(147,51,234,0.25)]';
  };

  const getTextColor = () => {
    return accentColor === 'amber' ? 'text-amber-200' : 'text-indigo-200';
  };

  // Add stronger glow effect for improved visibility
  const getStrongGlow = () => {
    return accentColor === 'amber'
      ? 'shadow-[0_0_20px_rgba(245,158,11,0.3)]'
      : 'shadow-[0_0_20px_rgba(147,51,234,0.3)]';
  };
  
  const getBackgroundGradient = () => {
    return accentColor === 'amber'
      ? 'bg-gradient-to-br from-black/80 to-amber-950/80'
      : 'bg-gradient-to-br from-black/80 to-purple-950/80';
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`h-10 w-10 rounded-full bg-${accentColor}-500/30 flex items-center justify-center mb-3 ${getGlowEffect()}`}>
        <ArrowDownIcon className={`h-5 w-5 text-${accentColor}-400`} />
      </div>
      
      <div className={`w-full p-4 rounded-lg ${getBackgroundGradient()} border border-${accentColor}-500/40 flex items-center justify-between shadow-inner backdrop-blur-lg ${getStrongGlow()}`}>
        <div className="flex items-center gap-3">
          {exchangeDirection === 'eth_to_usdt' ? (
            <div className="h-8 w-8 flex items-center justify-center bg-usdt rounded-full text-white font-bold text-sm shadow-md">
              $
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-black/60 p-1 backdrop-blur-sm flex items-center justify-center shadow-md">
              <img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="ETH" className="h-6 w-6" />
            </div>
          )}
          <span className="text-sm text-white">You'll receive</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`text-xl font-bold ${getTextColor()}`}>
            {estimatedResult ? parseFloat(estimatedResult.toFixed(6)) : '0.00'}
          </span>
          <span className={`text-sm text-${accentColor}-100 px-2 py-0.5 rounded-md bg-${accentColor}-500/30 border border-${accentColor}-500/40`}>
            {exchangeDirection === 'eth_to_usdt' ? 'USDT' : 'ETH'}
          </span>
        </div>
      </div>
    </div>
  );
};
