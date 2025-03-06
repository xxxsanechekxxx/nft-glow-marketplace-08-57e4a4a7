
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-primary/10">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-purple-500/5 to-pink-500/5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-400 animate-[pulse_5s_ease-in-out_infinite] group-hover:scale-110 transition-all duration-1000 shadow-lg shadow-primary/20"></div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500 group-hover:opacity-80 transition-all duration-1000">
                PureNFT
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm hover:text-primary transition-all duration-300 relative group ${
                isActive('/') ? 'text-primary' : ''
              }`}
            >
              <span className="relative z-10">Home</span>
              <div className={`absolute bottom-[-20px] left-0 w-full h-[2px] bg-gradient-to-r from-primary to-purple-400 transform origin-left transition-transform duration-300 ${
                isActive('/') ? 'scale-x-100' : 'scale-x-0'
              } group-hover:scale-x-100`} />
            </Link>
            <Link 
              to="/marketplace" 
              className={`text-sm hover:text-primary transition-all duration-300 relative group ${
                isActive('/marketplace') ? 'text-primary' : ''
              }`}
            >
              <span className="relative z-10">Marketplace</span>
              <div className={`absolute bottom-[-20px] left-0 w-full h-[2px] bg-gradient-to-r from-primary to-purple-400 transform origin-left transition-transform duration-300 ${
                isActive('/marketplace') ? 'scale-x-100' : 'scale-x-0'
              } group-hover:scale-x-100`} />
            </Link>
            {user ? (
              <Link to="/profile">
                <Button variant="outline" className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border-white/10 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 shadow-lg hover:shadow-primary/20 relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <User className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{user.user_metadata.login || 'Profile'}</span>
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border-white/10 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 shadow-lg hover:shadow-primary/20 relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <User className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Login</span>
                </Button>
              </Link>
            )}
          </nav>

          <button
            className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors duration-300 relative group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {isMenuOpen ? (
              <X className="text-primary relative z-10" />
            ) : (
              <Menu className="text-primary relative z-10" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-primary/10 animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-purple-500/5 to-pink-500/5"></div>
          <div className="container mx-auto px-4 py-4 relative">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`text-sm hover:text-primary transition-colors duration-300 ${
                  isActive('/') ? 'text-primary' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/marketplace" 
                className={`text-sm hover:text-primary transition-colors duration-300 ${
                  isActive('/marketplace') ? 'text-primary' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Marketplace
              </Link>
              {user ? (
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full flex items-center gap-2 justify-center bg-white/5 backdrop-blur-xl border-white/10 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <User className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{user.user_metadata.login || 'Profile'}</span>
                  </Button>
                </Link>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full flex items-center gap-2 justify-center bg-white/5 backdrop-blur-xl border-white/10 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <User className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">Login</span>
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
