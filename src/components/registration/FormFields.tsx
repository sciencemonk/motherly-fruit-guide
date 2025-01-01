import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface FormFieldsProps {
  firstName: string;
  setFirstName: (value: string) => void;
  phone: string;
  setPhone: (value: string | undefined) => void;
}

export function FormFields({
  firstName,
  setFirstName,
  phone,
  setPhone,
}: FormFieldsProps) {
  return (
    <>
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
          onChange={setPhone}
          className="flex h-10 w-full rounded-md border border-sage-200 bg-white/80 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sage-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </>
  );
}