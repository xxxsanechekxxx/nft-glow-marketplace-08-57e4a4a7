
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, ArrowUpCircle, Wallet, CircleDollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TransactionButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Button 
        onClick={() => navigate('/deposit')} 
        variant="depositButton"
        size="transaction"
        className="w-full group backdrop-blur-sm relative"
      >
        {/* Фоновый эффект при наведении */}
        <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Светящийся круг */}
        <div className="absolute -right-3 -top-3 w-20 h-20 bg-green-500/20 rounded-full blur-xl group-hover:bg-green-500/30 transition-all duration-500"></div>
        
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 p-4 rounded-xl bg-green-500/20 group-hover:bg-green-500/30 transition-all duration-300 backdrop-blur-sm">
            <CircleDollarSign className="w-8 h-8 text-white" />
          </div>
          
          <div className="flex flex-col items-start">
            <span className="text-xl font-bold text-white mb-1">Deposit Funds</span>
            <span className="text-sm text-gray-200/80">Add money to your wallet</span>
          </div>
        </div>
      </Button>

      <Button 
        onClick={() => navigate('/withdraw')}
        variant="withdrawButton"
        size="transaction"
        className="w-full group backdrop-blur-sm relative"
      >
        {/* Фоновый эффект при наведении */}
        <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Светящийся круг */}
        <div className="absolute -left-3 -top-3 w-20 h-20 bg-red-500/20 rounded-full blur-xl group-hover:bg-red-500/30 transition-all duration-500"></div>
        
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 p-4 rounded-xl bg-red-500/20 group-hover:bg-red-500/30 transition-all duration-300 backdrop-blur-sm">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          
          <div className="flex flex-col items-start">
            <span className="text-xl font-bold text-white mb-1">Withdraw Funds</span>
            <span className="text-sm text-gray-200/80">Transfer to your account</span>
          </div>
        </div>
      </Button>
    </div>
  );
};
