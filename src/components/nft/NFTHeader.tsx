
import { User } from "lucide-react";

interface NFTHeaderProps {
  name: string;
  creator: string;
}

export const NFTHeader = ({ name, creator }: NFTHeaderProps) => {
  return (
    <div className="space-y-4">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent animate-gradient bg-300% pb-2">
        {name}
      </h1>
      <div className="flex items-center gap-2 text-muted-foreground bg-white/5 px-6 py-3 rounded-full backdrop-blur-xl border border-white/10 hover:border-primary/20 transition-all duration-300 hover:bg-white/10 inline-block shadow-lg hover:shadow-primary/20">
        <User className="h-4 w-4" />
        <span>Created by {creator}</span>
      </div>
    </div>
  );
};
