
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import type { UserData, Transaction } from "@/types/user";
import { fetchExchangeRate, calculateReverseRate, calculateEstimatedResult } from "@/utils/exchangeRate";
import { ExchangeDirectionSelector } from "./exchange/ExchangeDirectionSelector";
import { ExchangeAmountInput } from "./exchange/ExchangeAmountInput";
import { EstimatedResult } from "./exchange/EstimatedResult";
import { ExchangeDetails } from "./exchange/ExchangeDetails";

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
  const [exchangeAmount, setExchangeAmount] = useState("");
  const [exchangeDirection, setExchangeDirection] = useState<'eth_to_usdt' | 'usdt_to_eth'>('eth_to_usdt');
  const [estimatedResult, setEstimatedResult] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(2074);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const getExchangeRate = async () => {
      setIsLoadingRate(true);
      const rate = await fetchExchangeRate();
      setExchangeRate(rate);
      setIsLoadingRate(false);
    };

    if (isOpen) {
      getExchangeRate();
    }
  }, [isOpen]);

  const reverseExchangeRate = calculateReverseRate(exchangeRate);
  
  useEffect(() => {
    const result = calculateEstimatedResult(
      exchangeAmount, 
      exchangeRate, 
      reverseExchangeRate, 
      exchangeDirection
    );
    setEstimatedResult(result);
  }, [exchangeAmount, exchangeRate, reverseExchangeRate, exchangeDirection]);

  const toggleExchangeDirection = () => {
    setExchangeDirection(prev => prev === 'eth_to_usdt' ? 'usdt_to_eth' : 'eth_to_usdt');
    setExchangeAmount("");
  };

  const handleExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    const exchangeAmountNum = parseFloat(exchangeAmount);

    // Validation
    if (exchangeAmountNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }

    // Check sufficient funds
    if (exchangeDirection === 'eth_to_usdt') {
      const balanceField = exchangeType === 'regular' ? 'balance' : 'frozen_balance';
      const balanceNum = parseFloat(exchangeType === 'regular' ? userData?.balance || "0" : userData?.frozen_balance || "0");
      
      if (exchangeAmountNum > balanceNum) {
        toast({
          title: "Insufficient funds",
          description: `Your ${exchangeType === 'regular' ? '' : 'frozen '}ETH balance (${balanceNum} ETH) is less than the requested exchange amount`,
          variant: "destructive"
        });
        return;
      }
    } else {
      const usdtBalanceField = exchangeType === 'regular' ? 'usdt_balance' : 'frozen_usdt_balance';
      const usdtBalanceNum = parseFloat(exchangeType === 'regular' ? userData?.usdt_balance || "0" : userData?.frozen_usdt_balance || "0");
      
      if (exchangeAmountNum > usdtBalanceNum) {
        toast({
          title: "Insufficient funds",
          description: `Your ${exchangeType === 'regular' ? '' : 'frozen '}USDT balance (${usdtBalanceNum} USDT) is less than the requested exchange amount`,
          variant: "destructive"
        });
        return;
      }
    }
    
    try {
      // Set the correct flags based on the exchange type
      const isFrozen = exchangeType === 'frozen';
      const isFrozenExchange = exchangeType === 'frozen';
      
      // Create transaction
      const { error } = await supabase.from('transactions').insert([{
        user_id: userId,
        type: 'exchange',
        amount: exchangeAmountNum,
        status: 'pending',
        is_frozen: isFrozen,
        is_frozen_exchange: isFrozenExchange
      }]);
      
      if (error) throw error;

      // Fetch updated transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (transactionsError) throw transactionsError;
      
      // Format and update transactions
      if (transactionsData) {
        setTransactions(transactionsData.map(tx => {
          const dateObj = new Date(tx.created_at);
          const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
          
          let formattedFrozenUntil = null;
          if (tx.frozen_until) {
            const frozenDate = new Date(tx.frozen_until);
            formattedFrozenUntil = `${frozenDate.getDate().toString().padStart(2, '0')}/${(frozenDate.getMonth() + 1).toString().padStart(2, '0')}/${frozenDate.getFullYear()}`;
          }
          
          return {
            id: tx.id,
            type: tx.type,
            amount: tx.amount.toString(),
            created_at: formattedDate,
            status: tx.status,
            item: tx.item,
            frozen_until: formattedFrozenUntil,
            is_frozen: tx.is_frozen,
            is_frozen_exchange: tx.is_frozen_exchange
          };
        }));
      }
      
      // Show success message
      toast({
        title: "Exchange Requested",
        description: `Your exchange request for ${exchangeAmount} ${exchangeDirection === 'eth_to_usdt' ? 'ETH to USDT' : 'USDT to ETH'} ${exchangeType === 'frozen' ? '(from frozen balance)' : ''} has been submitted`
      });
      
      // Reset form and close dialog
      setExchangeAmount("");
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process exchange. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getAvailableBalance = () => {
    if (exchangeDirection === 'eth_to_usdt') {
      return `${Number(exchangeType === 'regular' ? userData?.balance || 0 : userData?.frozen_balance || 0).toFixed(4)} ETH`;
    } else {
      return `${Number(exchangeType === 'regular' ? userData?.usdt_balance || 0 : userData?.frozen_usdt_balance || 0).toFixed(2)} USDT`;
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
        
        <form onSubmit={handleExchange} className="space-y-5 relative">
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
