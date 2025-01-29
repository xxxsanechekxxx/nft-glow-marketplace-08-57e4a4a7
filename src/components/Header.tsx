import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AuthModal } from './AuthModal';
import { useAuth } from "@/hooks/useAuth";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary animate-pulse"></div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              NFTverse
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm hover:text-primary transition-colors relative ${
                isActive('/') ? 'text-primary' : ''
              }`}
            >
              Home
              {isActive('/') && (
                <div className="absolute bottom-[-20px] left-0 w-full h-[2px] bg-primary" />
              )}
            </Link>
            <Link 
              to="/marketplace" 
              className={`text-sm hover:text-primary transition-colors relative ${
                isActive('/marketplace') ? 'text-primary' : ''
              }`}
            >
              Marketplace
              {isActive('/marketplace') && (
                <div className="absolute bottom-[-20px] left-0 w-full h-[2px] bg-primary" />
              )}
            </Link>
            {user ? (
              <Link to="/profile">
                <Button variant="outline">
                  {user.user_metadata.login || 'Profile'}
                </Button>
              </Link>
            ) : (
              <AuthModal 
                trigger={
                  <Button variant="outline">
                    Authorization
                  </Button>
                }
              />
            )}
          </nav>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b animate-fade-in">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`text-sm hover:text-primary transition-colors ${
                  isActive('/') ? 'text-primary' : ''
                }`}
              >
                Home
              </Link>
              <Link 
                to="/marketplace" 
                className={`text-sm hover:text-primary transition-colors ${
                  isActive('/marketplace') ? 'text-primary' : ''
                }`}
              >
                Marketplace
              </Link>
              {user ? (
                <Link to="/profile">
                  <Button variant="outline" className="w-full">
                    {user.user_metadata.login || 'Profile'}
                  </Button>
                </Link>
              ) : (
                <AuthModal 
                  trigger={
                    <Button variant="outline" className="w-full">
                      Authorization
                    </Button>
                  }
                />
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};