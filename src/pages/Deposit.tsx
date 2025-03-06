
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowDownCircle, Copy, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

const Deposit = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [depositAmount, setDepositAmount] = useState("");
  const [step, setStep] = useState(1);
  const [walletAddress, setWalletAddress] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchWalletAddress = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('wallet_address')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        
        if (data && data.wallet_address) {
          setWalletAddress(data.wallet_address);
        }
      } catch (error) {
        console.error("Error fetching wallet address:", error);
      }
    };

    fetchWalletAddress();
  }, [user, navigate]);

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const handleSubmitAmount = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(depositAmount);
    if (!depositAmount || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid amount greater than 0"
      });
      return;
    }

    setStep(2);
  };

  const handleSubmitTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionHash) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a transaction hash"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user?.id,
            type: 'deposit',
            amount: parseFloat(depositAmount),
            status: 'pending',
            transaction_hash: transactionHash
          }
        ]);

      if (error) throw error;

      toast({
        title: "Deposit Requested",
        description: `Your deposit request for ${depositAmount} ETH has been submitted for verification`
      });
      
      navigate("/profile");
    } catch (error) {
      console.error("Error submitting deposit:", error);
      toast({
        title: "Error",
        description: "Failed to process deposit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 mt-16 min-h-screen bg-gradient-to-b from-background via-background/80 to-background/60">
      <div className="max-w-2xl mx-auto">
        <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-[#1A1F2C]/90">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <ArrowDownCircle className="w-6 h-6 text-green-500" />
              </div>
              Deposit Funds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 ? (
              <form onSubmit={handleSubmitAmount} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Wallet Address</label>
                  <div className="relative">
                    <Input
                      value={walletAddress || "No wallet address generated"}
                      readOnly
                      className="bg-background/50 font-mono text-sm border-primary/10 pr-10"
                    />
                    {walletAddress && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                        onClick={handleCopyAddress}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {!walletAddress && (
                    <p className="text-sm text-red-500 mt-2">
                      You need to generate a wallet address in your profile first.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount (ETH)</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    required
                    disabled={!walletAddress}
                    className="bg-background/50 border-primary/10"
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/profile")}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-500"
                    disabled={!walletAddress}
                  >
                    Continue
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmitTransaction} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Transaction Amount</label>
                  <div className="flex items-center p-3 bg-background/50 border border-primary/10 rounded">
                    <span className="font-medium">{depositAmount} ETH</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Transaction Hash</label>
                  <Input
                    type="text"
                    placeholder="0x..."
                    value={transactionHash}
                    onChange={(e) => setTransactionHash(e.target.value)}
                    required
                    className="bg-background/50 border-primary/10 font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the transaction hash from your wallet after sending the ETH
                  </p>
                </div>

                <div className="pt-4 flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-500"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Submit Deposit"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Deposit;
