
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="relative mt-20 overflow-hidden bg-[#0B0D17]">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-secondary/5 to-background"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[150px] animate-pulse delay-700"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded-full bg-[#9b87f5] group-hover:scale-110 transition-transform duration-300"></div>
              <span className="text-2xl font-bold text-[#9b87f5]">
                PureNFT
              </span>
            </div>
            <p className="text-base text-[#8E9196]">
              Discover, collect, and sell extraordinary NFTs
            </p>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-[#9b87f5]">
                Stay connected with us
              </h4>
              <div className="flex items-center space-x-4">
                {/* Add social links here */}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-[#9b87f5]">
              Marketplace
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/marketplace" 
                  className="text-[#8E9196] hover:text-[#9b87f5] transition-colors duration-300"
                >
                  All NFTs
                </Link>
              </li>
              <li>
                <Link 
                  to="/jobs" 
                  className="text-[#8E9196] hover:text-[#9b87f5] transition-colors duration-300"
                >
                  Jobs
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-[#9b87f5]">
              Resources
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/help" 
                  className="text-[#8E9196] hover:text-[#9b87f5] transition-colors duration-300"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  to="/partners" 
                  className="text-[#8E9196] hover:text-[#9b87f5] transition-colors duration-300"
                >
                  Partners
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-[#8E9196] hover:text-[#9b87f5] transition-colors duration-300"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  to="/submit-ticket" 
                  className="text-[#8E9196] hover:text-[#9b87f5] transition-colors duration-300"
                >
                  Submit Ticket
                </Link>
              </li>
              <li>
                <a 
                  href="https://t.me/purenftsupport" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#8E9196] hover:text-[#9b87f5] transition-colors duration-300"
                >
                  Telegram Support
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
