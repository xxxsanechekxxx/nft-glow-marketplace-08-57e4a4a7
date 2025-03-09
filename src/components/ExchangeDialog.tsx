
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ExchangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExchangeDialog = ({ open, onOpenChange }: ExchangeDialogProps) => {
  const [direction, setDirection] = useState<"ETH_TO_USDT" | "USDT_TO_ETH">("ETH_TO_USDT");
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleExchange = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create a transaction record with the pending status
      const { data, error } = await supabase
        .from("transactions")
        .insert({
          amount: Number(amount),
          type: "exchange",
          status: "pending",
        })
        .select();

      if (error) throw error;

      toast({
        title: "Exchange request submitted",
        description: `Your request to exchange ${amount} ${direction === "ETH_TO_USDT" ? "ETH to USDT" : "USDT to ETH"} has been submitted.`,
      });

      // Close the dialog
      onOpenChange(false);
      
      // Reset form
      setAmount("");
      setDirection("ETH_TO_USDT");
    } catch (error) {
      console.error("Exchange error:", error);
      toast({
        title: "Exchange failed",
        description: error.message || "Something went wrong while processing your exchange",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapDirection = () => {
    setDirection(prev => prev === "ETH_TO_USDT" ? "USDT_TO_ETH" : "ETH_TO_USDT");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-xl border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Exchange Currency
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Convert between ETH and USDT
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Amount</label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-white/5 border-white/10 focus:border-primary/50 text-white"
            />
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm text-gray-300">From</label>
              <div className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white">
                {direction === "ETH_TO_USDT" ? "ETH" : "USDT"}
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="mt-6"
              onClick={handleSwapDirection}
            >
              <ArrowRightLeft className="h-5 w-5 text-gray-300" />
            </Button>
            
            <div className="flex-1 space-y-2">
              <label className="text-sm text-gray-300">To</label>
              <div className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white">
                {direction === "ETH_TO_USDT" ? "USDT" : "ETH"}
              </div>
            </div>
          </div>
          
          {amount && (
            <div className="text-sm text-gray-400 mt-2">
              Estimated {direction === "ETH_TO_USDT" ? "USDT" : "ETH"}: {amount}
            </div>
          )}
        </div>
        
        <DialogFooter className="mt-6">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="bg-white/10 hover:bg-white/20 text-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleExchange}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
          >
            {isLoading ? "Processing..." : "Exchange"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExchangeDialog;
