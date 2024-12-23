import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { PregnancyReport } from "./PregnancyReport";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function RegistrationForm() {
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
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

    toast({
      title: "Welcome to Mother Athens!",
      description: "We're excited to be part of your pregnancy journey.",
    });
    
    setIsSubmitted(true);
  };

  const nextStep = () => {
    if (currentStep === 1 && !dueDate) {
      toast({
        variant: "destructive",
        title: "Please select your due date",
        description: "This helps us provide personalized information for your pregnancy journey.",
      });
      return;
    }
    if (currentStep === 2 && !firstName.trim()) {
      toast({
        variant: "destructive",
        title: "Please enter your first name",
        description: "We'd love to know what to call you!",
      });
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  if (isSubmitted && dueDate) {
    return <PregnancyReport dueDate={dueDate} />;
  }

  const progress = ((currentStep - 1) / 3) * 100;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <Progress value={progress} className="w-full h-2" />
      
      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in-0 slide-in-from-right-5">
            <h3 className="text-xl font-semibold text-sage-800">When is your due date?</h3>
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
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in-0 slide-in-from-right-5">
            <h3 className="text-xl font-semibold text-sage-800">What's your first name?</h3>
            <div className="space-y-2">
              <Input
                id="firstName"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in-0 slide-in-from-right-5">
            <h3 className="text-xl font-semibold text-sage-800">What's your mobile number?</h3>
            <div className="space-y-2">
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 555-5555"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between gap-4">
        {currentStep > 1 && (
          <Button
            type="button"
            onClick={prevStep}
            variant="outline"
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        
        {currentStep < 3 ? (
          <Button
            type="button"
            onClick={nextStep}
            className="flex-1 bg-sage-500 hover:bg-sage-600"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            type="submit"
            className="flex-1 bg-sage-500 hover:bg-sage-600"
          >
            Start My Journey
          </Button>
        )}
      </div>
    </form>
  );
}