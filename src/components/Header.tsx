import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "./AuthModal";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-primary font-bold">P</span>
            </div>
            <span className="font-bold text-xl">PURE</span>
          </Link>

          <nav className="hidden md:flex space-x-4">
            <Link to="/marketplace" className={cn("text-lg", { "text-primary": location.pathname === "/marketplace" })}>
              Marketplace
            </Link>
            <Link to="/create-nft" className={cn("text-lg", { "text-primary": location.pathname === "/create-nft" })}>
              Create NFT
            </Link>
            <Link to="/profile" className={cn("text-lg", { "text-primary": location.pathname === "/profile" })}>
              Profile
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button onClick={signOut}>Logout</Button>
              </>
            ) : (
              <Button onClick={() => setIsAuthModalOpen(true)}>Login</Button>
            )}
            <button onClick={toggleMenu} className="md:hidden">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background shadow-lg">
          <nav className="flex flex-col space-y-2 p-4">
            <Link to="/marketplace" className="text-lg" onClick={() => setIsMenuOpen(false)}>
              Marketplace
            </Link>
            <Link to="/create-nft" className="text-lg" onClick={() => setIsMenuOpen(false)}>
              Create NFT
            </Link>
            <Link to="/profile" className="text-lg" onClick={() => setIsMenuOpen(false)}>
              Profile
            </Link>
          </nav>
        </div>
      )}

      <AuthModal trigger={<></>} />
    </header>
  );
};