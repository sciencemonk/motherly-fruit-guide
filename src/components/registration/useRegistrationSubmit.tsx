import { useToast } from "@/hooks/use-toast";
import { sendWelcomeMessage } from "./utils/welcomeMessage";
import { createCheckoutSession } from "./utils/stripeCheckout";
import { handleProfileUpdate } from "./utils/profileManagement";

interface RegistrationData {
  firstName: string;
  phone: string;
  city: string;
  dueDate: Date;
  interests: string;
  lifestyle: string;
  smsConsent: boolean;
  setIsLoading: (loading: boolean) => void;
  setIsSubmitted: (submitted: boolean) => void;
}

export function useRegistrationSubmit() {
  const { toast } = useToast();

  const handleSubmit = async ({
    firstName,
    phone,
    city,
    dueDate,
    interests,
    lifestyle,
    smsConsent,
    setIsLoading,
    setIsSubmitted
  }: RegistrationData) => {
    if (!firstName || !phone || !city || !dueDate || !interests || !lifestyle) {
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
        title: "Consent Required",
        description: "Please agree to the terms to start your free trial.",
      });
      return;
    }

    setIsLoading(true);

    try {
      await handleProfileUpdate({
        firstName,
        phone,
        city,
        dueDate,
        interests,
        lifestyle
      });

      // Set submitted state before sending welcome message and creating checkout
      setIsSubmitted(true);

      // Send welcome message in the background
      sendWelcomeMessage(phone, firstName).catch(error => {
        console.error('Error sending welcome message:', error);
        toast({
          variant: "destructive",
          title: "Welcome message error",
          description: "There was a problem sending your welcome message, but your account was created successfully.",
        });
      });

      // Get the current origin for success/cancel URLs
      const origin = window.location.origin;
      const successUrl = `${origin}/?registration=success`;
      const cancelUrl = `${origin}/?registration=cancelled`;

      const checkoutData = await createCheckoutSession({
        phoneNumber: phone,
        trial: true,
        successUrl,
        cancelUrl
      });

      if (checkoutData?.url) {
        // Ensure the URL is properly formatted before redirecting
        const checkoutUrl = new URL(checkoutData.url);
        window.location.href = checkoutUrl.toString();
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Registration error",
        description: "There was a problem with your registration. Please try again.",
      });
      setIsLoading(false);
    }
  };

  return { handleSubmit };
}