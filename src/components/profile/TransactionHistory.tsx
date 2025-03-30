
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownCircle, ArrowUpCircle, ShoppingBag, ArrowRightLeft, Clock, Calendar, Search, Filter, ChevronDown, Loader2 } from "lucide-react";
import type { Transaction } from "@/types/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile, useIsExtraSmall, useIsTiny } from "@/hooks/use-mobile";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export const TransactionHistory = ({ transactions: initialTransactions }: TransactionHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isExtraSmall = useIsExtraSmall();
  const isTiny = useIsTiny();

  useEffect(() => {
    setTransactions(initialTransactions);
  }, [initialTransactions]);

  const fetchMoreTransactions = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    try {
      const lastTransaction = transactions[transactions.length - 1];
      
      let query = supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (filterType) {
        query = query.eq('type', filterType);
      }
      
      if (transactions.length > 0 && lastTransaction.raw_created_at) {
        query = query.lt('created_at', lastTransaction.raw_created_at);
      }
      
      const { data: transactionsData, error } = await query;
      
      if (error) throw error;
      
      if (transactionsData && transactionsData.length > 0) {
        const formattedTransactions = transactionsData.map(tx => {
          const dateObj = new Date(tx.created_at);
          const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
          
          let formattedFrozenUntil = null;
          if (tx.frozen_until) {
            const frozenDate = new Date(tx.frozen_until);
            formattedFrozenUntil = `${frozenDate.getDate().toString().padStart(2, '0')}/${(frozenDate.getMonth() + 1).toString().padStart(2, '0')}/${frozenDate.getFullYear()}`;
          }
          
          return {
            id: tx.id,
            type: tx.type,
            amount: tx.amount.toString(),
            created_at: formattedDate,
            raw_created_at: tx.created_at,
            status: tx.status,
            item: tx.item,
            frozen_until: formattedFrozenUntil,
            is_frozen: tx.is_frozen,
            is_frozen_exchange: tx.is_frozen_exchange,
            currency_type: tx.currency_type
          };
        });
        
        setTransactions(prev => [...prev, ...formattedTransactions]);
        setHasMore(formattedTransactions.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreDeposits = async () => {
    if (loading) return;
    
    setFilterLoading(true);
    setTransactions([]);
    
    try {
      const { data: depositsData, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('type', 'deposit')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      if (depositsData && depositsData.length > 0) {
        const formattedDeposits = depositsData.map(tx => {
          const dateObj = new Date(tx.created_at);
          const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
          
          return {
            id: tx.id,
            type: tx.type,
            amount: tx.amount.toString(),
            created_at: formattedDate,
            raw_created_at: tx.created_at,
            status: tx.status,
            item: tx.item,
            frozen_until: null,
            is_frozen: tx.is_frozen,
            is_frozen_exchange: tx.is_frozen_exchange,
            currency_type: tx.currency_type
          };
        });
        
        setTransactions(formattedDeposits);
        setFilterType('deposit');
        setHasMore(depositsData.length === 20);
      } else {
        setFilterType('deposit');
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching deposits:", error);
    } finally {
      setFilterLoading(false);
      setLoading(false);
    }
  };

  const loadExchangeTransactions = async () => {
    setFilterLoading(true);
    setTransactions([]);
    
    try {
      const { data: exchangeData, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('type', 'exchange')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      if (exchangeData && exchangeData.length > 0) {
        const formattedExchanges = exchangeData.map(tx => {
          const dateObj = new Date(tx.created_at);
          const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
          
          let formattedFrozenUntil = null;
          if (tx.frozen_until) {
            const frozenDate = new Date(tx.frozen_until);
            formattedFrozenUntil = `${frozenDate.getDate().toString().padStart(2, '0')}/${(frozenDate.getMonth() + 1).toString().padStart(2, '0')}/${frozenDate.getFullYear()}`;
          }
          
          return {
            id: tx.id,
            type: tx.type,
            amount: tx.amount.toString(),
            created_at: formattedDate,
            raw_created_at: tx.created_at,
            status: tx.status,
            item: tx.item,
            frozen_until: formattedFrozenUntil,
            is_frozen: tx.is_frozen,
            is_frozen_exchange: tx.is_frozen_exchange,
            currency_type: tx.currency_type
          };
        });
        
        setTransactions(formattedExchanges);
        setFilterType('exchange');
        setHasMore(exchangeData.length === 20);
      } else {
        setTransactions([]);
        setFilterType('exchange');
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching exchange transactions:", error);
    } finally {
      setFilterLoading(false);
    }
  };

  const resetFilters = () => {
    setFilterLoading(true);
    setTimeout(() => {
      setFilterType(null);
      setTransactions(initialTransactions);
      setFilterLoading(false);
    }, 300);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchMoreTransactions();
        }
      },
      { threshold: 0.5 }
    );
    
    observerRef.current = observer;
    
    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, transactions, filterType]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm === "" || 
      transaction.amount.toLowerCase().includes(searchTerm.toLowerCase()) || 
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === null || transaction.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string, isFrozenExchange: boolean) => {
    switch(type) {
      case 'deposit':
        return <ArrowDownCircle className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-emerald-500 flex-shrink-0" />;
      case 'withdraw':
        return <ArrowUpCircle className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-rose-500 flex-shrink-0" />;
      case 'purchase':
        return <ShoppingBag className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />;
      case 'sale':
        return <ShoppingBag className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-emerald-500 flex-shrink-0" />;
      case 'exchange':
        return <ArrowRightLeft className={`w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 ${isFrozenExchange ? 'text-amber-500' : 'text-indigo-500'} flex-shrink-0`} />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'deposit': return 'Deposit';
      case 'withdraw': return 'Withdraw';
      case 'purchase': return 'Purchase';
      case 'sale': return 'Sale';
      case 'exchange': return 'Exchange';
      default: return type;
    }
  };

  const getShortStatus = (status: string, isFrozen: boolean, isFrozenExchange: boolean) => {
    if (isFrozenExchange) return isTiny ? "FE" : "FrzEx";
    if (isFrozen) return isTiny ? "F" : "Frzn";
    return status === 'completed' ? (isTiny ? "D" : "Done") : (isTiny ? "P" : "Pend");
  };

  return (
    <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-[#1A1F2C]/90 mt-6">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 space-y-3 sm:space-y-0 px-2 xs:px-3 sm:px-4">
        <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-lg bg-primary/20">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          Transaction History
        </CardTitle>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-48">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 h-3 xs:w-4 xs:h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 h-8 xs:h-9 bg-background/50 border-primary/20 focus:border-primary/50 w-full text-2xs xs:text-xs"
              disabled={filterLoading}
            />
          </div>
          
          <div className="flex flex-wrap gap-1 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className={`px-1 h-7 xs:h-8 text-2xs xs:text-xs border-primary/20 ${filterType === null ? 'bg-primary/20 text-primary' : 'bg-background/50'}`}
              onClick={resetFilters}
              disabled={filterLoading}
            >
              {filterLoading && filterType === null ? (
                <Loader2 className="h-3 h-3 xs:w-4 xs:h-4 animate-spin mr-1" />
              ) : null}
              All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className={`px-1 h-7 xs:h-8 text-2xs xs:text-xs border-primary/20 ${filterType === 'deposit' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-background/50'}`}
              onClick={() => {
                if (filterType === 'deposit') {
                  resetFilters();
                } else {
                  loadMoreDeposits();
                }
              }}
              disabled={filterLoading}
            >
              {filterLoading && filterType === 'deposit' ? (
                <Loader2 className="h-3 h-3 xs:w-4 xs:h-4 animate-spin mr-1" />
              ) : (
                <ArrowDownCircle className="w-3 h-3 xs:w-4 xs:h-4" />
              )}
              <span className={isTiny ? "hidden" : ""}>D</span>
              <span className={isTiny ? "hidden" : isExtraSmall ? "hidden xs:inline" : "inline"}>eposits</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className={`px-1 h-7 xs:h-8 text-2xs xs:text-xs border-primary/20 ${filterType === 'exchange' ? 'bg-indigo-500/20 text-indigo-500' : 'bg-background/50'}`}
              onClick={() => {
                if (filterType === 'exchange') {
                  resetFilters();
                } else {
                  loadExchangeTransactions();
                }
              }}
              disabled={filterLoading}
            >
              {filterLoading && filterType === 'exchange' ? (
                <Loader2 className="h-3 h-3 xs:w-4 xs:h-4 animate-spin mr-1" />
              ) : (
                <ArrowRightLeft className="w-3 h-3 xs:w-4 xs:h-4" />
              )}
              <span className={isTiny ? "hidden" : ""}>E</span>
              <span className={isTiny ? "hidden" : isExtraSmall ? "hidden xs:inline" : "inline"}>xchanges</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {filterLoading ? (
          <div className="p-4">
            <div className="space-y-3">
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
            </div>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <ScrollArea className="h-[400px] pr-1">
            <div className="w-full overflow-hidden">
              <Table className="w-full min-w-[280px]">
                <TableHeader>
                  <TableRow className="hover:bg-primary/5 border-b border-primary/10">
                    <TableHead className="text-2xs xs:text-xs sm:text-sm text-muted-foreground font-medium w-[30%] xs:w-[25%] sm:w-[15%]">Date</TableHead>
                    <TableHead className="text-2xs xs:text-xs sm:text-sm text-muted-foreground font-medium w-[10%] xs:w-[15%] sm:w-[20%] text-center sm:text-left">
                      <span className={isTiny ? "hidden" : ""}>Type</span>
                    </TableHead>
                    <TableHead className="text-2xs xs:text-xs sm:text-sm text-muted-foreground font-medium w-[30%] xs:w-[30%] sm:w-[20%]">Amount</TableHead>
                    <TableHead className="text-2xs xs:text-xs sm:text-sm text-muted-foreground font-medium w-[30%] xs:w-[30%] sm:w-[45%] text-center sm:text-left">
                      <span className={isTiny ? "hidden" : isExtraSmall ? "" : "hidden xs:inline"}>Stat</span>
                      <span className={isTiny ? "hidden" : isExtraSmall ? "hidden" : "xs:hidden sm:inline"}>Status</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map(transaction => {
                    const isFrozenExchange = transaction.type === 'exchange' && (transaction.is_frozen || transaction.is_frozen_exchange);
                    
                    return (
                      <TableRow 
                        key={transaction.id} 
                        className={`transition-colors border-b border-primary/5 hover:bg-primary/5 animate-fade-in ${
                          transaction.frozen_until ? 'bg-yellow-500/5' : 
                          isFrozenExchange ? 'bg-amber-500/5' : ''
                        }`}
                      >
                        <TableCell className="py-1 px-0 text-2xs xs:text-xs sm:text-sm">
                          <div className="flex items-center gap-0.5 xs:gap-1">
                            <Calendar className="w-2 h-2 xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                            <span className="whitespace-nowrap">{transaction.created_at}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell className="py-1 px-0 text-2xs xs:text-xs sm:text-sm">
                          <div className="flex items-center justify-center sm:justify-start">
                            <div className={`p-0.5 xs:p-1 sm:p-1.5 rounded-full ${
                              transaction.type === 'deposit' ? 'bg-emerald-500/10' :
                              transaction.type === 'withdraw' ? 'bg-rose-500/10' : 
                              transaction.type === 'purchase' ? 'bg-blue-500/10' :
                              transaction.type === 'sale' ? 'bg-emerald-500/10' :
                              isFrozenExchange ? 'bg-amber-500/10' : 'bg-indigo-500/10'
                            }`}>
                              {getTypeIcon(transaction.type, isFrozenExchange)}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="py-1 px-0 font-medium text-2xs xs:text-xs sm:text-sm">
                          <span className={`${
                            transaction.type === 'deposit' || transaction.type === 'sale' ? 'text-emerald-500' :
                            transaction.type === 'withdraw' || transaction.type === 'purchase' ? 'text-rose-500' :
                            'text-indigo-500'
                          } whitespace-nowrap`}>
                            {transaction.type === 'deposit' || transaction.type === 'sale' ? '+' : 
                             transaction.type === 'withdraw' || transaction.type === 'purchase' ? '-' : ''}
                            {isTiny 
                              ? Number(transaction.amount).toFixed(1) 
                              : isExtraSmall 
                                ? Number(transaction.amount).toFixed(1)
                                : Number(transaction.amount).toFixed(2)}
                          </span>
                        </TableCell>
                        
                        <TableCell className="py-1 px-0 text-2xs xs:text-xs sm:text-sm text-center sm:text-left">
                          <div className="flex items-center justify-center sm:justify-start">
                            <span className={`text-2xs px-0.5 py-0.5 xs:px-1 xs:py-0.5 sm:px-2 sm:py-1 rounded-full font-medium truncate max-w-[40px] xs:max-w-[50px] sm:max-w-full ${
                              transaction.status === 'completed' 
                                ? transaction.frozen_until 
                                  ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' 
                                  : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' 
                                : transaction.status === 'pending' 
                                  ? isFrozenExchange
                                    ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                                    : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' 
                                  : 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                            }`}>
                              {isTiny ? (
                                getShortStatus(transaction.status, !!transaction.frozen_until, isFrozenExchange)
                              ) : isExtraSmall ? (
                                getShortStatus(transaction.status, !!transaction.frozen_until, isFrozenExchange)
                              ) : isMobile ? (
                                transaction.status === 'pending' && isFrozenExchange 
                                  ? "F-Exch"
                                  : transaction.frozen_until
                                    ? "Frozen"
                                    : transaction.status === 'completed' ? 'Done' : 'Pend'
                              ) : (
                                transaction.status === 'pending' && isFrozenExchange 
                                  ? "Frozen Exchange"
                                  : transaction.frozen_until
                                    ? `Frozen until ${transaction.frozen_until}`
                                    : transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)
                              )}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              <div 
                ref={loadingRef} 
                className="py-4 flex justify-center items-center"
              >
                {loading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="animate-spin w-3 h-3 xs:w-4 xs:h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    <span className="text-2xs xs:text-xs sm:text-sm">Loading more transactions...</span>
                  </div>
                ) : hasMore ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="px-2 h-7 xs:h-8 border-primary/20 text-2xs xs:text-xs"
                    onClick={fetchMoreTransactions}
                  >
                    <ChevronDown className="w-3 h-3 xs:w-4 xs:h-4 mr-1" /> 
                    <span className="text-2xs xs:text-xs sm:text-sm">Load More</span>
                  </Button>
                ) : (
                  <span className="text-2xs xs:text-xs sm:text-sm text-muted-foreground">No more transactions</span>
                )}
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-black/20 rounded-b-xl">
            <Filter className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm xs:text-base sm:text-lg font-medium mb-1">No transactions found</p>
            <p className="text-2xs xs:text-xs sm:text-sm text-muted-foreground/70 text-center px-4">
              {searchTerm || filterType ? "Try adjusting your filters" : "Your transaction history will appear here"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
