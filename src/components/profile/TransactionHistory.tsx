
import React from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowUpRight, ArrowDownLeft, RotateCw, ShoppingCart, Tag } from "lucide-react";
import type { Transaction } from "@/types/user";

// Function to determine status color and text
const getStatusDetails = (status: string, isFrozen: boolean, isFrozenExchange: boolean) => {
  if (isFrozen || isFrozenExchange) {
    return {
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      text: "Frozen"
    };
  }
  
  switch (status) {
    case "completed":
      return {
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
        text: "Completed"
      };
    case "pending":
      return {
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        text: "Pending"
      };
    case "cancelled":
      return {
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        text: "Cancelled"
      };
    default:
      return {
        color: "text-gray-500",
        bgColor: "bg-gray-500/10",
        borderColor: "border-gray-500/20",
        text: status.charAt(0).toUpperCase() + status.slice(1)
      };
  }
};

// Function to determine transaction type icon and label
const getTypeDetails = (type: string) => {
  switch (type) {
    case "deposit":
      return {
        icon: <ArrowDownLeft className="h-4 w-4 text-green-500" />,
        label: "Deposit",
        color: "text-green-500"
      };
    case "withdrawal":
      return {
        icon: <ArrowUpRight className="h-4 w-4 text-red-500" />,
        label: "Withdrawal",
        color: "text-red-500"
      };
    case "exchange":
      return {
        icon: <RotateCw className="h-4 w-4 text-blue-500" />,
        label: "Exchange",
        color: "text-blue-500"
      };
    case "purchase":
      return {
        icon: <ShoppingCart className="h-4 w-4 text-purple-500" />,
        label: "Purchase",
        color: "text-purple-500"
      };
    case "sale":
      return {
        icon: <Tag className="h-4 w-4 text-amber-500" />,
        label: "Sale",
        color: "text-amber-500"
      };
    default:
      return {
        icon: <RotateCw className="h-4 w-4 text-gray-500" />,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        color: "text-gray-500"
      };
  }
};

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  const isMobile = useIsMobile();
  
  if (!transactions || transactions.length === 0) {
    return (
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium mb-2 text-white/90">Transaction History</h3>
      <div className="overflow-hidden rounded-lg border border-primary/20 bg-white/5">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-primary/10 hover:bg-transparent">
                <TableHead className="w-20 text-xs font-medium">Date</TableHead>
                <TableHead className="text-xs font-medium">Type</TableHead>
                <TableHead className="text-xs font-medium text-right">Amount</TableHead>
                <TableHead className="text-xs font-medium text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map(transaction => {
                const typeDetails = getTypeDetails(transaction.type);
                const statusDetails = getStatusDetails(
                  transaction.status,
                  transaction.is_frozen,
                  transaction.is_frozen_exchange
                );
                
                return (
                  <TableRow key={transaction.id} className="border-primary/10">
                    <TableCell className="py-2 text-xs text-white/80">{transaction.created_at}</TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-1.5">
                        {typeDetails.icon}
                        <span className={`text-xs ${typeDetails.color}`}>
                          {typeDetails.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-right">
                      <span className={`text-xs font-medium ${transaction.type === 'deposit' || transaction.type === 'sale' ? 'text-green-500' : transaction.type === 'withdrawal' || transaction.type === 'purchase' ? 'text-red-500' : 'text-white/80'}`}>
                        {transaction.type === 'deposit' || transaction.type === 'sale' ? '+' : transaction.type === 'withdrawal' || transaction.type === 'purchase' ? '-' : ''}
                        {parseFloat(transaction.amount).toFixed(transaction.currency_type === 'eth' ? 3 : 2)} {transaction.currency_type === 'eth' ? '' : 'USDT'}
                      </span>
                    </TableCell>
                    <TableCell className="py-2 text-right">
                      <div className="flex justify-end">
                        <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${statusDetails.bgColor} ${statusDetails.color} border ${statusDetails.borderColor}`}>
                          {statusDetails.text}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
