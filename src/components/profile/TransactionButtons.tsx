
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import type { UserData } from "@/types/user";

interface TransactionButtonsProps {
  setIsDepositConfirmationOpen: (isOpen: boolean) => void;
  withdrawAmount: string;
  setWithdrawAmount: (amount: string) => void;
  withdrawWalletAddress: string;
  setWithdrawWalletAddress: (address: string) => void;
  handleWithdraw: (e: React.FormEvent) => void;
}

export const TransactionButtons = ({
  setIsDepositConfirmationOpen,
  withdrawAmount,
  setWithdrawAmount,
  withdrawWalletAddress,
  setWithdrawWalletAddress,
  handleWithdraw
}: TransactionButtonsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Button 
        onClick={() => setIsDepositConfirmationOpen(true)} 
        className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-500 flex items-center gap-3 p-6 h-auto group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="p-3 rounded-xl bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
          <ArrowDownCircle className="w-6 h-6" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-lg font-semibold">Deposit</span>
          <span className="text-sm text-muted-foreground">Add funds to your wallet</span>
        </div>
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button 
            className="w-full bg-destructive/20 hover:bg-destructive/30 text-destructive flex items-center gap-3 p-6 h-auto group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="p-3 rounded-xl bg-destructive/20 group-hover:bg-destructive/30 transition-colors">
              <ArrowUpCircle className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg font-semibold">Withdraw</span>
              <span className="text-sm text-muted-foreground">Transfer funds to your wallet</span>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border border-destructive/10">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-destructive">Withdraw</DialogTitle>
            <DialogDescription>
              Transfer funds to your wallet
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-destructive/80">
                Amount (ETH)
              </label>
              <Input 
                type="number" 
                step="0.0001" 
                min="0.0001" 
                value={withdrawAmount} 
                onChange={e => setWithdrawAmount(e.target.value)} 
                placeholder="Enter amount" 
                className="bg-background/40 border-destructive/20 focus:border-destructive/40" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-destructive/80">
                Wallet Address
              </label>
              <Input 
                type="text" 
                value={withdrawWalletAddress} 
                onChange={e => setWithdrawWalletAddress(e.target.value)} 
                placeholder="Enter wallet address" 
                className="bg-background/40 border-destructive/20 focus:border-destructive/40" 
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-destructive/20 hover:bg-destructive/30 text-destructive"
            >
              Confirm Withdrawal
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
