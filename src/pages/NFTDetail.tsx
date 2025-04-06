
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { NFTImage } from "@/components/nft/NFTImage";
import { NFTHeader } from "@/components/nft/NFTHeader";
import { NFTDetails } from "@/components/nft/NFTDetails";
import { PurchaseButton } from "@/components/nft/PurchaseButton";
import { Badge } from "@/components/ui/badge";
import ActiveBids from "@/components/nft/ActiveBids";
import type { NFT } from "@/types/nft";
import { useState, useEffect } from "react"; 
import { motion } from "framer-motion";
import FraudWarningDialog from "@/components/FraudWarningDialog";

const NFTDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showFraudWarning, setShowFraudWarning] = useState(false);

  const { data: nft, isLoading } = useQuery({
    queryKey: ['nft', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as NFT;
    },
  });

  const { data: userData } = useQuery({
    queryKey: ['user-balance', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handlePurchaseComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['nft', id] });
    queryClient.invalidateQueries({ queryKey: ['user-balance', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['nfts'] });
    
    navigate('/profile');
  };

  const handleBidDeclined = () => {
    queryClient.invalidateQueries({ queryKey: ['nft', id] });
    queryClient.invalidateQueries({ queryKey: ['user-balance', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['nfts'] });
    queryClient.invalidateQueries({ queryKey: ['nft_bids'] });
    
    toast({
      title: "Bid Declined",
      description: "The bid has been successfully declined."
    });
  };

  const getMarketplaceDisplay = () => {
    if (!nft?.marketplace) return null;
    
    const marketplaceMap: Record<string, string> = {
      'purenft': 'PureNFT.io',
      'rarible': 'Rarible.com',
      'opensea': 'OpenSea.io',
      'looksrare': 'LooksRare.org',
      'dappradar': 'DappRadar.com',
      'debank': 'DeBank.com'
    };
    
    return marketplaceMap[nft.marketplace] || nft.marketplace;
  };

  const isOwned = nft?.owner_id === user?.id;
  
  const isForSale = nft?.for_sale === true;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-secondary/50 rounded w-1/4 mx-auto"></div>
            <div className="h-96 bg-secondary/50 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center">NFT not found</div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2,
        duration: 0.8
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-[90vh] relative overflow-hidden bg-gradient-to-b from-background via-background/80 to-background/60">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-500/10 via-pink-500/5 to-primary/10 blur-3xl -z-10 animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-pink-500/5 via-primary/5 to-purple-500/10 blur-3xl -z-10 opacity-70" />
      
      <div className="container mx-auto px-4 pt-16 sm:pt-24 pb-16 relative">
        <motion.div 
          initial={{ x: -20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 mb-6 sm:mb-8 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            <div className="relative z-10 flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-white/5 rounded-full backdrop-blur-xl border border-white/10 group-hover:border-primary/20 shadow-lg group-hover:shadow-primary/20">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-sm sm:text-base">Back to Marketplace</span>
            </div>
          </Link>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16"
        >
          <motion.div variants={itemVariants} className="relative">
            <div className="rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.15)] border border-purple-500/20 bg-gradient-to-br from-purple-900/20 via-background/80 to-background/90 p-1">
              <NFTImage image={nft.image} name={nft.name} />
            </div>
            
            {nft.marketplace && isForSale && (
              <div className="absolute top-6 left-6 z-10">
                <Badge className="bg-black/70 text-white border-white/20 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium shadow-lg shadow-purple-900/20">
                  Listed on {getMarketplaceDisplay()}
                </Badge>
              </div>
            )}
            
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-tr from-primary/20 to-purple-500/40 rounded-full blur-2xl -z-10"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-bl from-pink-500/20 to-primary/30 rounded-full blur-3xl -z-10"></div>
          </motion.div>

          <motion.div variants={containerVariants} className="space-y-8 sm:space-y-10">
            <motion.div variants={itemVariants}>
              <NFTHeader name={nft.name} creator={nft.creator} />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="relative group transition-all duration-500">
                <div className="absolute -inset-px bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-xl blur opacity-75 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="relative flex items-center justify-between backdrop-blur-xl bg-white/5 p-6 sm:p-8 rounded-xl border border-white/10 group-hover:border-primary/30 transition-all duration-300 group-hover:bg-white/10 shadow-lg group-hover:shadow-primary/20">
                  <div>
                    <p className="text-sm sm:text-base text-muted-foreground mb-2">Current price</p>
                    <div className="flex items-center gap-2">
                      <img 
                        src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                        alt="ETH"
                        className="h-5 w-5 sm:h-6 sm:w-6"
                      />
                      <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
                        {nft.price} ETH
                      </span>
                    </div>
                  </div>
                  {nft.owner_id && !isForSale && (
                    <div className="bg-white/10 px-4 py-2.5 rounded-full border border-white/10 text-sm backdrop-blur-md shadow-inner">
                      <p className="text-muted-foreground">
                        Already purchased
                      </p>
                    </div>
                  )}
                  {isOwned && (
                    <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 px-4 py-2.5 rounded-full border border-primary/30 text-sm backdrop-blur-md">
                      <p className="text-primary font-medium">
                        You own this
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {nft.description && (
              <motion.div variants={itemVariants} className="relative group">
                <div className="absolute -inset-px bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="relative space-y-2 text-muted-foreground backdrop-blur-xl bg-white/5 p-6 sm:p-8 rounded-xl border border-white/10 group-hover:border-primary/20 transition-all duration-300 group-hover:bg-white/10 shadow-md group-hover:shadow-primary/20">
                  <p className="leading-relaxed text-sm sm:text-base">{nft.description}</p>
                </div>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="flex gap-4">
              {isOwned ? (
                <div className="w-full py-4 sm:py-5 px-6 sm:px-8 text-center bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 rounded-xl backdrop-blur-xl shadow-lg">
                  <p className="text-lg sm:text-xl font-medium bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">You own this NFT</p>
                </div>
              ) : (nft.owner_id && !isForSale) ? (
                <div className="w-full py-4 sm:py-5 px-6 sm:px-8 text-center bg-white/10 border border-white/10 rounded-xl backdrop-blur-xl">
                  <p className="text-lg sm:text-xl text-muted-foreground">This NFT has already been purchased</p>
                </div>
              ) : (
                <>
                  <PurchaseButton 
                    isLoggedIn={!!user}
                    onPurchase={handlePurchaseComplete}
                    nftId={nft.id}
                  />
                  <button 
                    onClick={() => setShowFraudWarning(true)}
                    className="hidden sm:block py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-muted-foreground font-medium transition-all duration-300"
                  >
                    Report
                  </button>
                </>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <NFTDetails 
                tokenStandard={nft.token_standard}
                properties={nft.properties}
              />
            </motion.div>
            
            {isOwned && (
              <motion.div variants={itemVariants}>
                <ActiveBids
                  nftId={nft.id}
                  ownerId={nft.owner_id}
                  currentUserId={user?.id}
                  onBidAccepted={handlePurchaseComplete}
                  onBidDeclined={handleBidDeclined}
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
      
      <FraudWarningDialog 
        isOpen={showFraudWarning} 
        onClose={() => setShowFraudWarning(false)} 
      />
    </div>
  );
};

export default NFTDetail;
