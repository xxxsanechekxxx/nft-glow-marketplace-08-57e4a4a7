
export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'purchase';
  amount: string;
  created_at: string;
  status: 'pending' | 'completed' | 'failed';
  item?: string;
}
