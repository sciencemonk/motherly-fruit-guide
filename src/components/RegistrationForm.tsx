import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addMonths } from "date-fns";
import { PregnancyReport } from "./PregnancyReport";
import { supabase } from "@/integrations/supabase/client";
import { FormFields } from "./registration/FormFields";
import { ConsentCheckbox } from "./registration/ConsentCheckbox";

export function RegistrationForm() {
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);

  // Calculate the date range for due date selection
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  const maxDate = addMonths(today, 9);

  const sendWelcomeMessage = async (phoneNumber: string) => {
    try {
      console.log('Sending welcome message to:', phoneNumber);
      
      const { data, error } = await supabase.functions.invoke('send-welcome-sms', {
        body: {
          to: phoneNumber,
          message: `Hello ${firstName}! I'm Mother Athena. Each week I'll text you an update about your current stage of pregnancy. You can also text me 24/7 with any pregnancy related questions. If you have an emergency or you might be in danger consult your healthcare professional!`
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Welcome message response:', data);
      return data;
    } catch (error) {
      console.error("Error sending welcome message:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !phone || !dueDate) {
      toast({
        variant: "destructive",
        title: "Please fill in all fields",
        description: "We need this information to support you during your pregnancy journey.",
      });
      return;
    }

    if (!smsConsent) {
      toast({
        variant: "destructive",
        title: "SMS Consent Required",
        description: "Please agree to receive text messages to continue.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // First check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('phone_number', phone)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking existing profile:', fetchError);
        throw fetchError;
      }

      if (existingProfile) {
        toast({
          variant: "destructive",
          title: "Phone number already registered",
          description: "This phone number is already registered. Please use a different phone number or log in to your existing account.",
        });
        setIsLoading(false);
        return;
      }

      // Insert new profile if phone number doesn't exist
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            phone_number: phone,
            first_name: firstName,
            due_date: dueDate.toISOString().split('T')[0],
          }
        ]);

      if (insertError) {
        // Double-check for race condition where profile might have been created between our check and insert
        if (insertError.code === '23505') { // Unique constraint violation
          toast({
            variant: "destructive",
            title: "Phone number already registered",
            description: "This phone number is already registered. Please use a different phone number or log in to your existing account.",
          });
          setIsLoading(false);
          return;
        }
        console.error('Error storing profile:', insertError);
        throw insertError;
      }

      // Send welcome message
      await sendWelcomeMessage(phone);

      toast({
        title: "Welcome to Mother Athena!",
        description: "We're excited to be part of your pregnancy journey.",
      });
      
      setIsSubmitted(true);
      
      // Scroll to the report section after a short delay to ensure it's rendered
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Registration error",
        description: "There was a problem with your registration. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add effect to scroll to top on page load/refresh
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-md mx-auto">
          <FormFields
            firstName={firstName}
            setFirstName={setFirstName}
            phone={phone}
            setPhone={setPhone}
            dueDate={dueDate}
            setDueDate={setDueDate}
            today={today}
            maxDate={maxDate}
            isLoading={isLoading}
          />

          <ConsentCheckbox
            smsConsent={smsConsent}
            setSmsConsent={setSmsConsent}
            isLoading={isLoading}
          />

          <Button 
            type="submit" 
            className="w-full bg-peach-300 hover:bg-peach-400 text-peach-900 font-semibold py-3 text-lg shadow-sm transition-all duration-200 ease-in-out hover:shadow-md"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Start My Journey"}
          </Button>
        </form>
      ) : (
        <div ref={reportRef}>
          <PregnancyReport dueDate={dueDate!} firstName={firstName} />
        </div>
      )}
    </div>
  );
}