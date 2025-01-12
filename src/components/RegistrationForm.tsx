import { useEffect, useState } from "react";
import { WelcomeMessage } from "./pregnancy-report/WelcomeMessage";
import { useRegistrationState } from "./registration/RegistrationState";
import { useRegistrationSubmit } from "./registration/useRegistrationSubmit";
import { RegistrationSteps } from "./registration/RegistrationSteps";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const totalSteps = 3;
  const navigate = useNavigate();
  const { toast } = useToast();

  const { handleSubmit } = useRegistrationSubmit();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        if (session?.user.email) {
          toast({
            title: "Successfully signed in",
            description: "Please complete your profile to continue",
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

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

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-sage-800 mb-6 text-center">Join Morpheus</h2>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#65a30d',
                  brandAccent: '#4d7c0f',
                }
              }
            }
          }}
          providers={['google']}
          redirectTo={window.location.origin}
        />
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
        <div ref={welcomeRef}>
          <WelcomeMessage firstName={firstName} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6 md:px-8">
      <RegistrationSteps
        currentStep={currentStep}
        totalSteps={totalSteps}
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
        onNext={handleNext}
        onBack={handleBack}
        onSubmit={onSubmit}
      />
    </div>
  );
}