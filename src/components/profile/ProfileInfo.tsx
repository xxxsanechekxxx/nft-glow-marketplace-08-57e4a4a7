
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Globe, HelpCircle, Wallet, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserData } from "@/types/user";

interface ProfileInfoProps {
  userData: UserData | null;
  setIsWalletModalOpen: (isOpen: boolean) => void;
}

export const ProfileInfo = ({ userData, setIsWalletModalOpen }: ProfileInfoProps) => {
  return (
    <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-[#1A1F2C]/90">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <UserRound className="w-6 h-6 text-primary" />
          </div>
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 group">
            <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <div className="relative overflow-hidden rounded-lg transition-all duration-300 group-hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Input value={userData?.email} readOnly className="bg-background/50 border-primary/10 group-hover:border-primary/30 transition-colors pl-10" />
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2 group">
            <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Globe className="w-4 h-4" />
              Country
            </label>
            <div className="relative overflow-hidden rounded-lg transition-all duration-300 group-hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Input value={userData?.country} readOnly className="bg-background/50 border-primary/10 group-hover:border-primary/30 transition-colors pl-10" />
              <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div className="space-y-2 group">
          <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <HelpCircle className="w-4 h-4" />
            Verification Status
          </label>
          <div className="relative overflow-hidden rounded-lg transition-all duration-300 group-hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="bg-background/50 border border-primary/10 group-hover:border-primary/30 transition-colors rounded-lg p-3 pl-10 flex items-center">
              {userData?.verified ? <span className="text-green-500 font-medium">Verified</span> : <span className="text-yellow-500 font-medium">Not Verified</span>}
            </div>
            <HelpCircle className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-2 group">
          <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <Wallet className="w-4 h-4" />
            Wallet Address
          </label>
          <div className="flex gap-4 items-start">
            <div className="flex-grow flex gap-2 items-center relative overflow-hidden rounded-lg transition-all duration-300 group-hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Input value={userData?.wallet_address || ''} readOnly className="bg-background/50 font-mono text-sm border-primary/10 group-hover:border-primary/30 transition-colors pl-10" placeholder="No wallet address generated" />
              <Wallet className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              {userData?.wallet_address && (
                <div className="bg-primary/20 px-3 py-1.5 rounded-md text-sm text-primary font-medium min-w-[80px] text-center">
                  ERC-20
                </div>
              )}
            </div>
            {!userData?.wallet_address && (
              <Button onClick={() => setIsWalletModalOpen(true)} className="bg-primary/20 text-primary hover:bg-primary/30 transition-colors flex items-center gap-2 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Wallet className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Generate Address</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
