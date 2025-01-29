import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AuthModalProps {
  trigger: React.ReactNode;
}

export const AuthModal = ({ trigger }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [login, setLogin] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("");
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { login: loginUser, register, isLoading } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateLogin = (login: string) => {
    return login.length >= 3;
  };

  const validateNickname = (nickname: string) => {
    return nickname.length >= 2;
  };

  const validateBirthDate = (birthDate: string) => {
    if (!birthDate) return false;
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    const age = today.getFullYear() - birthDateObj.getFullYear();
    return age >= 18;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin) {
      if (!validateEmail(email)) {
        toast({
          title: "Error",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        return;
      }

      if (!validatePassword(password)) {
        toast({
          title: "Error",
          description: "Password must be at least 8 characters long",
          variant: "destructive",
        });
        return;
      }

      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }

      if (!validateLogin(login)) {
        toast({
          title: "Error",
          description: "Login must be at least 3 characters long",
          variant: "destructive",
        });
        return;
      }

      if (!validateNickname(nickname)) {
        toast({
          title: "Error",
          description: "Nickname must be at least 2 characters long",
          variant: "destructive",
        });
        return;
      }

      if (!validateBirthDate(birthDate)) {
        toast({
          title: "Error",
          description: "You must be at least 18 years old to register",
          variant: "destructive",
        });
        return;
      }

      if (!country) {
        toast({
          title: "Error",
          description: "Please select your country",
          variant: "destructive",
        });
        return;
      }

      if (!policyAgreed) {
        toast({
          title: "Error",
          description: "You must agree to the website policy to register",
          variant: "destructive",
        });
        return;
      }

      try {
        await register({
          email,
          password,
          login,
          nickname,
          birthDate,
          country,
        });
        setIsOpen(false);
      } catch (error) {
        // Error is handled in the register function
      }
    } else {
      try {
        await loginUser(email, password);
        setIsOpen(false);
      } catch (error) {
        // Error is handled in the login function
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isLogin ? "Login" : "Registration"}</DialogTitle>
          <DialogDescription>
            {isLogin 
              ? "Sign in to your account" 
              : "Create a new account"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>

          {!isLogin && (
            <>
              <div className="space-y-2">
                <label htmlFor="login" className="text-sm font-medium">
                  Login
                </label>
                <Input
                  id="login"
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Enter your login"
                  required={!isLogin}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="nickname" className="text-sm font-medium">
                  Nickname
                </label>
                <Input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Choose a nickname"
                  required={!isLogin}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="birthDate" className="text-sm font-medium">
                  Birth Date
                </label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required={!isLogin}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium">
                  Country
                </label>
                <Select value={country} onValueChange={setCountry} required>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="ru">Russia</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="es">Spain</SelectItem>
                    <SelectItem value="it">Italy</SelectItem>
                    <SelectItem value="jp">Japan</SelectItem>
                    <SelectItem value="cn">China</SelectItem>
                    <SelectItem value="in">India</SelectItem>
                    <SelectItem value="br">Brazil</SelectItem>
                    <SelectItem value="mx">Mexico</SelectItem>
                    <SelectItem value="ar">Argentina</SelectItem>
                    <SelectItem value="kr">South Korea</SelectItem>
                    <SelectItem value="sg">Singapore</SelectItem>
                    <SelectItem value="ae">United Arab Emirates</SelectItem>
                    <SelectItem value="za">South Africa</SelectItem>
                    <SelectItem value="se">Sweden</SelectItem>
                    <SelectItem value="no">Norway</SelectItem>
                    <SelectItem value="nz">New Zealand</SelectItem>
                    <SelectItem value="pl">Poland</SelectItem>
                    <SelectItem value="tr">Turkey</SelectItem>
                    <SelectItem value="eg">Egypt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required={!isLogin}
              />
            </div>
          )}

          {!isLogin && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="policy" 
                checked={policyAgreed}
                onCheckedChange={(checked) => setPolicyAgreed(checked as boolean)}
              />
              <label
                htmlFor="policy"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the website policy and terms of service
              </label>
            </div>
          )}

          <div className="flex flex-col space-y-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Sign In" : "Register"}
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm"
              disabled={isLoading}
            >
              {isLogin 
                ? "Don't have an account? Register" 
                : "Already have an account? Sign In"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};