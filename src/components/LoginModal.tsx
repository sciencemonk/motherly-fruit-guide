import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [phone, setPhone] = useState("");
  const [loginCode, setLoginCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        toast({
          title: "Login successful",
          description: "Welcome back to Morpheus!",
        });
        onClose();
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, onClose, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert loginCode to integer for database comparison
      const loginCodeInt = parseInt(loginCode, 10);
      
      if (isNaN(loginCodeInt)) {
        throw new Error("Invalid login code format");
      }

      // First, verify if the phone and login code combination exists
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("phone_number", phone)
        .eq("login_code", loginCodeInt)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (!profile) {
        toast({
          variant: "destructive",
          title: "Invalid credentials",
          description: "The phone number or login code you entered is incorrect.",
        });
        setIsLoading(false);
        return;
      }

      // If profile exists with matching login code, create a session
      const { error: signInError } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: false // Don't create a new user, just sign in existing one
        }
      });

      if (signInError) {
        throw signInError;
      }

    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred during login.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login to Morpheus</DialogTitle>
          <DialogDescription>
            Enter your phone number and login code to access your dashboard.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <PhoneInput
              international
              defaultCountry="US"
              value={phone}
              onChange={(value) => setPhone(value || "")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="loginCode">Login Code</Label>
            <Input
              id="loginCode"
              type="text"
              value={loginCode}
              onChange={(e) => setLoginCode(e.target.value)}
              placeholder="Enter your 6-digit code"
              maxLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}