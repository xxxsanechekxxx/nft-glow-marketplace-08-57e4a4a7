
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Footer = () => {
  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    
    // Hardcoded success message
    toast.success("Thanks for subscribing!", {
      description: "You've been added to our newsletter list.",
    });
    
    // Reset the form
    e.currentTarget.reset();
  };

  return (
    <footer className="relative mt-20 overflow-hidden bg-[#0B0D17]">
      <div className="absolute inset-0">
        {/* Enhanced gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/10 via-purple-500/5 to-background"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWI4N2Y1IiBzdHJva2Utd2lkdGg9IjAuMiIgLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIC8+PC9zdmc+')] opacity-5"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#9b87f5]/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9b87f5] to-purple-500 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/20"></div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#9b87f5] to-purple-500 bg-clip-text text-transparent">
                PureNFT
              </span>
            </div>
            <p className="text-base text-[#8E9196] leading-relaxed">
              Discover, collect, and sell extraordinary NFTs on the world's first & largest NFT marketplace
            </p>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-[#9b87f5]">
                Stay connected with us
              </h4>
              <form onSubmit={handleSubscribe} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#9b87f5] to-purple-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex gap-2">
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    className="bg-background/60 border-[#9b87f5]/20 focus:border-[#9b87f5] transition-all backdrop-blur-sm"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-[#9b87f5] to-purple-500 text-white rounded-md hover:brightness-110 transition-all duration-300 shadow-lg shadow-purple-500/20"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-[#9b87f5] to-purple-500 bg-clip-text text-transparent">
              Marketplace
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/marketplace" 
                  className="text-[#8E9196] hover:text-[#9b87f5] transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="relative">
                    <span className="absolute -inset-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 h-px bg-gradient-to-r from-[#9b87f5]/50 to-purple-500/50"></span>
                    All NFTs
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-[#9b87f5] to-purple-500 bg-clip-text text-transparent">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/help" 
                  className="text-[#8E9196] hover:text-[#9b87f5] transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="relative">
                    <span className="absolute -inset-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 h-px bg-gradient-to-r from-[#9b87f5]/50 to-purple-500/50"></span>
                    Help Center
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/partners" 
                  className="text-[#8E9196] hover:text-[#9b87f5] transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="relative">
                    <span className="absolute -inset-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 h-px bg-gradient-to-r from-[#9b87f5]/50 to-purple-500/50"></span>
                    Partners
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-[#8E9196] hover:text-[#9b87f5] transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="relative">
                    <span className="absolute -inset-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 h-px bg-gradient-to-r from-[#9b87f5]/50 to-purple-500/50"></span>
                    Blog
                  </span>
                </Link>
              </li>
              <li>
                <a 
                  href="https://t.me/purenftsupport" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#8E9196] hover:text-[#9b87f5] transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="relative">
                    <span className="absolute -inset-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 h-px bg-gradient-to-r from-[#9b87f5]/50 to-purple-500/50"></span>
                    Telegram Support
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
