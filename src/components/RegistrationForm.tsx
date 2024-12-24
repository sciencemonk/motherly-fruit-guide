import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { format, addMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { PregnancyReport } from "./PregnancyReport";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export function RegistrationForm() {
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  // Calculate the date range for due date selection
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  const maxDate = addMonths(today, 9);

  const sendWelcomeMessage = async (phoneNumber: string) => {
    try {
      const response = await fetch("https://xyzcompany.supabase.co/functions/v1/send-welcome-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: "Hello! I'm Mother Athena. Each week I'll text you an update about your current stage or pregnancy. You can also text me 24/7 with any pregnancy related questions. If you have an emergency or you might be in danger consult your healthcare professional!"
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send welcome message");
      }
    } catch (error) {
      console.error("Error sending welcome message:", error);
      toast({
        variant: "destructive",
        title: "Failed to send welcome message",
        description: "Don't worry, you're still registered! We'll try to reach you again soon.",
      });
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

    // Send welcome message
    await sendWelcomeMessage(phone);

    toast({
      title: "Welcome to Mother Athena!",
      description: "We're excited to be part of your pregnancy journey.",
    });
    
    setIsSubmitted(true);
  };

  if (isSubmitted && dueDate) {
    return <PregnancyReport dueDate={dueDate} firstName={firstName} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-md mx-auto">
      <div className="space-y-2">
        <Label htmlFor="firstName" className="text-sage-700 text-lg">First Name</Label>
        <Input
          id="firstName"
          placeholder="Enter your first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full bg-white/80 backdrop-blur-sm border-sage-200 focus:border-sage-400 focus:ring-sage-400 text-sage-800 placeholder:text-sage-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sage-700 text-lg">Phone Number</Label>
        <PhoneInput
          international
          defaultCountry="US"
          value={phone}
          onChange={setPhone as (value: string | undefined) => void}
          className="flex h-10 w-full rounded-md border border-sage-200 bg-white/80 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sage-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sage-700 text-lg">Due Date</Label>
        <div className="flex justify-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-sage-200">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              disabled={(date) => date < today || date > maxDate}
              className={cn(
                "mx-auto",
                "rounded-md",
                "[&_.rdp-day_focus]:bg-sage-50",
                "[&_.rdp-day_hover]:bg-sage-100",
                "[&_.rdp-day_active]:bg-sage-500",
                "[&_.rdp-day_active]:text-white",
                "[&_.rdp-day_selected]:bg-sage-500",
                "[&_.rdp-day_selected]:text-white",
                "[&_.rdp-head_cell]:text-sage-600",
                "[&_.rdp-caption_label]:text-sage-700",
                "[&_.rdp-nav_button]:hover:bg-sage-100",
                "[&_.rdp-nav_button]:active:bg-sage-200"
              )}
              initialFocus
            />
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-sage-200 hover:bg-sage-300 text-sage-800 font-semibold py-3 text-lg shadow-sm transition-all duration-200 ease-in-out hover:shadow-md"
      >
        Start My Journey
      </Button>
    </form>
  );
}