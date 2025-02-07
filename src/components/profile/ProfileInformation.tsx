
import React from "react";
import { Mail, Globe, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserData } from "@/types/user";

interface ProfileInformationProps {
  userData: UserData | null;
  setIsWalletModalOpen: (open: boolean) => void;
}

export const ProfileInformation = ({
  userData,
  setIsWalletModalOpen,
}: ProfileInformationProps) => {
  return (
    <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-background/60">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
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
            <Input
              value={userData?.email}
              readOnly
              className="bg-background/50 border-primary/10 group-hover:border-primary/30 transition-colors"
            />
          </div>
          <div className="space-y-2 group">
            <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Globe className="w-4 h-4" />
              Country
            </label>
            <Input
              value={userData?.country}
              readOnly
              className="bg-background/50 border-primary/10 group-hover:border-primary/30 transition-colors"
            />
          </div>
        </div>
        <div className="space-y-2 group">
          <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <Wallet className="w-4 h-4" />
            Wallet Address
          </label>
          <div className="flex gap-4 items-start">
            <div className="flex-grow flex gap-2 items-center">
              <Input
                value={userData?.wallet_address || ''}
                readOnly
                className="bg-background/50 font-mono text-sm border-primary/10 group-hover:border-primary/30 transition-colors"
                placeholder="No wallet address generated"
              />
              {userData?.wallet_address && (
                <Input
                  value="ERC-20"
                  readOnly
                  className="bg-background/50 w-24 text-sm text-center border-primary/10"
                />
              )}
            </div>
            {!userData?.wallet_address && (
              <Button
                onClick={() => setIsWalletModalOpen(true)}
                className="bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
              >
                Generate Address
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
