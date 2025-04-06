
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { KeyRound, Mail, User, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Register = () => {
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

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!seedAccessAgreed || !seedTransferAgreed || !policyAgreed) {
        toast({
          title: "Error",
          description: "Please agree to all terms",
          variant: "destructive",
        });
        setIsLoading(false);
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
        
        navigate("/profile");
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

  // If user is already logged in, we'll see a blank page briefly during redirect
  // This could be improved with a loading state
  if (user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[150px] animate-[pulse_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[150px] animate-[pulse_8s_ease-in-out_infinite] delay-1000"></div>
      </div>

      <div className="sm:max-w-[425px] w-full p-8 rounded-2xl bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-xl border border-white/10 relative animate-fade-in shadow-xl z-10 max-h-[90vh] overflow-y-auto">
        <div className="mb-6 text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
          <p className="text-gray-400">
            Join us today and start your journey
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
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
              required
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
              required
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

          <div className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 h-11 font-medium"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
            
            <p className="text-sm text-center text-gray-400">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
