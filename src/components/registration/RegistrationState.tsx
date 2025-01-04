import { useState, useRef } from "react";

export function useRegistrationState() {
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [interests, setInterests] = useState("");
  const [lifestyle, setLifestyle] = useState("");
  const [preferredTime, setPreferredTime] = useState("10:00");
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
    city,
    setCity,
    state,
    setState,
    interests,
    setInterests,
    lifestyle,
    setLifestyle,
    preferredTime,
    setPreferredTime,
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