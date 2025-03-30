
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
    <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-[#1A1F2C]/90">
      <CardHeader className="space-y-2 border-b border-primary/10 pb-4">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <UserRound className="w-6 h-6 text-primary" />
          </div>
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Field */}
          <div className="space-y-2 group relative">
            <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <div className="relative overflow-hidden rounded-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Input 
                value={userData?.email} 
                readOnly 
                className="bg-background/50 border-primary/10 group-hover:border-primary/30 transition-colors pl-10 font-medium text-white/90" 
              />
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary/60" />
            </div>
          </div>
          
          {/* Country Field */}
          <div className="space-y-2 group">
            <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Globe className="w-4 h-4" />
              Country
            </label>
            <div className="relative overflow-hidden rounded-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Input 
                value={userData?.country} 
                readOnly 
                className="bg-background/50 border-primary/10 group-hover:border-primary/30 transition-colors pl-10 font-medium text-white/90" 
              />
              <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary/60" />
            </div>
          </div>
        </div>
        
        {/* Verification Status */}
        <div className="space-y-2 group">
          <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <HelpCircle className="w-4 h-4" />
            Verification Status
          </label>
          <div className="relative overflow-hidden rounded-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="bg-background/50 border border-primary/10 group-hover:border-primary/30 transition-colors rounded-lg p-3 pl-10 flex items-center">
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
          <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <Wallet className="w-4 h-4" />
            Wallet Address
          </label>
          <div className="flex gap-4 items-start">
            <div className="flex-grow flex gap-2 items-center relative overflow-hidden rounded-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Input 
                value={userData?.wallet_address || ''} 
                readOnly 
                className="bg-background/50 font-mono text-sm border-primary/10 group-hover:border-primary/30 transition-colors pl-10 pr-16 truncate text-white/90" 
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
                      <TooltipContent>
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
                  className="bg-primary/20 text-primary hover:bg-primary/30 transition-colors flex items-center gap-2 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
