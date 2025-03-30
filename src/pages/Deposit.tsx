import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Loader2, HelpCircle, ExternalLink, ArrowLeft, ArrowDownCircle, Copy, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

const Deposit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<'amount' | 'hash'>('amount');
  const [depositAmount, setDepositAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const walletAddress = "0xc68c825191546453e36aaa005ebf10b5219ce175";

  const validateHash = (hash: string) => {
    if (hash.length < 10) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid hash, please check your input"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateHash(transactionHash)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { error } = await supabase
        .from('transactions')
        .insert([{
          user_id: user?.id,
          type: 'deposit',
          amount: parseFloat(depositAmount),
          status: 'pending',
          wallet_address: walletAddress,
          hash: transactionHash
        }]);
      
      if (error) throw error;
      
      toast({
        title: "Deposit Requested",
        description: `Your deposit request for ${depositAmount} ETH has been submitted`,
        variant: "default"
      });
      
      navigate('/profile');
    } catch (error) {
      console.error("Error processing deposit:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = () => {
    const amount = parseFloat(depositAmount);
    if (!depositAmount || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid amount greater than 0"
      });
      return;
    }
    setStep('hash');
  };

  const handleCancel = (shouldResetTimer: boolean = false) => {
    if (shouldResetTimer) {
      localStorage.removeItem('countdownEndTime');
    }
    navigate('/profile');
  };

  const handleTelegramHelp = () => {
    window.open('https://t.me/purenftsupport', '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast({
      title: "Address copied to clipboard",
      description: "You can now paste it into your wallet"
    });
    setTimeout(() => setCopied(false), 2000);
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
          <div className="absolute inset-0 bg-green-500/5 rounded-lg pointer-events-none" />
          <CardHeader className="relative flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <ArrowDownCircle className="w-6 h-6 text-green-500" />
                </div>
                Deposit
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Add funds to your wallet
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-6 pt-4">
            {step === 'amount' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-green-400/90">
                      Amount (ETH)
                    </label>
                    <span className="text-xs text-muted-foreground">
                      Min: 0.0001 ETH
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.0001"
                      min="0.0001"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="bg-background/40 border-green-500/20 focus:border-green-500/40 focus-visible:ring-green-500/20 pr-16"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-green-400">
                      ETH
                    </span>
                  </div>
                </div>

                {parseFloat(depositAmount) > 0 && (
                  <div className="p-3 border border-primary/10 rounded-lg bg-primary/5 space-y-1 animate-in fade-in">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Deposit Amount:</span>
                      <span className="font-medium text-green-400">{depositAmount} ETH</span>
                    </div>
                    <div className="h-px bg-primary/10 my-1"></div>
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-muted-foreground">You'll receive:</span>
                      <span className="text-green-400">{parseFloat(depositAmount) > 0 ? parseFloat(depositAmount).toFixed(4) : '0.0000'} ETH</span>
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-500 transition-colors" 
                  onClick={handleNextStep}
                >
                  Continue
                </Button>
              </div>
            ) : (
              <>
                <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                  <p className="text-center text-sm text-green-400 font-medium">
                    Request created for {depositAmount} ETH
                  </p>
                  
                  <div className="mt-3 bg-green-950/30 rounded-lg p-2">
                    <div className="flex justify-between items-center text-xs text-green-300/80">
                      <span>Time remaining</span>
                      <span>Complete deposit before timer ends</span>
                    </div>
                    <div className="mt-1">
                      <CountdownTimer endTime={new Date(new Date().getTime() + 30 * 60000).toISOString()} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mt-4">
                  <h3 className="font-medium text-green-400/90 flex items-center gap-2">
                    <ArrowDownCircle className="h-4 w-4" />
                    Send ETH to this address
                  </h3>
                  <div className="bg-green-950/20 p-4 rounded-md border border-green-500/20 hover:border-green-500/40 transition-colors group">
                    <div className="flex justify-between items-center">
                      <div className="break-all font-mono text-primary/80 text-sm">
                        {walletAddress}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={copyToClipboard}
                        className="ml-2 h-8 w-8 text-primary/60 hover:text-green-500 hover:bg-green-500/10 group-hover:bg-green-500/10 group-hover:text-green-400"
                      >
                        {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="mt-2 text-xs text-green-400/60 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      ERC-20 Network Only
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 text-yellow-500 mt-0.5" />
                      <p>If you have already transferred Ethereum, but the timer has expired, the funds will be credited back to your original wallet.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-green-400/90">
                      Transaction Hash
                    </label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-primary/60" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm bg-background/95 backdrop-blur-sm border-primary/20">
                          <p>This is the transaction ID. After successful withdrawal of funds from another wallet, you will need to provide a confirmation with the number that appears in the other wallet.</p>
                          <Button 
                            variant="link" 
                            className="mt-2 h-auto p-0 text-green-400"
                            onClick={handleTelegramHelp}
                          >
                            I need help <ExternalLink className="ml-1 h-3 w-3" />
                          </Button>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    value={transactionHash}
                    onChange={(e) => setTransactionHash(e.target.value)}
                    placeholder="Enter transaction hash"
                    className="font-mono bg-background/40 border-green-500/20 focus:border-green-500/40 focus-visible:ring-green-500/20"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    className="flex-1 bg-background/40 border-primary/20 hover:bg-primary/10 text-primary/90"
                    onClick={() => handleCancel(true)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-500" 
                    onClick={handleSubmit}
                    disabled={!transactionHash || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Confirm'
                    )}
                  </Button>
                </div>

                <div className="text-center mt-2">
                  <Button
                    variant="link"
                    className="text-green-400 h-auto p-0 hover:text-green-500"
                    onClick={handleTelegramHelp}
                  >
                    Need help? <ExternalLink className="ml-0.5 h-3 w-3" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Deposit;
