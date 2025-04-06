import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { KeyRound, Mail, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AuthModalProps {
  trigger: React.ReactNode;
}

export const AuthModal = ({ trigger }: AuthModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [login, setLogin] = useState("");
  const [country, setCountry] = useState("");
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [seedAccessAgreed, setSeedAccessAgreed] = useState(false);
  const [seedTransferAgreed, setSeedTransferAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user && isOpen) {
      setIsOpen(false);
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        
        setIsOpen(false);
        navigate("/profile");
      } else {
        if (password !== confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive",
          });
          return;
        }

        if (!seedAccessAgreed || !seedTransferAgreed || !policyAgreed) {
          toast({
            title: "Error",
            description: "Please agree to all terms",
            variant: "destructive",
          });
          return;
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              login,
              country,
            }
          },
        });

        if (signUpError) throw signUpError;

        if (signUpData.user) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) throw signInError;

          toast({
            title: "Success",
            description: "Registration successful! You are now logged in.",
          });
          
          setIsOpen(false);
          navigate("/profile");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      {!user && (
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] md:max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-xl border border-white/10 relative">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {isLogin ? "Welcome Back" : "Create Account"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {isLogin 
                ? "Sign in to access your account" 
                : "Join us today and start your journey"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pb-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="bg-white/5 border-white/10 focus:border-primary/50 text-white"
                required
              />
            </div>

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label htmlFor="login" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username
                  </label>
                  <Input
                    id="login"
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="Choose your username"
                    className="bg-white/5 border-white/10 focus:border-primary/50 text-white"
                    required={!isLogin}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="country" className="text-sm font-medium text-gray-300">
                    Country
                  </label>
                  <Select value={country} onValueChange={setCountry} required>
                    <SelectTrigger id="country" className="bg-white/5 border-white/10 focus:border-primary/50 text-white">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-900/90 border-white/10 text-white">
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="Russia">Russia</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Spain">Spain</SelectItem>
                      <SelectItem value="Italy">Italy</SelectItem>
                      <SelectItem value="Japan">Japan</SelectItem>
                      <SelectItem value="China">China</SelectItem>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="Brazil">Brazil</SelectItem>
                      <SelectItem value="Mexico">Mexico</SelectItem>
                      <SelectItem value="Argentina">Argentina</SelectItem>
                      <SelectItem value="South Korea">South Korea</SelectItem>
                      <SelectItem value="Singapore">Singapore</SelectItem>
                      <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
                      <SelectItem value="South Africa">South Africa</SelectItem>
                      <SelectItem value="Sweden">Sweden</SelectItem>
                      <SelectItem value="Norway">Norway</SelectItem>
                      <SelectItem value="New Zealand">New Zealand</SelectItem>
                      <SelectItem value="Poland">Poland</SelectItem>
                      <SelectItem value="Turkey">Turkey</SelectItem>
                      <SelectItem value="Egypt">Egypt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/5 border-white/10 focus:border-primary/50 text-white"
                required
              />
            </div>

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <KeyRound className="w-4 h-4" />
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-white/5 border-white/10 focus:border-primary/50 text-white"
                    required={!isLogin}
                  />
                </div>

                <div className="space-y-4 rounded-lg bg-white/5 p-4 border border-white/10">
                  <h4 className="text-sm font-medium text-gray-300">Additional agreements</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor="seed-access" className="text-sm text-gray-400 leading-none flex-1 mr-4">
                        I agree that only I have access to the seed and keys. If the seed is lost, access to accounts cannot be restored
                      </label>
                      <Switch
                        id="seed-access"
                        checked={seedAccessAgreed}
                        onCheckedChange={setSeedAccessAgreed}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label htmlFor="seed-transfer" className="text-sm text-gray-400 leading-none flex-1 mr-4">
                        I agree that when transferring the seed to third parties, I may lose all my accounts
                      </label>
                      <Switch
                        id="seed-transfer"
                        checked={seedTransferAgreed}
                        onCheckedChange={setSeedTransferAgreed}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label htmlFor="policy" className="text-sm text-gray-400 leading-none flex-1 mr-4">
                        I agree to the website policy and terms of service
                      </label>
                      <Switch
                        id="policy"
                        checked={policyAgreed}
                        onCheckedChange={setPolicyAgreed}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 h-11 font-medium"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-gray-400 hover:text-white"
              >
                {isLogin 
                  ? "Don't have an account? Register" 
                  : "Already have an account? Sign In"}
              </Button>
            </div>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
};
