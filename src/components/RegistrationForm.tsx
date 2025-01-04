import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PregnancyReport } from "./PregnancyReport";
import { FormFields } from "./registration/FormFields";
import { ConsentCheckbox } from "./registration/ConsentCheckbox";
import { WelcomeMessage } from "./pregnancy-report/WelcomeMessage";
import { useRegistrationState } from "./registration/RegistrationState";
import { useRegistrationSubmit } from "./registration/useRegistrationSubmit";
import { addMonths } from "date-fns";

export function RegistrationForm() {
  const {
    firstName,
    setFirstName,
    phone,
    setPhone,
    dueDate,
    setDueDate,
    isSubmitted,
    setIsSubmitted,
    isLoading,
    setIsLoading,
    smsConsent,
    setSmsConsent,
    reportRef,
    welcomeRef
  } = useRegistrationState();

  const { handleSubmit } = useRegistrationSubmit();

  // Calculate the date range for due date selection
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  const maxDate = addMonths(today, 9);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit({
      firstName,
      phone,
      dueDate: dueDate!,
      smsConsent,
      setIsLoading,
      setIsSubmitted
    });

    // Scroll to the welcome message after a short delay to ensure it's rendered
    setTimeout(() => {
      welcomeRef.current?.scrollIntoView({ behavior: 'smooth' });
      // After showing the welcome message, scroll to the report
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 2000);
    }, 100);
  };

  // Add effect to scroll to top on page load/refresh
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {!isSubmitted ? (
        <form onSubmit={onSubmit} className="space-y-8 w-full max-w-md mx-auto">
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
        <div>
          <div ref={welcomeRef}>
            <WelcomeMessage firstName={firstName} />
          </div>
          <div ref={reportRef} className="mt-8">
            <PregnancyReport dueDate={dueDate!} firstName={firstName} />
          </div>
        </div>
      )}
    </div>
  );
}