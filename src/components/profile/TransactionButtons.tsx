
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TransactionButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Button 
        onClick={() => navigate('/deposit')} 
        className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-500 flex items-center gap-3 p-6 h-auto group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="p-3 rounded-xl bg-green-500/20 group-hover:bg-green-500/30 transition-colors duration-300">
          <ArrowDownCircle className="w-6 h-6" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-lg font-semibold">Deposit</span>
          <span className="text-sm text-muted-foreground">Add funds to your wallet</span>
        </div>
      </Button>

      <Button 
        onClick={() => navigate('/withdraw')}
        className="w-full bg-destructive/20 hover:bg-destructive/30 text-destructive flex items-center gap-3 p-6 h-auto group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="p-3 rounded-xl bg-destructive/20 group-hover:bg-destructive/30 transition-colors duration-300">
          <ArrowUpCircle className="w-6 h-6" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-lg font-semibold">Withdraw</span>
          <span className="text-sm text-muted-foreground">Transfer funds to your wallet</span>
        </div>
      </Button>
    </div>
  );
};
