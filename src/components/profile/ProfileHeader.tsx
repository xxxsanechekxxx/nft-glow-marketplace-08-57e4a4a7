
import React from "react";
import { UserRound, Wallet } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserData } from "@/types/user";

interface ProfileHeaderProps {
  userData: UserData | null;
}

export const ProfileHeader = ({ userData }: ProfileHeaderProps) => {
  return (
    <div className="relative p-8 rounded-2xl overflow-hidden animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 animate-gradient" />
      <div className="relative flex items-center gap-6 z-10">
        <Avatar className="w-24 h-24 border-4 border-primary/20 animate-float shadow-xl">
          <AvatarFallback className="bg-gradient-to-br from-primary/80 to-purple-600">
            <UserRound className="w-12 h-12 text-white" />
          </AvatarFallback>
        </Avatar>
        <div className="space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            @{userData?.login}
          </h1>
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-white" />
            <span className="text-lg font-semibold text-white">
              {Number(userData?.balance || 0).toFixed(1)} ETH
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
