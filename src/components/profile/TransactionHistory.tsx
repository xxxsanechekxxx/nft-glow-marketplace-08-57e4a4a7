
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownCircle, ArrowUpCircle, ShoppingBag, ArrowRightLeft, Clock, Calendar, Search, Filter, ChevronDown } from "lucide-react";
import type { Transaction } from "@/types/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export const TransactionHistory = ({ transactions: initialTransactions }: TransactionHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTransactions(initialTransactions);
  }, [initialTransactions]);

  const fetchMoreTransactions = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    try {
      // Important: We need to store the original created_at timestamp in the transaction object
      // rather than just the formatted date for pagination purposes
      const lastTransaction = transactions[transactions.length - 1];
      
      let query = supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      // Apply the appropriate filter based on whether we're filtering by type
      if (filterType) {
        query = query.eq('type', filterType);
      }
      
      // Use the last transaction's ID to paginate
      if (transactions.length > 0) {
        query = query.lt('created_at', lastTransaction.raw_created_at || lastTransaction.created_at);
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
            raw_created_at: tx.created_at, // Store the original timestamp for pagination
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
    
    setLoading(true);
    
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
            raw_created_at: tx.created_at, // Store the original timestamp
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
      }
    } catch (error) {
      console.error("Error fetching deposits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Observer for infinite scrolling
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
  }, [hasMore, loading, transactions]);

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
        return <ArrowDownCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />;
      case 'withdraw':
        return <ArrowUpCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />;
      case 'purchase':
        return <ShoppingBag className="w-5 h-5 text-blue-500 flex-shrink-0" />;
      case 'sale':
        return <ShoppingBag className="w-5 h-5 text-emerald-500 flex-shrink-0" />;
      case 'exchange':
        return <ArrowRightLeft className={`w-5 h-5 ${isFrozenExchange ? 'text-amber-500' : 'text-indigo-500'} flex-shrink-0`} />;
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

  return (
    <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-[#1A1F2C]/90 mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          Transaction History
        </CardTitle>
        
        <div className="flex items-center gap-2">
          <div className="relative w-48">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 bg-background/50 border-primary/20 focus:border-primary/50"
            />
          </div>
          
          <div className="flex">
            <Button 
              variant="outline" 
              size="sm" 
              className={`px-3 h-9 border-primary/20 ${filterType === null ? 'bg-primary/20 text-primary' : 'bg-background/50'}`}
              onClick={() => setFilterType(null)}
            >
              All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className={`px-3 h-9 border-primary/20 ${filterType === 'deposit' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-background/50'}`}
              onClick={() => {
                if (filterType === 'deposit') {
                  setFilterType(null);
                } else {
                  loadMoreDeposits();
                }
              }}
            >
              <ArrowDownCircle className="w-4 h-4 mr-1" /> Deposits
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className={`px-3 h-9 border-primary/20 ${filterType === 'exchange' ? 'bg-indigo-500/20 text-indigo-500' : 'bg-background/50'}`}
              onClick={() => setFilterType(filterType === 'exchange' ? null : 'exchange')}
            >
              <ArrowRightLeft className="w-4 h-4 mr-1" /> Exchanges
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {filteredTransactions.length > 0 ? (
          <ScrollArea className="h-[400px] pr-1">
            <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              <Table className="transaction-table">
                <TableHeader>
                  <TableRow className="hover:bg-primary/5 border-b border-primary/10">
                    <TableHead className="text-muted-foreground font-medium">Date</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Type</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Amount</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map(transaction => {
                    // Check if this is a frozen exchange transaction
                    const isFrozenExchange = transaction.type === 'exchange' && (transaction.is_frozen || transaction.is_frozen_exchange);
                    
                    return (
                      <TableRow 
                        key={transaction.id} 
                        className={`transition-colors border-b border-primary/5 hover:bg-primary/5 animate-fade-in ${
                          transaction.frozen_until ? 'bg-yellow-500/5' : 
                          isFrozenExchange ? 'bg-amber-500/5' : ''
                        }`}
                      >
                        <TableCell className="py-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>{transaction.created_at}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-full ${
                              transaction.type === 'deposit' ? 'bg-emerald-500/10' :
                              transaction.type === 'withdraw' ? 'bg-rose-500/10' : 
                              transaction.type === 'purchase' ? 'bg-blue-500/10' :
                              transaction.type === 'sale' ? 'bg-emerald-500/10' :
                              isFrozenExchange ? 'bg-amber-500/10' : 'bg-indigo-500/10'
                            }`}>
                              {getTypeIcon(transaction.type, isFrozenExchange)}
                            </div>
                            <span className="font-medium">
                              {isFrozenExchange ? 'Frozen Exchange' : getTypeLabel(transaction.type)}
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell className="font-medium">
                          <span className={`${
                            transaction.type === 'deposit' || transaction.type === 'sale' ? 'text-emerald-500' :
                            transaction.type === 'withdraw' || transaction.type === 'purchase' ? 'text-rose-500' :
                            'text-indigo-500'
                          }`}>
                            {transaction.type === 'deposit' || transaction.type === 'sale' ? '+' : 
                             transaction.type === 'withdraw' || transaction.type === 'purchase' ? '-' : ''}
                            {Number(transaction.amount).toFixed(2)}
                          </span>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
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
                              {transaction.status === 'pending' && isFrozenExchange 
                                ? 'Frozen Exchange' 
                                : transaction.frozen_until
                                  ? `Frozen until ${transaction.frozen_until}`
                                  : transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
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
                    <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    Loading more transactions...
                  </div>
                ) : hasMore ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="px-3 h-9 border-primary/20"
                    onClick={fetchMoreTransactions}
                  >
                    <ChevronDown className="w-4 h-4 mr-1" /> Load More
                  </Button>
                ) : (
                  <span className="text-sm text-muted-foreground">No more transactions</span>
                )}
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-black/20 rounded-b-xl">
            <Filter className="w-12 h-12 text-muted-foreground/50 mb-3" />
            <p className="text-lg font-medium mb-1">No transactions found</p>
            <p className="text-sm text-muted-foreground/70">
              {searchTerm || filterType ? "Try adjusting your filters" : "Your transaction history will appear here"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

