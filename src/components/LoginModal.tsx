import { useState } from "react";
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

      // Format phone number consistently by removing all non-digit characters
      const formattedPhone = phone.replace(/\D/g, '');
      console.log("Attempting login with formatted phone:", formattedPhone);

      // Verify if the phone and login code combination exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone_number', formattedPhone)
        .eq('login_code', loginCode)
        .maybeSingle();

      console.log("Profile lookup response:", { profile, error: profileError });

      if (profileError) {
        console.error('Profile lookup error:', profileError);
        throw new Error("Failed to verify credentials");
      }

      if (!profile) {
        console.log("No profile found for phone:", formattedPhone, "and code:", loginCode);
        toast({
          variant: "destructive",
          title: "Invalid Credentials",
          description: "The phone number or login code you entered is incorrect. Please try again.",
        });
        setIsLoading(false);
        return;
      }

      // Store the phone number in localStorage for dashboard access
      localStorage.setItem('userPhoneNumber', formattedPhone);
      
      toast({
        title: "Login Successful",
        description: "Welcome to Morpheus!",
      });
      
      onClose();
      navigate("/dashboard");

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