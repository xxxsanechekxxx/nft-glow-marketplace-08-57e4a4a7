
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
      ? 'from-amber-900/90 via-amber-800/90 to-amber-900/90'
      : 'from-[#261E57]/90 via-[#201347]/90 to-[#1E1245]/90';
  };

  const getButtonGradient = () => {
    return exchangeType === 'frozen'
      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 border-amber-500/50 shadow-amber-600/20'
      : 'bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 border-purple-500/50 shadow-purple-600/20';
  };

  const getAccentColor = () => {
    return exchangeType === 'frozen' ? 'amber' : 'purple';
  };

  const getGlowEffect = () => {
    return exchangeType === 'frozen' 
      ? 'shadow-[0_0_35px_rgba(245,158,11,0.2)]'
      : 'shadow-[0_0_35px_rgba(147,51,234,0.2)]';
  };

  const accent = getAccentColor();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className={`sm:max-w-md bg-gradient-to-b ${getDialogGradient()} backdrop-blur-xl border border-${accent}-500/30 shadow-lg ${getGlowEffect()} rounded-xl`}
      >
        <div className={`absolute inset-0 rounded-lg bg-${accent}-500/5 pointer-events-none`} />
        
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-${accent}-600/70 via-${accent}-500/50 to-${accent}-600/70`}></div>
        
        <DialogHeader className="mb-4">
          <DialogTitle className={`text-2xl font-bold bg-gradient-to-r from-${accent}-300 to-${accent === 'purple' ? 'indigo' : 'yellow'}-300 bg-clip-text text-transparent flex items-center gap-2`}>
            <div className={`p-2 rounded-lg bg-${accent}-500/30 backdrop-blur-sm`}>
              <ArrowRightLeft className={`h-5 w-5 text-${accent}-400`} />
            </div>
            {exchangeType === 'frozen' ? 'Exchange Frozen Balance' : 'Exchange Currency'}
          </DialogTitle>
          <DialogDescription className={`text-${accent}-200 mt-2 text-base`}>
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
          
          <div className="pt-3">
            <Button 
              type="submit" 
              className={`w-full ${getButtonGradient()} text-white py-6 rounded-lg transition-all duration-300 shadow-lg border h-12 font-medium`}
            >
              <ArrowRightLeft className="h-5 w-5 mr-2" />
              Confirm Exchange
            </Button>
          </div>
          
          <div className={`flex items-start gap-2 text-xs text-${accent}-200 bg-black/50 p-4 rounded-lg border border-${accent}-500/20`}>
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>Exchange requests are processed manually and may take up to 24 hours to complete. The final exchange rate may differ slightly from the estimated rate.</p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
