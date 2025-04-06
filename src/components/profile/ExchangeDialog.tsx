
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

  // Determine color scheme based on exchangeType
  const getColors = () => {
    if (exchangeType === 'frozen') {
      return {
        gradient: 'from-amber-900/95 via-amber-800/95 to-amber-900/95',
        headerGradient: 'from-amber-300 to-yellow-300',
        accentColor: 'amber',
        buttonGradient: 'from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600',
        glow: 'shadow-[0_0_35px_rgba(245,158,11,0.25)]',
        topBorder: 'from-amber-600/70 via-amber-500/50 to-amber-600/70'
      };
    }
    return {
      gradient: 'from-[#261E57]/95 via-[#201347]/95 to-[#1E1245]/95',
      headerGradient: 'from-purple-300 to-indigo-300',
      accentColor: 'purple',
      buttonGradient: 'from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600',
      glow: 'shadow-[0_0_35px_rgba(147,51,234,0.25)]',
      topBorder: 'from-purple-600/70 via-purple-500/50 to-purple-600/70'
    };
  };

  const colors = getColors();
  const accent = colors.accentColor;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className={`sm:max-w-md bg-gradient-to-b ${colors.gradient} backdrop-blur-xl border border-${accent}-500/40 shadow-lg ${colors.glow} rounded-xl`}
      >
        <div className={`absolute inset-0 rounded-lg bg-${accent}-500/5 pointer-events-none`} />
        
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${colors.topBorder}`}></div>
        
        <DialogHeader className="mb-4">
          <DialogTitle className={`text-2xl font-bold bg-gradient-to-r ${colors.headerGradient} bg-clip-text text-transparent flex items-center gap-2`}>
            <div className={`p-2 rounded-lg bg-${accent}-500/30 backdrop-blur-sm shadow-inner`}>
              <ArrowRightLeft className={`h-5 w-5 text-${accent}-400`} />
            </div>
            {exchangeType === 'frozen' ? 'Exchange Frozen Balance' : 'Exchange Currency'}
          </DialogTitle>
          <DialogDescription className={`text-${accent}-200 mt-2 text-base`}>
            Convert between {exchangeType === 'frozen' ? 'frozen ' : ''}ETH and {exchangeType === 'frozen' ? 'frozen ' : ''}USDT with real-time rates
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
              className={`w-full bg-gradient-to-r ${colors.buttonGradient} text-white py-6 rounded-lg transition-all duration-300 shadow-lg border border-${accent}-500/50 h-12 font-medium`}
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
