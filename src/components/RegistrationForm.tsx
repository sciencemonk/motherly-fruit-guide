import { useEffect, useState } from "react";
import { WelcomeMessage } from "./pregnancy-report/WelcomeMessage";
import { useRegistrationState } from "./registration/RegistrationState";
import { useRegistrationSubmit } from "./registration/useRegistrationSubmit";
import { RegistrationSteps } from "./registration/RegistrationSteps";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PhoneInput from 'react-phone-number-input';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import 'react-phone-number-input/style.css';

export function RegistrationForm() {
  const {
    firstName,
    setFirstName,
    phone,
    setPhone,
    wakeTime,
    setWakeTime,
    sleepTime,
    setSleepTime,
    isSubmitted,
    setIsSubmitted,
    isLoading,
    setIsLoading,
    smsConsent,
    setSmsConsent,
    reportRef,
    welcomeRef
  } = useRegistrationState();

  const [currentStep, setCurrentStep] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { handleSubmit } = useRegistrationSubmit();

  const handleSendCode = async () => {
    if (!phone) {
      toast({
        variant: "destructive",
        title: "Phone number required",
        description: "Please enter your phone number to continue."
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-verification-code', {
        body: { phone_number: phone }
      });

      if (error) throw error;

      setShowCodeInput(true);
      toast({
        title: "Code sent!",
        description: "Please check your phone for the verification code."
      });
    } catch (error) {
      console.error('Error sending code:', error);
      toast({
        variant: "destructive",
        title: "Error sending code",
        description: "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast({
        variant: "destructive",
        title: "Code required",
        description: "Please enter the verification code sent to your phone."
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('verify-code', {
        body: { phone_number: phone, code: verificationCode }
      });

      if (error) throw error;

      setCurrentStep(1);
    } catch (error) {
      console.error('Error verifying code:', error);
      toast({
        variant: "destructive",
        title: "Invalid code",
        description: "Please check the code and try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async () => {
    await handleSubmit({
      firstName,
      phone,
      wakeTime,
      sleepTime,
      smsConsent,
      setIsLoading,
      setIsSubmitted
    });

    setTimeout(() => {
      welcomeRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 2000);
    }, 100);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isSubmitted) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
        <div ref={welcomeRef}>
          <WelcomeMessage firstName={firstName} />
        </div>
      </div>
    );
  }

  if (currentStep === 0) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-sage-800 mb-6 text-center">Join Morpheus</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <PhoneInput
              international
              defaultCountry="US"
              value={phone}
              onChange={(value) => setPhone(value || "")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading || showCodeInput}
            />
          </div>
          
          {showCodeInput ? (
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                disabled={isLoading}
              />
              <Button 
                className="w-full mt-4" 
                onClick={handleVerifyCode}
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </div>
          ) : (
            <Button 
              className="w-full mt-4" 
              onClick={handleSendCode}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Code"}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6 md:px-8">
      <RegistrationSteps
        currentStep={currentStep - 1}
        totalSteps={3}
        formData={{
          firstName,
          phone,
          wakeTime,
          sleepTime,
          smsConsent
        }}
        setters={{
          setFirstName,
          setPhone,
          setWakeTime,
          setSleepTime,
          setSmsConsent
        }}
        isLoading={isLoading}
        onNext={() => setCurrentStep(prev => prev + 1)}
        onBack={() => setCurrentStep(prev => prev - 1)}
        onSubmit={onSubmit}
      />
    </div>
  );
}