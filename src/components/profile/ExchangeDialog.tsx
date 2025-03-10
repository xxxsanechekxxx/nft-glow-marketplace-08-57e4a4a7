
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import type { UserData, Transaction } from "@/types/user";

interface ExchangeDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userData: UserData | null;
  userId: string | undefined;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export const ExchangeDialog = ({ 
  isOpen, 
  setIsOpen, 
  userData, 
  userId,
  setTransactions 
}: ExchangeDialogProps) => {
  const [exchangeAmount, setExchangeAmount] = useState("");
  const [exchangeDirection, setExchangeDirection] = useState<'eth_to_usdt' | 'usdt_to_eth'>('eth_to_usdt');
  const { toast } = useToast();

  const handleExchange = (e: React.FormEvent) => {
    e.preventDefault();
    const exchangeAmountNum = parseFloat(exchangeAmount);

    // Validate amount is greater than zero
    if (exchangeAmountNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }

    // Check if user has sufficient balance based on exchange direction
    if (exchangeDirection === 'eth_to_usdt') {
      const balanceNum = parseFloat(userData?.balance || "0");
      if (exchangeAmountNum > balanceNum) {
        toast({
          title: "Insufficient funds",
          description: `Your ETH balance (${balanceNum} ETH) is less than the requested exchange amount`,
          variant: "destructive"
        });
        return;
      }
    } else {
      const usdtBalanceNum = parseFloat(userData?.usdt_balance || "0");
      if (exchangeAmountNum > usdtBalanceNum) {
        toast({
          title: "Insufficient funds",
          description: `Your USDT balance (${usdtBalanceNum} USDT) is less than the requested exchange amount`,
          variant: "destructive"
        });
        return;
      }
    }
    
    try {
      const createTransaction = async () => {
        const { error } = await supabase.from('transactions').insert([{
          user_id: userId,
          type: 'exchange',
          amount: exchangeAmountNum,
          status: 'pending'
        }]);
        
        if (error) throw error;

        // Refresh transactions list
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (transactionsError) throw transactionsError;
        
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
              frozen_until: formattedFrozenUntil
            };
          }));
        }
      };
      
      createTransaction();
      
      toast({
        title: "Exchange Requested",
        description: `Your exchange request for ${exchangeAmount} ${exchangeDirection === 'eth_to_usdt' ? 'ETH to USDT' : 'USDT to ETH'} has been submitted`
      });
      
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border border-blue-500/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-500">Exchange Currency</DialogTitle>
          <DialogDescription>
            Convert between ETH and USDT currencies
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleExchange} className="space-y-6">
          {/* Exchange Direction */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-blue-400">Exchange Direction</span>
            </div>
            <div className="flex bg-background/60 rounded-lg p-1 border border-blue-400/20">
              <button 
                type="button" 
                className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center gap-2 ${
                  exchangeDirection === 'eth_to_usdt' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-blue-400 hover:bg-blue-500/10'
                } transition-all`} 
                onClick={() => setExchangeDirection('eth_to_usdt')}
              >
                <img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="ETH" className="h-4 w-4" />
                <span>ETH to USDT</span>
              </button>
              <button 
                type="button" 
                className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center gap-2 ${
                  exchangeDirection === 'usdt_to_eth' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-blue-400 hover:bg-blue-500/10'
                } transition-all`} 
                onClick={() => setExchangeDirection('usdt_to_eth')}
              >
                <div className="h-4 w-4 flex items-center justify-center bg-usdt rounded-full text-white font-bold text-[10px]">
                  $
                </div>
                <span>USDT to ETH</span>
              </button>
            </div>
          </div>
          
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-500/80 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Amount to Exchange
            </label>
            <div className="relative">
              <Input 
                type="number" 
                step="0.0001" 
                min="0.0001" 
                value={exchangeAmount} 
                onChange={e => setExchangeAmount(e.target.value)} 
                placeholder={`Enter amount in ${exchangeDirection === 'eth_to_usdt' ? 'ETH' : 'USDT'}`} 
                className="bg-background/40 border-blue-500/20 focus:border-blue-500/40 pl-10" 
              />
              {exchangeDirection === 'eth_to_usdt' ? (
                <img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="ETH" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2" />
              ) : (
                <div className="h-5 w-5 flex items-center justify-center bg-usdt rounded-full text-white font-bold text-xs absolute left-3 top-1/2 -translate-y-1/2">
                  $
                </div>
              )}
            </div>
          </div>
          
          {/* Available Balance Info */}
          <div className="flex justify-between items-center bg-blue-900/20 p-3 rounded-lg border border-blue-500/20">
            <p className="text-sm text-blue-300">
              Available to exchange: 
            </p>
            <p className="text-blue-400 font-medium">
              {exchangeDirection === 'eth_to_usdt' 
                ? `${Number(userData?.balance || 0).toFixed(2)} ETH` 
                : `${Number(userData?.usdt_balance || 0).toFixed(2)} USDT`}
            </p>
          </div>
          
          <Button type="submit" variant="exchange" className="w-full">
            <RefreshCw className="h-4 w-4" />
            Confirm Exchange
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
