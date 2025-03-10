
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-[#261E57]/95 to-[#1E1245]/95 backdrop-blur-xl border border-purple-500/20 shadow-lg shadow-purple-500/10">
        <div className="absolute inset-0 rounded-lg bg-purple-500/5 pointer-events-none" />
        
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            {exchangeType === 'frozen' ? 'Exchange Frozen Balance' : 'Exchange Currency'}
          </DialogTitle>
          <DialogDescription className="text-purple-300/80">
            Convert between {exchangeType === 'frozen' ? 'frozen ' : ''}ETH and {exchangeType === 'frozen' ? 'frozen ' : ''}USDT with ease
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onExchangeSubmit} className="space-y-5 relative">
          <ExchangeDirectionSelector 
            direction={exchangeDirection} 
            onToggleDirection={toggleExchangeDirection} 
          />
          
          <ExchangeAmountInput 
            exchangeAmount={exchangeAmount} 
            exchangeDirection={exchangeDirection} 
            setExchangeAmount={setExchangeAmount} 
          />
          
          <EstimatedResult 
            estimatedResult={estimatedResult} 
            exchangeDirection={exchangeDirection} 
          />
          
          <ExchangeDetails 
            exchangeDirection={exchangeDirection}
            exchangeRate={exchangeRate}
            reverseExchangeRate={reverseExchangeRate}
            isLoadingRate={isLoadingRate}
            availableBalance={getAvailableBalance()}
          />
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white py-6 rounded-lg transition-all duration-300 shadow-md shadow-purple-600/20 border border-purple-500/50 h-12"
            >
              <ArrowRightLeft className="h-5 w-5 mr-2" />
              Confirm Exchange
            </Button>
          </div>
          
          <div className="flex items-start gap-2 text-xs text-purple-400/70 bg-purple-500/5 p-3 rounded-lg border border-purple-500/10">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>Exchange requests are processed manually and may take up to 24 hours to complete. The final exchange rate may differ slightly from the estimated rate.</p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
