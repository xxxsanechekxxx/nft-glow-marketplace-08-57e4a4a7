
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import type { UserData } from "@/types/user";

interface ProfileHeaderProps {
  userData: UserData | null;
  handleAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHeader = ({ userData, handleAvatarUpload }: ProfileHeaderProps) => {
  return (
    <div className="relative p-6 sm:p-8 rounded-2xl overflow-hidden bg-gradient-to-r from-purple-500/10 via-primary/5 to-purple-500/10 border border-primary/10 backdrop-blur-sm shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 animate-gradient"></div>
      <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 z-10">
        <div className="relative group">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleAvatarUpload} 
            className="hidden" 
            id="avatar-upload" 
          />
          <label htmlFor="avatar-upload" className="cursor-pointer block relative">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-primary/20 shadow-xl ring-2 ring-purple-500/20 transition-all duration-300 group-hover:ring-purple-500/40">
              {userData?.avatar_url ? (
                <AvatarImage src={userData.avatar_url} alt={userData.login} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-primary/80 to-purple-600 text-white">
                  <UserRound className="w-10 h-10 sm:w-12 sm:h-12" />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <p className="text-white text-xs font-medium">Change Avatar</p>
            </div>
          </label>
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent username-truncate max-w-full">
            @{userData?.login}
          </h1>
        </div>
      </div>
    </div>
  );
};
