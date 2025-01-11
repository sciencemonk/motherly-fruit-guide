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
      <p>📱 Hello {firstName}, check your phone for a welcome message from Ducil!</p>
      
      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-semibold text-sage-800 mb-4">The Ducil Framework</h2>
        <p className="text-sage-600 mb-6">Our proven approach to mastering lucid dreaming</p>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div>
              <h3 className="font-medium text-sage-800">Awareness</h3>
              <p className="text-sm text-sage-600">Regular reality checks and dream journaling build your awareness of the dream state.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div>
              <h3 className="font-medium text-sage-800">Stabilization</h3>
              <p className="text-sm text-sage-600">Learn techniques to maintain lucidity and prevent premature awakening.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div>
              <h3 className="font-medium text-sage-800">Control</h3>
              <p className="text-sm text-sage-600">Master the ability to influence and direct your dreams consciously.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div>
              <h3 className="font-medium text-sage-800">Exploration</h3>
              <p className="text-sm text-sage-600">Unlock the full potential of your dreams for personal growth and creativity.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="font-medium text-sage-800">Access Your Dashboard</h3>
          <p className="text-sm text-sage-600">Enter the 6-digit code we sent to your phone to access your dashboard.</p>
          
          <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
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
    </div>
  );
}