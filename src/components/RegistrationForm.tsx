import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PregnancyReport } from "./PregnancyReport";

export function RegistrationForm() {
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !phone || !dueDate) {
      toast({
        variant: "destructive",
        title: "Please fill in all fields",
        description: "We need this information to support you during your pregnancy journey.",
      });
      return;
    }

    // Here we would handle the registration logic
    toast({
      title: "Welcome to Mother Athens!",
      description: "We're excited to be part of your pregnancy journey.",
    });
    
    setIsSubmitted(true);
  };

  if (isSubmitted && dueDate) {
    return <PregnancyReport dueDate={dueDate} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          placeholder="Enter your first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full bg-white/50 backdrop-blur-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="(555) 555-5555"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-white/50 backdrop-blur-sm"
        />
      </div>

      <div className="space-y-2">
        <Label>Due Date</Label>
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 flex justify-center">
          <Calendar
            mode="single"
            selected={dueDate}
            onSelect={setDueDate}
            className="w-full max-w-[400px]"
            initialFocus
          />
        </div>
      </div>

      <Button type="submit" className="w-full bg-sage-500 hover:bg-sage-600">
        Start My Journey
      </Button>
    </form>
  );
}