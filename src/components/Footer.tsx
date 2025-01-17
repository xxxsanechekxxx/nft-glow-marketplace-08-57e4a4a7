import { Twitter, Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-secondary/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary"></div>
              <span className="text-xl font-bold">NFTverse</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Discover, collect, and sell extraordinary NFTs
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-primary">
                  All NFTs
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                  Art
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                  Collectibles
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-sm text-muted-foreground hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                  Partners
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Instagram size={20} />
              </a>
              <a href="https://t.me/nftverse" className="text-muted-foreground hover:text-primary">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8">
          <div className="text-center text-sm text-muted-foreground space-y-4">
            <p>&copy; 2024 NFTverse. All rights reserved.</p>
            <div className="flex items-center justify-center space-x-6">
              <a href="mailto:contact@nftverse.com" className="flex items-center gap-2 hover:text-primary">
                <Mail size={16} />
                <span>contact@nftverse.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};