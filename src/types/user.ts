
export interface UserData {
  id: string;
  email: string;
  login: string;
  country: string;
  avatar_url: string | null;
  balance: string;
  wallet_address?: string;
  erc20_address?: string;
}
