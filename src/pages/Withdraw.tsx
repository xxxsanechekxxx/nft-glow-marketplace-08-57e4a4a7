
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpCircle, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

const Withdraw = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawWalletAddress, setWithdrawWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<{balance: string} | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoadingBalance(true);
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('balance')
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        setUserData({
          balance: profileData?.balance?.toString() || "0.0"
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch balance data",
          variant: "destructive"
        });
      } finally {
        setIsLoadingBalance(false);
      }
    };
    
    fetchUserData();
  }, [user, toast]);

  // Enhanced Ethereum address validation function
  const isValidEthereumAddress = (address: string): boolean => {
    // Ethereum addresses are 42 characters long (including the '0x' prefix)
    // and contain only hexadecimal characters (0-9, a-f, A-F)
    if (!address) return false;
    
    // Case insensitive regex match
    return /^0x[0-9a-f]{40}$/i.test(address);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmountNum = parseFloat(withdrawAmount);
    const balanceNum = parseFloat(userData?.balance || "0");
    
    if (withdrawAmountNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }
    
    if (withdrawAmountNum > balanceNum) {
      toast({
        title: "Insufficient funds",
        description: `Your balance (${balanceNum} ETH) is less than the requested withdrawal amount`,
        variant: "destructive"
      });
      return;
    }
    
    if (!withdrawWalletAddress) {
      toast({
        title: "Error",
        description: "Please enter a wallet address for the withdrawal",
        variant: "destructive"
      });
      return;
    }
    
    // Improved Ethereum address validation
    if (!isValidEthereumAddress(withdrawWalletAddress)) {
      toast({
        title: "Invalid wallet address",
        description: "Please enter a valid Ethereum wallet address (0x followed by 40 hexadecimal characters)",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create a withdrawal transaction in Supabase
      // Store wallet address in 'item' field since there's no dedicated 'wallet_address' column
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          user_id: user?.id,
          type: 'withdraw',
          amount: withdrawAmountNum,
          status: 'pending',
          item: withdrawWalletAddress // Store wallet address in the 'item' field
        }]);
      
      if (error) throw error;
      
      toast({
        title: "Withdrawal Requested",
        description: `Your withdrawal request for ${withdrawAmount} ETH has been submitted`,
        variant: "default"
      });
      
      // Navigate back to profile page after successful submission
      navigate('/profile');
    } catch (error) {
      console.error("Error submitting withdrawal:", error);
      toast({
        title: "Error",
        description: "Failed to process withdrawal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateFee = (amount: string) => {
    const amountNum = parseFloat(amount) || 0;
    return (amountNum * 0.02).toFixed(4); // 2% fee
  };

  const calculateReceiveAmount = (amount: string) => {
    const amountNum = parseFloat(amount) || 0;
    const feeAmount = amountNum * 0.02;
    return (amountNum - feeAmount).toFixed(4);
  };

  return (
    <div className="container mx-auto py-16 px-4 mt-8 min-h-screen">
      <div className="max-w-lg mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/profile')}
          className="mb-8 pl-0 text-primary flex items-center gap-2 hover:bg-transparent hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to profile
        </Button>
        
        <div className="relative">
          {/* Background glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-xl blur-md opacity-75"></div>
          
          <Card className="border-none shadow-2xl relative bg-gradient-to-b from-background to-background/95 overflow-hidden backdrop-blur-sm">
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/50 via-purple-500/50 to-primary/50"></div>
            
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#9b87f510_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
            
            <CardHeader className="relative pb-2">
              <div className="flex flex-row items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center shadow-inner">
                  <ArrowUpCircle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    Withdraw Funds
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Transfer ETH to your external wallet
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="relative pt-4">
              <form onSubmit={handleWithdraw} className="space-y-6">
                {isLoadingBalance ? (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/10 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-3 text-primary" />
                    <span className="text-primary/80 font-medium">Loading your balance...</span>
                  </div>
                ) : userData ? (
                  <div className="p-5 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/10 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground mb-1">Available Balance</span>
                      <span className="text-2xl font-bold text-white">{userData.balance} <span className="text-primary">ETH</span></span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 flex items-center">
                    <AlertCircle className="h-5 w-5 text-destructive mr-3" />
                    <span className="text-sm text-destructive">We couldn't load your balance. Please try again.</span>
                  </div>
                )}
                
                <div className="space-y-6 pt-2">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-primary/90 flex items-center gap-1.5">
                        Amount to Withdraw
                      </label>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="h-auto py-0 px-2 text-xs text-primary/80 hover:text-primary hover:bg-primary/5"
                        onClick={() => userData && setWithdrawAmount(userData.balance)}
                        disabled={isLoadingBalance || !userData}
                      >
                        Use Max Amount
                      </Button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-md blur-sm opacity-50"></div>
                      <div className="relative">
                        <Input 
                          type="number" 
                          step="0.0001" 
                          min="0.0001" 
                          value={withdrawAmount} 
                          onChange={e => setWithdrawAmount(e.target.value)} 
                          placeholder="Enter ETH amount" 
                          className="bg-background border-primary/20 focus:border-primary/50 pr-16 text-lg transition-all"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-primary/80">
                          ETH
                        </span>
                      </div>
                    </div>
                  </div>

                  {withdrawAmount && parseFloat(withdrawAmount) > 0 && (
                    <div className="space-y-2 p-4 rounded-xl bg-gradient-to-r from-background/60 to-background/40 border border-primary/10 animate-in fade-in">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Withdrawal Amount:</span>
                        <span className="font-medium text-white">{withdrawAmount} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fee (2%):</span>
                        <span className="font-medium text-yellow-400">{calculateFee(withdrawAmount)} ETH</span>
                      </div>
                      <div className="h-px bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 my-2"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">You will receive:</span>
                        <span className="text-lg font-bold text-white">{calculateReceiveAmount(withdrawAmount)} ETH</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-primary/90 flex items-center gap-1.5">
                      Wallet Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-md blur-sm opacity-50"></div>
                      <Input 
                        type="text" 
                        value={withdrawWalletAddress} 
                        onChange={e => setWithdrawWalletAddress(e.target.value)} 
                        placeholder="0x..." 
                        className="font-mono text-sm bg-background border-primary/20 focus:border-primary/50 transition-all"
                      />
                    </div>
                    <div className="text-xs text-muted-foreground flex items-start gap-1.5 px-1">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-yellow-500" />
                      <p>Double-check your wallet address carefully. Transactions cannot be reversed after submission.</p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-destructive/50 to-red-500/50 rounded-md blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
                      <Button 
                        type="submit" 
                        className="relative w-full py-6 bg-gradient-to-r from-destructive/80 to-red-500/80 text-white font-medium text-lg hover:from-destructive hover:to-red-500 transition-all shadow-lg hover:shadow-destructive/20 group"
                        disabled={isLoading || isLoadingBalance || !userData}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Confirm Withdrawal
                            <ArrowUpCircle className="ml-2 h-5 w-5 group-hover:translate-y-[-2px] transition-transform" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-yellow-500" />
                      <div>
                        <p className="font-medium text-sm text-white mb-1">Processing Time</p>
                        <p>Withdrawal requests are typically processed within 24 hours. For urgent assistance, please contact our support team.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
