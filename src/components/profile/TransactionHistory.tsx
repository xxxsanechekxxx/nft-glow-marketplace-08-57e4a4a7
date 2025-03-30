
import React, { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Filter, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Transaction } from "@/types/user";

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export const TransactionHistory = ({ transactions, isLoading = false }: TransactionHistoryProps) => {
  const [filter, setFilter] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  const filteredTransactions = filter 
    ? transactions.filter(tx => tx.type === filter)
    : transactions;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="transaction-type-icon text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="transaction-type-icon text-red-500" />;
      case 'exchange':
        return <RefreshCw className="transaction-type-icon text-blue-500" />;
      default:
        return <Clock className="transaction-type-icon text-gray-500" />;
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdraw';
      case 'exchange':
        return 'Exchange';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getStatusBadge = (status: string) => {
    let color = "";
    switch (status) {
      case 'completed':
        color = "bg-green-500/20 text-green-500 border border-green-500/30";
        break;
      case 'pending':
        color = "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30";
        break;
      case 'failed':
        color = "bg-red-500/20 text-red-500 border border-red-500/30";
        break;
      default:
        color = "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
    return (
      <Badge className={`transaction-status-badge px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getFormatAmount = (transaction: Transaction) => {
    const sign = transaction.type === 'deposit' ? '+' : transaction.type === 'withdrawal' ? '-' : '';
    const amount = `${sign}${transaction.amount}`;
    const currencySymbol = transaction.currency_type === 'usdt' ? '$' : 'Ξ';
    
    return (
      <span className={transaction.type === 'deposit' ? 'text-green-500' : transaction.type === 'withdrawal' ? 'text-red-500' : ''}>
        {amount} {currencySymbol}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Transaction History</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter(null)}
            className={`transaction-filter-button ${!filter ? 'bg-primary/10' : ''}`}
          >
            <Filter className="w-3.5 h-3.5 mr-1" />
            {!isMobile && <span>All</span>}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter('deposit')}
            className={`transaction-filter-button ${filter === 'deposit' ? 'bg-primary/10' : ''}`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5 mr-1" />
            {!isMobile && <span>Deposits</span>}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter('withdrawal')}
            className={`transaction-filter-button ${filter === 'withdrawal' ? 'bg-primary/10' : ''}`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
            {!isMobile && <span>Withdrawals</span>}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter('exchange')}
            className={`transaction-filter-button ${filter === 'exchange' ? 'bg-primary/10' : ''}`}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            {!isMobile && <span>Exchange</span>}
          </Button>
        </div>
      </div>

      <div className="transaction-table-container bg-primary/5 rounded-lg border border-primary/10 overflow-hidden">
        <Table className="transaction-table">
          <TableHeader>
            <TableRow>
              <TableHead className="date-column py-3 px-4">Date</TableHead>
              <TableHead className="type-column py-3 px-4">Type</TableHead>
              <TableHead className="amount-column py-3 px-4">Amount</TableHead>
              <TableHead className="status-column py-3 px-4">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(null).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="py-3 px-4"><Skeleton className="h-5 w-12" /></TableCell>
                  <TableCell className="py-3 px-4"><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell className="py-3 px-4"><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell className="py-3 px-4"><Skeleton className="h-5 w-16" /></TableCell>
                </TableRow>
              ))
            ) : filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="transaction-date py-3 px-4 text-xs">
                    {transaction.created_at}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <div className="transaction-type-cell flex items-center">
                      <div className={`transaction-type-badge p-1 rounded-full flex-shrink-0 ${
                        transaction.type === 'deposit' ? 'bg-green-500/20' : 
                        transaction.type === 'withdrawal' ? 'bg-red-500/20' : 
                        'bg-blue-500/20'
                      }`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      {!isMobile && (
                        <span className="transaction-type-label ml-1.5">
                          {getTransactionLabel(transaction.type)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="transaction-amount py-3 px-4 font-medium">
                    {getFormatAmount(transaction)}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    {getStatusBadge(transaction.status)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
