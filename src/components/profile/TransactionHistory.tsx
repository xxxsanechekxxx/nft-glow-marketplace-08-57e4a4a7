
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownCircle, ArrowUpCircle, ShoppingBag, ArrowRightLeft, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/types/user";

interface TransactionHistoryProps {
  transactions?: Transaction[];
}

export const TransactionHistory = ({ transactions: initialTransactions }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions || []);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const toggleSortOrder = async () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    if (!initialTransactions) {
      await fetchTransactions(newOrder);
    } else {
      // If transactions were provided as props, just sort them in-memory
      const sortedTransactions = [...transactions].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return newOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
      setTransactions(sortedTransactions);
    }
  };

  const fetchTransactions = async (order: 'desc' | 'asc' = sortOrder) => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: order === 'asc' })
        .limit(50);
      
      if (error) throw error;
      
      if (data) {
        const formattedTransactions = data.map(tx => {
          const dateObj = new Date(tx.created_at);
          const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
          
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
            status: tx.status,
            item: tx.item,
            frozen_until: formattedFrozenUntil,
            is_frozen: tx.is_frozen,
            is_frozen_exchange: tx.is_frozen_exchange,
            currency_type: tx.currency_type
          };
        });
        
        setTransactions(formattedTransactions);
      }
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialTransactions) {
      setTransactions(initialTransactions);
    } else {
      fetchTransactions();
    }
  }, [initialTransactions, user?.id]);

  return (
    <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-[#1A1F2C]/90">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <ArrowUpCircle className="w-6 h-6 rotate-45 text-primary" />
          </div>
          Transaction History
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleSortOrder}
          className="flex items-center gap-1 text-sm text-muted-foreground"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          {sortOrder === 'desc' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <Table className="transaction-table">
              <TableHeader>
                <TableRow className="hover:bg-primary/5">
                  <TableHead className="date-column">Date</TableHead>
                  <TableHead className="type-column text-center">Type</TableHead>
                  <TableHead className="amount-column">Amount</TableHead>
                  <TableHead className="status-column">Status</TableHead>
                  <TableHead className="currency-column">Currency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(transaction => {
                  // Check if this is a frozen exchange transaction
                  const isFrozenExchange = transaction.type === 'exchange' && (transaction.is_frozen || transaction.is_frozen_exchange);
                  
                  return (
                    <TableRow 
                      key={transaction.id} 
                      className={`hover:bg-primary/5 transition-colors ${
                        transaction.frozen_until ? 'bg-yellow-500/5' : 
                        isFrozenExchange ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      <TableCell className="date-column">{transaction.created_at}</TableCell>
                      <TableCell className="type-column text-center">
                        <div className="flex justify-center">
                          {transaction.type === 'deposit' && <ArrowDownCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                          {transaction.type === 'withdraw' && <ArrowUpCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                          {transaction.type === 'purchase' && <ShoppingBag className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                          {transaction.type === 'sale' && <ShoppingBag className="w-4 h-4 text-green-500 flex-shrink-0" />}
                          {transaction.type === 'exchange' && (
                            <ArrowRightLeft className={`w-4 h-4 ${isFrozenExchange ? 'text-amber-500' : 'text-blue-500'} flex-shrink-0`} />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="amount-column">
                        {Number(transaction.amount).toFixed(2)}
                      </TableCell>
                      <TableCell className="status-column">
                        <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                          transaction.status === 'completed' 
                            ? transaction.frozen_until 
                              ? 'bg-yellow-500/20 text-yellow-500' 
                              : 'bg-green-500/20 text-green-500' 
                            : transaction.status === 'pending' 
                              ? isFrozenExchange
                                ? 'bg-amber-500/20 text-amber-500'
                                : 'bg-yellow-500/20 text-yellow-500' 
                              : 'bg-red-500/20 text-red-500'
                        }`}>
                          {transaction.status === 'pending' && isFrozenExchange 
                            ? 'Frozen Exchange (Pending)' 
                            : transaction.frozen_until
                              ? 'Frozen'
                              : transaction.status}
                        </span>
                      </TableCell>
                      <TableCell className="currency-column">
                        <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                          transaction.currency_type === 'eth' 
                            ? 'bg-blue-500/20 text-blue-300' 
                            : transaction.currency_type === 'usdt'
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-gray-500/20 text-gray-300'
                        }`}>
                          {transaction.currency_type?.toUpperCase() || 'ETH'}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {isLoading ? 'Loading transactions...' : 'No transactions found'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
