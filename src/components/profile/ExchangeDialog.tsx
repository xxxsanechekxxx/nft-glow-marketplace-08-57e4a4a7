
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Info } from "lucide-react";
import type { UserData, Transaction } from "@/types/user";
import { ExchangeDirectionSelector } from "./exchange/ExchangeDirectionSelector";
import { ExchangeAmountInput } from "./exchange/ExchangeAmountInput";
import { EstimatedResult } from "./exchange/EstimatedResult";
import { ExchangeDetails } from "./exchange/ExchangeDetails";
import { useExchange } from "@/hooks/useExchange";

interface ExchangeDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userData: UserData | null;
  userId: string | undefined;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  exchangeType?: 'regular' | 'frozen';
}

export const ExchangeDialog = ({ 
  isOpen, 
  setIsOpen, 
  userData, 
  userId,
  setTransactions,
  exchangeType = 'regular'
}: ExchangeDialogProps) => {
  const { 
    exchangeAmount,
    setExchangeAmount,
    exchangeDirection,
    estimatedResult,
    exchangeRate,
    reverseExchangeRate,
    isLoadingRate,
    fetchCurrentExchangeRate,
    toggleExchangeDirection,
    getAvailableBalance,
    handleExchange
  } = useExchange({
    userData,
    userId,
    setTransactions,
    exchangeType
  });
  
  useEffect(() => {
    if (isOpen) {
      fetchCurrentExchangeRate();
    }
  }, [isOpen]);

  const onExchangeSubmit = async (e: React.FormEvent) => {
    const success = await handleExchange(e);
    if (success) {
      setIsOpen(false);
    }
  };

  const getDialogGradient = () => {
    return exchangeType === 'frozen' 
      ? 'from-amber-900/95 via-amber-800/95 to-amber-900/95'
      : 'from-[#261E57]/95 via-[#201347]/95 to-[#1E1245]/95';
  };

  const getButtonGradient = () => {
    return exchangeType === 'frozen'
      ? 'bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 border-amber-500/50 shadow-amber-600/20'
      : 'bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 border-purple-500/50 shadow-purple-600/20';
  };

  const getAccentColor = () => {
    return exchangeType === 'frozen' ? 'amber' : 'purple';
  };

  const getGlowEffect = () => {
    return exchangeType === 'frozen' 
      ? 'shadow-[0_0_30px_rgba(245,158,11,0.15)]'
      : 'shadow-[0_0_30px_rgba(147,51,234,0.15)]';
  };

  const accent = getAccentColor();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className={`sm:max-w-md bg-gradient-to-b ${getDialogGradient()} backdrop-blur-xl border border-${accent}-500/20 shadow-lg ${getGlowEffect()} rounded-xl`}
      >
        <div className={`absolute inset-0 rounded-lg bg-${accent}-500/5 pointer-events-none`} />
        
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-${accent}-600/50 via-primary/40 to-${accent}-600/50`}></div>
        
        <DialogHeader>
          <DialogTitle className={`text-xl font-bold bg-gradient-to-r from-${accent}-400 to-${accent === 'purple' ? 'indigo' : 'yellow'}-400 bg-clip-text text-transparent flex items-center gap-2`}>
            <div className={`p-2 rounded-lg bg-${accent}-500/20 backdrop-blur-sm`}>
              <ArrowRightLeft className={`h-5 w-5 text-${accent}-500`} />
            </div>
            {exchangeType === 'frozen' ? 'Exchange Frozen Balance' : 'Exchange Currency'}
          </DialogTitle>
          <DialogDescription className={`text-${accent}-300/80 mt-1`}>
            Convert between {exchangeType === 'frozen' ? 'frozen ' : ''}ETH and {exchangeType === 'frozen' ? 'frozen ' : ''}USDT with ease
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onExchangeSubmit} className="space-y-5 relative">
          <ExchangeDirectionSelector 
            direction={exchangeDirection} 
            onToggleDirection={toggleExchangeDirection}
            accentColor={accent}
          />
          
          <ExchangeAmountInput 
            exchangeAmount={exchangeAmount} 
            exchangeDirection={exchangeDirection} 
            setExchangeAmount={setExchangeAmount} 
            accentColor={accent}
          />
          
          <EstimatedResult 
            estimatedResult={estimatedResult} 
            exchangeDirection={exchangeDirection} 
            accentColor={accent}
          />
          
          <ExchangeDetails 
            exchangeDirection={exchangeDirection}
            exchangeRate={exchangeRate}
            reverseExchangeRate={reverseExchangeRate}
            isLoadingRate={isLoadingRate}
            availableBalance={getAvailableBalance()}
            accentColor={accent}
          />
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className={`w-full ${getButtonGradient()} text-white py-6 rounded-lg transition-all duration-300 shadow-md border h-12`}
            >
              <ArrowRightLeft className="h-5 w-5 mr-2" />
              Confirm Exchange
            </Button>
          </div>
          
          <div className={`flex items-start gap-2 text-xs text-${accent}-400/70 bg-${accent}-500/5 p-3 rounded-lg border border-${accent}-500/10`}>
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>Exchange requests are processed manually and may take up to 24 hours to complete. The final exchange rate may differ slightly from the estimated rate.</p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
