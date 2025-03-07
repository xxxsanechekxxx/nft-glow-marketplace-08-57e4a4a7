
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import NFTDetail from "./pages/NFTDetail";
import HelpCenter from "./pages/HelpCenter";
import Profile from "./pages/Profile";
import CreateNFT from "./pages/CreateNFT";
import Partners from "./pages/Partners";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import SellNFTMarketplace from "./pages/SellNFTMarketplace";
import SellNFTConfirmation from "./pages/SellNFTConfirmation";
import SellNFTPrice from "./pages/SellNFTPrice";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NFTBids from "./pages/NFTBids";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Toaster />
          <Sonner />
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/nft/:id" element={<NFTDetail />} />
              <Route path="/nft/:id/bids" element={<NFTBids />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/create-nft" element={<CreateNFT />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/sell-nft/:id" element={<SellNFTMarketplace />} />
              <Route path="/sell-nft/:id/confirm" element={<SellNFTConfirmation />} />
              <Route path="/sell-nft/:id/price" element={<SellNFTPrice />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
