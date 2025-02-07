
import React, { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UserData } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface WalletOperationsProps {
  userData: UserData | null;
  setIsDepositConfirmationOpen: (open: boolean) => void;
  depositAmount: string;
  setDepositAmount: (amount: string) => void;
}

export const WalletOperations = ({
  userData,
  setIsDepositConfirmationOpen,
  depositAmount,
  setDepositAmount,
}: WalletOperationsProps) => {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const { toast } = useToast();

  const showDelayedToast = (title: string, description: string, variant: "default" | "destructive" = "default") => {
    setTimeout(() => {
      toast({
        title,
        description,
        variant,
      });
    }, 1000);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const withdrawAmountNum = parseFloat(withdrawAmount);
    const balanceNum = parseFloat(userData?.balance || "0");
    
    if (withdrawAmountNum <= 0) {
      showDelayedToast("Error", "Please enter a valid amount greater than 0", "destructive");
      return;
    }

    if (withdrawAmountNum > balanceNum) {
      showDelayedToast(
        "Insufficient funds",
        `Your balance (${balanceNum} ETH) is less than the requested withdrawal amount`,
        "destructive"
      );
      return;
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: userData?.id,
            type: 'withdraw',
            amount: withdrawAmountNum,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      showDelayedToast(
        "Withdrawal Requested",
        `Your withdrawal request for ${withdrawAmount} ETH has been submitted`
      );
      
      setWithdrawAmount("");
    } catch (error) {
      showDelayedToast(
        "Error",
        "Failed to process withdrawal. Please try again.",
        "destructive"
      );
    }
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData?.wallet_address) {
      showDelayedToast(
        "Error",
        "You need to generate a wallet address in your profile first",
        "destructive"
      );
      return;
    }

    setIsDepositConfirmationOpen(true);
  };

  return (
    <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-background/60">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Wallet Operations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={handleDeposit}>
                <ArrowDownCircle className="w-4 h-4 mr-2" />
                Deposit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Deposit ETH</DialogTitle>
                <DialogDescription>
                  Enter the amount of ETH you want to deposit.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleDeposit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount (ETH)</label>
                  <Input
                    type="number"
                    step="0.000000000000000001"
                    min="0"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Continue</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <ArrowUpCircle className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Withdraw ETH</DialogTitle>
                <DialogDescription>
                  Enter the amount of ETH you want to withdraw.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount (ETH)</label>
                  <Input
                    type="number"
                    step="0.000000000000000001"
                    min="0"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Confirm Withdrawal</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};
