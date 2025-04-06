
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Add scroll detection for header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/marketplace", label: "Marketplace" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/80 backdrop-blur-xl border-b border-primary/20 py-2' 
          : 'bg-background/60 backdrop-blur-md border-b border-primary/10 py-3'
      }`}
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-purple-500/5 to-pink-500/5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5"></div>
        {scrolled && (
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        )}
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative flex items-center space-x-2">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.4, type: "spring" }}
                className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-primary to-purple-400 shadow-lg shadow-primary/20"
              />
              <span className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500 group-hover:opacity-80 transition-all duration-1000 header-logo">
                PureNFT
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`text-sm hover:text-primary transition-all duration-300 relative group ${
                  isActive(link.path) ? 'text-primary' : ''
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                <div className={`absolute bottom-[-8px] left-0 w-full h-[2px] bg-gradient-to-r from-primary to-purple-400 transform origin-left transition-transform duration-300 ${
                  isActive(link.path) ? 'scale-x-100' : 'scale-x-0'
                } group-hover:scale-x-100 rounded-full`} />
              </Link>
            ))}

            {user ? (
              <Link to="/profile">
                <Button variant="outline" className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border-white/10 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 shadow-md hover:shadow-primary/20 relative group h-9 md:h-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <User className="w-4 h-4 text-primary relative z-10" />
                  <span className="relative z-10 font-medium">{user.user_metadata.login || 'Profile'}</span>
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border-white/10 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 shadow-md hover:shadow-primary/20 relative group h-9 md:h-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <User className="w-4 h-4 text-primary relative z-10" />
                  <span className="relative z-10 font-medium">Login</span>
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors duration-300 relative group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <AnimatePresence initial={false} mode="wait">
              {isMenuOpen ? (
                <motion.div 
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="text-primary relative z-10" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="text-primary relative z-10" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-14 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-primary/10 mobile-menu overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-purple-500/5 to-pink-500/5"></div>
            <div className="container mx-auto px-4 py-4 relative">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={`text-sm py-2 px-3 rounded-md transition-colors duration-300 ${
                      isActive(link.path) 
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-white/5 hover:text-primary'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent my-2"></div>
                
                {user ? (
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full flex items-center gap-2 justify-center bg-white/5 backdrop-blur-xl border-white/10 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 relative group min-h-[42px]">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <User className="w-4 h-4 text-primary relative z-10" />
                      <span className="relative z-10 username-truncate font-medium">{user.user_metadata.login || 'Profile'}</span>
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full flex items-center gap-2 justify-center bg-white/5 backdrop-blur-xl border-white/10 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 relative group min-h-[42px]">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <User className="w-4 h-4 text-primary relative z-10" />
                      <span className="relative z-10 font-medium">Login</span>
                    </Button>
                  </Link>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
