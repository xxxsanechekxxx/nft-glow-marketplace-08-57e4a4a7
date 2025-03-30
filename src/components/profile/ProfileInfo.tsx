
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Globe, HelpCircle, Wallet, UserRound, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { UserData } from "@/types/user";

interface ProfileInfoProps {
  userData: UserData | null;
  setIsWalletModalOpen: (isOpen: boolean) => void;
}

export const ProfileInfo = ({ userData, setIsWalletModalOpen }: ProfileInfoProps) => {
  const [copiedWallet, setCopiedWallet] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWallet(true);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
    
    setTimeout(() => {
      setCopiedWallet(false);
    }, 2000);
  };

  return (
    <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-[#1A1F2C]/95 to-[#1A1F2C]/80 overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] opacity-30"></div>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600/50 via-primary/40 to-purple-600/50"></div>
      
      <CardHeader className="space-y-2 border-b border-primary/10 pb-4 relative z-10">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <UserRound className="w-6 h-6 text-primary" />
          </div>
          Profile Information
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-8 p-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Field */}
          <div className="space-y-2 group relative">
            <label className="text-sm font-medium flex items-center gap-2 text-white/70">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <div className="relative overflow-hidden rounded-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Input 
                value={userData?.email} 
                readOnly 
                className="bg-white/5 border-white/10 group-hover:border-primary/30 transition-colors font-medium text-white/90 h-12" 
              />
            </div>
          </div>
          
          {/* Country Field */}
          <div className="space-y-2 group">
            <label className="text-sm font-medium flex items-center gap-2 text-white/70">
              <Globe className="w-4 h-4" />
              Country
            </label>
            <div className="relative overflow-hidden rounded-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Input 
                value={userData?.country} 
                readOnly 
                className="bg-white/5 border-white/10 group-hover:border-primary/30 transition-colors pl-10 font-medium text-white/90 h-12" 
              />
              <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary/60" />
            </div>
          </div>
        </div>
        
        {/* Verification Status */}
        <div className="space-y-2 group">
          <label className="text-sm font-medium flex items-center gap-2 text-white/70">
            <HelpCircle className="w-4 h-4" />
            Verification Status
          </label>
          <div className="relative overflow-hidden rounded-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="bg-white/5 border border-white/10 group-hover:border-primary/30 transition-colors rounded-lg p-3 pl-10 flex items-center">
              {userData?.verified ? (
                <div className="flex items-center gap-2 text-green-500 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified Account</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-yellow-500 font-medium">
                  <HelpCircle className="w-4 h-4" />
                  <span>Not Verified</span>
                </div>
              )}
            </div>
            <HelpCircle className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary/60" />
          </div>
        </div>
        
        {/* Wallet Address */}
        <div className="space-y-2 group">
          <label className="text-sm font-medium flex items-center gap-2 text-white/70">
            <Wallet className="w-4 h-4" />
            Wallet Address
          </label>
          <div className="flex gap-4 items-start">
            <div className="flex-grow flex gap-2 items-center relative overflow-hidden rounded-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Input 
                value={userData?.wallet_address || ''} 
                readOnly 
                className="bg-white/5 font-mono text-sm border-white/10 group-hover:border-primary/30 transition-colors pl-10 pr-16 truncate text-white/90 h-12" 
                placeholder="No wallet address generated" 
              />
              <Wallet className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary/60" />
              
              {userData?.wallet_address && (
                <div className="absolute right-0 top-0 h-full flex items-center gap-0.5 pr-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full hover:bg-primary/20 hover:text-primary transition-colors"
                          onClick={() => copyToClipboard(userData.wallet_address || '')}
                        >
                          {copiedWallet ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#1A1F2C] border border-primary/20">
                        <p>{copiedWallet ? 'Copied!' : 'Copy address'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
            
            <div className="flex items-center">
              {userData?.wallet_address ? (
                <div className="bg-primary/20 px-3 py-1.5 rounded-md text-sm text-primary font-medium flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  ERC-20
                </div>
              ) : (
                <Button 
                  onClick={() => setIsWalletModalOpen(true)} 
                  className="bg-gradient-to-r from-purple-600/20 to-primary/20 border border-primary/10 text-primary hover:from-purple-600/30 hover:to-primary/30 transition-colors flex items-center gap-2 group relative overflow-hidden h-12"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Wallet className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Generate Address</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
