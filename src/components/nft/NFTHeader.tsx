
import { User } from "lucide-react";
import { motion } from "framer-motion";

interface NFTHeaderProps {
  name: string;
  creator: string;
}

export const NFTHeader = ({ name, creator }: NFTHeaderProps) => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent animate-gradient bg-300% pb-2">
        {name}
      </h1>
      <div className="flex items-center gap-3 bg-white/5 px-6 py-3.5 rounded-full backdrop-blur-xl border border-white/10 hover:border-primary/20 transition-all duration-300 hover:bg-white/10 inline-block shadow-lg hover:shadow-primary/20">
        <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-primary" />
        </div>
        <span className="text-muted-foreground">Created by <span className="text-white font-medium">{creator}</span></span>
      </div>
    </div>
  );
};
