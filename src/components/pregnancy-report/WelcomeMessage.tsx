import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WelcomeMessageProps {
  firstName: string;
}

export function WelcomeMessage({ firstName }: WelcomeMessageProps) {
  const [loginCode, setLoginCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDashboardAccess = async () => {
    if (!loginCode || loginCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the 6-digit code sent to your phone.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('login_code', loginCode)
        .single();

      if (error) throw error;

      if (data) {
        // Store the phone number in localStorage for dashboard access
        localStorage.setItem('userPhoneNumber', data.phone_number);
        navigate('/dashboard');
      } else {
        toast({
          title: "Invalid Code",
          description: "The code you entered is incorrect. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center text-sage-600 p-4 bg-sage-50 rounded-lg mb-6">
      <p className="text-xl mb-8">📱 Hello {firstName}, check your phone for a welcome message from Ducil!</p>
      
      <div className="max-w-sm mx-auto space-y-6">
        <div>
          <h3 className="font-medium text-sage-800 text-lg">Access Your Dashboard</h3>
          <p className="text-sm text-sage-600 mt-2">Enter the 6-digit code we sent to your phone to access your dashboard.</p>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <Input
            type="text"
            placeholder="Enter 6-digit code"
            value={loginCode}
            onChange={(e) => setLoginCode(e.target.value)}
            maxLength={6}
            className="text-center"
          />
          <Button
            onClick={handleDashboardAccess}
            disabled={isLoading || loginCode.length !== 6}
            className="w-full bg-sage-500 hover:bg-sage-600"
          >
            {isLoading ? "Verifying..." : "Access Dashboard"}
          </Button>
        </div>
      </div>
    </div>
  );
}