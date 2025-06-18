
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpCircle, Loader2, AlertCircle } from "lucide-react";
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
    
    // Basic Ethereum address validation
    if (!withdrawWalletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast({
        title: "Invalid wallet address",
        description: "Please enter a valid Ethereum wallet address",
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
    <div className="container mx-auto py-8 px-4 mt-16 min-h-screen">
      <div className="max-w-md mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/profile')}
          className="mb-6 pl-0 text-muted-foreground flex items-center gap-2 hover:bg-transparent hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to profile
        </Button>
        
        <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-gradient-to-b from-[#1A1F2C]/95 to-[#131925]/95 overflow-hidden">
          <div className="absolute inset-0 bg-destructive/5 rounded-lg pointer-events-none" />
          <CardHeader className="relative flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/20">
                  <ArrowUpCircle className="w-6 h-6 text-destructive" />
                </div>
                Withdraw
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Transfer funds to your wallet
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="relative pt-4">
            <form onSubmit={handleWithdraw} className="space-y-6">
              {isLoadingBalance ? (
                <div className="p-3 border border-primary/10 rounded-lg bg-primary/5 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading balance...</span>
                </div>
              ) : userData ? (
                <div className="p-3 border border-primary/10 rounded-lg bg-primary/5 flex justify-between">
                  <span className="text-muted-foreground">Available Balance:</span>
                  <span className="font-medium">{userData.balance} ETH</span>
                </div>
              ) : (
                <div className="p-3 border border-destructive/20 rounded-lg bg-destructive/5 flex items-center">
                  <AlertCircle className="h-4 w-4 text-destructive mr-2" />
                  <span className="text-sm">Failed to load balance</span>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-destructive/80">
                      Amount (ETH)
                    </label>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="h-auto py-0 px-1 text-xs text-destructive/70 hover:text-destructive"
                      onClick={() => userData && setWithdrawAmount(userData.balance)}
                    >
                      Max
                    </Button>
                  </div>
                  <div className="relative">
                    <Input 
                      type="number" 
                      step="0.0001" 
                      min="0.0001" 
                      value={withdrawAmount} 
                      onChange={e => setWithdrawAmount(e.target.value)} 
                      placeholder="Enter amount" 
                      className="bg-background/40 border-destructive/20 focus:border-destructive/40 focus-visible:ring-destructive/20 pr-16" 
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-destructive/80">
                      ETH
                    </span>
                  </div>
                </div>

                {withdrawAmount && parseFloat(withdrawAmount) > 0 && (
                  <div className="space-y-2 p-3 border border-primary/10 rounded-lg bg-primary/5 animate-in fade-in">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Withdrawal Amount:</span>
                      <span className="font-medium text-destructive/80">{withdrawAmount} ETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fee (2%):</span>
                      <span className="font-medium text-yellow-400">{calculateFee(withdrawAmount)} ETH</span>
                    </div>
                    <div className="h-px bg-primary/10 my-1"></div>
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-muted-foreground">You will receive:</span>
                      <span className="text-destructive/80">{calculateReceiveAmount(withdrawAmount)} ETH</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-destructive/80 flex items-center gap-1.5">
                    <ArrowUpCircle className="w-4 h-4" />
                    Wallet Address
                  </label>
                  <Input 
                    type="text" 
                    value={withdrawWalletAddress} 
                    onChange={e => setWithdrawWalletAddress(e.target.value)} 
                    placeholder="Enter your ETH wallet address" 
                    className="font-mono text-sm bg-background/40 border-destructive/20 focus:border-destructive/40 focus-visible:ring-destructive/20" 
                  />
                  <div className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-yellow-500" />
                    <p>Make sure to double-check the wallet address. Transactions cannot be reversed after submission.</p>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-destructive/20 hover:bg-destructive/30 text-destructive transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Withdrawal"
                  )}
                </Button>

                <div className="text-xs text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-yellow-500" />
                    <p>Withdrawal requests are processed manually and may take up to 24 hours to complete. If you need urgent assistance, please contact our support team.</p>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Withdraw;
