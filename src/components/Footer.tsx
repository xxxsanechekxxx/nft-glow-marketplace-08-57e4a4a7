
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="relative mt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-secondary/5 to-background"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[150px] animate-pulse delay-700"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-400 group-hover:scale-110 transition-transform duration-300"></div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                PureNFT
              </span>
            </div>
            <p className="text-lg text-muted-foreground">
              Discover, collect, and sell extraordinary NFTs
            </p>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              Marketplace
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/marketplace" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 relative group"
                >
                  All NFTs
                  <span className="absolute left-0 bottom-0 w-full h-[1px] bg-primary transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              Resources
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/help" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 relative group"
                >
                  Help Center
                  <span className="absolute left-0 bottom-0 w-full h-[1px] bg-primary transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/partners" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 relative group"
                >
                  Partners
                  <span className="absolute left-0 bottom-0 w-full h-[1px] bg-primary transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 relative group"
                >
                  Blog
                  <span className="absolute left-0 bottom-0 w-full h-[1px] bg-primary transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
                </Link>
              </li>
              <li>
                <a 
                  href="https://t.me/purenftsupport" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 relative group"
                >
                  Support
                  <span className="absolute left-0 bottom-0 w-full h-[1px] bg-primary transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-primary/10">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">&copy; 2024 PureNFT. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
