import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface FormFieldsProps {
  firstName: string;
  setFirstName: (value: string) => void;
  phone: string;
  setPhone: (value: string | undefined) => void;
  dueDate: Date | undefined;
  setDueDate: (date: Date | undefined) => void;
  interests: string | undefined;
  setInterests: (value: string) => void;
  today: Date;
  maxDate: Date;
  isLoading: boolean;
  showOnlyBasicInfo?: boolean;
  showOnlyPregnancyInfo?: boolean;
}

export function FormFields({
  firstName,
  setFirstName,
  phone,
  setPhone,
  dueDate,
  setDueDate,
  interests,
  setInterests,
  today,
  maxDate,
  isLoading,
  showOnlyBasicInfo,
  showOnlyPregnancyInfo
}: FormFieldsProps) {
  const renderBasicInfo = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="firstName" className="text-sage-700 text-lg">First Name</Label>
        <Input
          id="firstName"
          placeholder="Enter your first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full bg-white/80 backdrop-blur-sm border-sage-200 focus:border-sage-400 focus:ring-sage-400 text-sage-800 placeholder:text-sage-400"
          disabled={isLoading}
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
          disabled={isLoading}
        />
      </div>
    </>
  );

  const renderPregnancyInfo = () => (
    <>
      <div className="space-y-2">
        <Label className="text-sage-700 text-lg">Due Date</Label>
        <div className="flex justify-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-sage-200">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              disabled={(date) => date < today || date > maxDate || isLoading}
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

      <div className="space-y-2">
        <Label htmlFor="interests" className="text-sage-700 text-lg">What interests you most about having a healthy baby?</Label>
        <Select value={interests} onValueChange={setInterests} disabled={isLoading}>
          <SelectTrigger className="w-full bg-white/80">
            <SelectValue placeholder="Select your main interest" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nutrition">Nutrition & Diet During Pregnancy</SelectItem>
            <SelectItem value="exercise">Safe Exercise & Physical Activity</SelectItem>
            <SelectItem value="development">Baby's Development Stages</SelectItem>
            <SelectItem value="mental-health">Mental Health & Emotional Wellbeing</SelectItem>
            <SelectItem value="preparation">Birth Preparation & Labor</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  if (showOnlyBasicInfo) {
    return renderBasicInfo();
  }

  if (showOnlyPregnancyInfo) {
    return renderPregnancyInfo();
  }

  return (
    <>
      {renderBasicInfo()}
      {renderPregnancyInfo()}
    </>
  );
}