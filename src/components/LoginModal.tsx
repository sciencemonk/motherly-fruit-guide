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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === 'SIGNED_IN' && session) {
        onClose();
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, onClose]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!phone || !loginCode) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please enter both your phone number and login code.",
        });
        setIsLoading(false);
        return;
      }

      // First, verify if the phone and login code combination exists
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("phone_number", phone)
        .eq("login_code", loginCode);

      if (profileError) {
        console.error("Profile lookup error:", profileError);
        throw new Error("Failed to verify credentials");
      }

      if (!profiles || profiles.length === 0) {
        toast({
          variant: "destructive",
          title: "Invalid Credentials",
          description: "The phone number or login code you entered is incorrect. Please try again.",
        });
        setIsLoading(false);
        return;
      }

      // Sign in with phone number as email
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: `${phone.replace(/\+/g, '')}@morpheus.app`,
        password: loginCode,
      });

      if (signInError) {
        // If user doesn't exist in auth, create one
        if (signInError.message.includes("Invalid login credentials")) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: `${phone.replace(/\+/g, '')}@morpheus.app`,
            password: loginCode,
            options: {
              data: {
                phone_number: phone,
              },
            },
          });

          if (signUpError) {
            throw signUpError;
          }

          if (signUpData.session) {
            onClose();
            navigate("/dashboard");
          }
        } else {
          throw signInError;
        }
      } else if (signInData.session) {
        onClose();
        navigate("/dashboard");
      }

      toast({
        title: "Login Successful",
        description: "Welcome to Morpheus!",
      });

    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="login-form-description">
        <DialogHeader>
          <DialogTitle>Login to Morpheus</DialogTitle>
          <DialogDescription id="login-form-description">
            Enter your phone number and login code to access your dashboard.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <PhoneInput
              id="phone"
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
              autoComplete="one-time-code"
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