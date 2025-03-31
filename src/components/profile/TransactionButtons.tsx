
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, ArrowUpCircle, CircleDollarSign, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TransactionButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Button 
        onClick={() => navigate('/deposit')} 
        variant="glassDeposit"
        size="actionCard"
        className="group relative"
      >
        {/* Animated background particles for deposit button */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-green-400/20 blur-xl animate-pulse"></div>
          <div className="absolute left-1/2 bottom-0 w-16 h-16 rounded-full bg-emerald-500/20 blur-lg animate-pulse"></div>
        </div>
        
        {/* Content wrapper with z-index to appear above particles */}
        <div className="relative z-10 flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-gradient-to-br from-green-400/30 to-emerald-600/30 rounded-xl border border-green-400/30 backdrop-blur-md shadow-inner">
              <CircleDollarSign className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
            
            <div className="flex flex-col items-start">
              <span className="text-2xl font-bold mb-1 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">Deposit</span>
              <span className="text-sm text-green-100/90">Add funds to your account</span>
            </div>
          </div>
          
          <div className="hidden md:flex h-10 w-10 rounded-full bg-green-500/20 items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
            <ArrowDownCircle className="h-6 w-6 text-green-200" strokeWidth={1.5} />
          </div>
        </div>
      </Button>

      <Button 
        onClick={() => navigate('/withdraw')} 
        variant="glassWithdraw"
        size="actionCard"
        className="group relative"
      >
        {/* Animated background particles for withdraw button */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-4 -top-4 w-24 h-24 rounded-full bg-red-400/20 blur-xl animate-pulse"></div>
          <div className="absolute right-1/2 bottom-0 w-16 h-16 rounded-full bg-orange-500/20 blur-lg animate-pulse"></div>
        </div>
        
        {/* Content wrapper with z-index to appear above particles */}
        <div className="relative z-10 flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-gradient-to-br from-orange-400/30 to-red-600/30 rounded-xl border border-orange-400/30 backdrop-blur-md shadow-inner">
              <Wallet className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
            
            <div className="flex flex-col items-start">
              <span className="text-2xl font-bold mb-1 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">Withdraw</span>
              <span className="text-sm text-orange-100/90">Withdraw funds to your bank</span>
            </div>
          </div>
          
          <div className="hidden md:flex h-10 w-10 rounded-full bg-orange-500/20 items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
            <ArrowUpCircle className="h-6 w-6 text-orange-200" strokeWidth={1.5} />
          </div>
        </div>
      </Button>
    </div>
  );
};
