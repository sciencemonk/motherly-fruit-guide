export interface RegistrationData {
  firstName: string;
  phone: string;
  dueDate: Date;
  lastPeriod?: Date;
  city: string;
  state: string;
  interests: string;
  lifestyle: string;
  preferredTime: string;
  smsConsent: boolean;
  pregnancyStatus: string;
  setIsLoading: (loading: boolean) => void;
  setIsSubmitted: (submitted: boolean) => void;
}