
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { supabase } from "@/lib/supabase";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MarketplaceStats } from "@/components/marketplace/MarketplaceStats";
import { MarketplaceSearch } from "@/components/marketplace/MarketplaceSearch";
import { NFTGrid } from "@/components/marketplace/NFTGrid";
import { motion } from "framer-motion";
import { FilterX, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface NFT {
  id: string;
  name: string;
  image: string;
  price: string;
  creator: string;
  created_at: string;
  owner_id: string | null;
}

const ITEMS_PER_PAGE = 4; // Reduced items per page for better mobile experience

const Marketplace = () => {
  useEffect(() => {
    document.title = "PureNFT - Marketplace";
    return () => {
      document.title = "PureNFT";
    };
  }, []);

  const { ref, inView } = useInView();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const fetchNFTs = async ({ pageParam = 0 }) => {
    const from = pageParam * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    // Создаем базовый запрос
    let query = supabase
      .from('nfts')
      .select('*', { count: 'exact' })
      .or('owner_id.is.null,for_sale.eq.true'); // Show NFTs without owner OR with for_sale=true
    
    // Если есть поисковый запрос, добавляем фильтрацию
    if (searchQuery) {
      query = query
        .or(`name.ilike.%${searchQuery}%,creator.ilike.%${searchQuery}%`);
    }
    
    // Добавляем сортировку в зависимости от выбранного параметра
    switch (sortBy) {
      case "newest":
        query = query.order('created_at', { ascending: false });
        break;
      case "oldest":
        query = query.order('created_at', { ascending: true });
        break;
      case "price-asc":
        query = query.order('price', { ascending: true });
        break;
      case "price-desc":
        query = query.order('price', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }
    
    // Добавляем пагинацию
    query = query.range(from, to);
    
    // Выполняем запрос
    const { data, error, count } = await query;

    if (error) throw error;
    return { data, count, nextPage: to < (count || 0) ? pageParam + 1 : undefined };
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ['nfts', searchQuery, sortBy, currentCategory],
    queryFn: fetchNFTs,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 300000,
    gcTime: 3600000,
  });

  // При изменении параметров сортировки или поиска, делаем новый запрос
  useEffect(() => {
    refetch();
  }, [sortBy, searchQuery, currentCategory, refetch]);

  useEffect(() => {
    if (inView && !isLoading && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  if (error) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center text-red-500">
          Error loading NFTs. Please try again later.
        </div>
      </div>
    );
  }

  const allNFTs = data?.pages.flatMap(page => page.data) || [];
  const hasResults = allNFTs.length > 0;
  const isFiltering = searchQuery.trim() !== '';

  const categories = [
    { id: 'art', name: 'Art', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'collectibles', name: 'Collectibles', icon: <Zap className="h-4 w-4" /> },
    { id: 'trending', name: 'Trending', icon: <TrendingUp className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-background via-background/80 to-background/60">
      {/* Enhanced background with interactive elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-pink-500/5 to-primary/10 blur-3xl -z-10" />
      <div className="absolute inset-0 bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-purple-500/5 to-pink-500/5 blur-3xl -z-10" />
      
      {/* Floating orbs background effect */}
      <div className="absolute inset-0 overflow-hidden -z-5">
        <motion.div
          className="absolute top-10 left-[10%] w-[300px] h-[300px] rounded-full bg-purple-600/5 blur-[100px]"
          animate={{
            y: [0, 20, 0],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-[5%] w-[250px] h-[250px] rounded-full bg-primary/5 blur-[80px]"
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div 
          className="text-center mb-8 space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4 min-h-[120px] flex flex-col items-center justify-center relative">
            <motion.h1 
              className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-white via-primary to-purple-500 bg-clip-text text-transparent animate-gradient bg-300% drop-shadow-sm py-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              NFT Marketplace
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Discover and collect extraordinary NFTs from talented creators around the world
            </motion.p>
          </div>

          {/* Category selector */}
          <motion.div
            className="flex justify-center gap-3 flex-wrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              variant={!currentCategory ? "secondary" : "outline"}
              size="sm"
              onClick={() => setCurrentCategory(null)}
              className={!currentCategory ? "bg-primary/20 border-primary/30 text-white" : ""}
            >
              All NFTs
            </Button>
            
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={currentCategory === category.id ? "secondary" : "outline"}
                size="sm"
                onClick={() => setCurrentCategory(category.id)}
                className={currentCategory === category.id ? "bg-primary/20 border-primary/30 text-white" : ""}
              >
                <span className="flex items-center gap-1.5">
                  {category.icon}
                  {category.name}
                </span>
              </Button>
            ))}
          </motion.div>

          <MarketplaceStats />
          
          <MarketplaceSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          
          {isFiltering && (
            <motion.div 
              className="flex items-center justify-center gap-2 mt-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm flex items-center gap-2">
                <span>Search: "{searchQuery}"</span>
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-primary hover:text-white transition-colors"
                >
                  <FilterX size={14} />
                </button>
              </div>
            </motion.div>
          )}
          
          {/* Featured NFT banner */}
          {!isFiltering && !currentCategory && (
            <motion.div 
              className="mt-6 relative rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-md" />
              <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 p-6 rounded-xl flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-1/3 aspect-square rounded-lg overflow-hidden">
                  <img 
                    src="public/lovable-uploads/350b8c2d-fce4-4eca-bddc-319d143587a0.png" 
                    alt="Featured NFT" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-full md:w-2/3 space-y-4">
                  <Badge className="bg-primary/20 text-primary border-0">Featured Collection</Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Bored Ape Yacht Club</h2>
                  <p className="text-muted-foreground/80">
                    The Bored Ape Yacht Club is a collection of 10,000 unique digital collectibles living on the Ethereum blockchain.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="secondary" className="bg-primary/20 border border-primary/30">
                      View Collection
                    </Button>
                    <Button variant="outline">Learn More</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <NFTGrid
          nfts={allNFTs}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          lastElementRef={ref}
        />
      </div>
    </div>
  );
};

export default Marketplace;
