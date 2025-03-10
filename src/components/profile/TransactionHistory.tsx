
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownCircle, ArrowUpCircle, ShoppingBag, ArrowRightLeft } from "lucide-react";
import type { Transaction } from "@/types/user";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  return (
    <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-[#1A1F2C]/90">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <ArrowUpCircle className="w-6 h-6 rotate-45 text-primary" />
          </div>
          Transaction History
        </CardTitle>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(transaction => {
                  // Check if this is a frozen exchange transaction
                  const isFrozenExchange = transaction.type === 'exchange' && transaction.is_frozen;
                  
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
                            : transaction.status}
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
            No transactions found
          </div>
        )}
      </CardContent>
    </Card>
  );
};
