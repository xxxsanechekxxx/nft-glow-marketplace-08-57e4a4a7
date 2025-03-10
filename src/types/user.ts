
export interface FrozenBalanceInfo {
  amount: number;
  days_left: number;
  unfreeze_date: string;
  transaction_id: string;
}

export interface TransactionTotals {
  total_deposits: number;
  total_withdrawals: number;
}

export interface UserData {
  id: string;
  email: string;
  login: string;
  country: string;
  avatar_url: string | null;
  balance: string;
  usdt_balance: string;
  frozen_balance: string;
  frozen_usdt_balance: string;
  wallet_address?: string;
  erc20_address?: string;
  created_at: string;
  verified: boolean;
  kyc_status?: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'purchase' | 'sale' | 'exchange';
  amount: string;
  created_at: string;
  status: 'pending' | 'completed' | 'failed';
  item?: string;
  frozen_until?: string;
}
