import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Clock } from "lucide-react";

interface BasicInfoStepProps {
  firstName: string;
  setFirstName: (value: string) => void;
  phone: string;
  setPhone: (value: string | undefined) => void;
  isLoading: boolean;
  onNext: () => void;
}

export function BasicInfoStep({
  firstName,
  setFirstName,
  phone,
  setPhone,
  isLoading,
  onNext
}: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-sage-800 mb-2">Welcome to Ducil</h2>
        <p className="text-sage-600 mb-6">Enter your details to begin your lucid dreaming journey.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sage-700">First Name</Label>
          <Input
            id="firstName"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full bg-white/80 backdrop-blur-sm border-sage-200 focus:border-sage-400 focus:ring-sage-400"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sage-700">Phone Number</Label>
          <PhoneInput
            international
            defaultCountry="US"
            value={phone}
            onChange={setPhone}
            className="flex h-10 w-full rounded-md border border-sage-200 bg-white/80 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sage-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          />
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!firstName || !phone || isLoading}
        className="w-full bg-sage-500 hover:bg-sage-600 text-white font-semibold py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}