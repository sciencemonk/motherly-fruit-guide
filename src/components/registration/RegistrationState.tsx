import { useState, useRef } from "react";

export function useRegistrationState() {
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);

  return {
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
  };
}