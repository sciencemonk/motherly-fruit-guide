import { useState, useEffect } from "react"
import { StepIndicator } from "./registration/StepIndicator"
import { RegistrationSteps } from "./registration/RegistrationSteps"
import { Button } from "./ui/button"
import { Loader2 } from "lucide-react"
import { WelcomeMessage } from "./pregnancy-report/WelcomeMessage"
import { useSearchParams } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export function RegistrationForm() {
  const [searchParams] = useSearchParams()
  const { toast } = useToast()
  const registrationStatus = searchParams.get('registration')
  const phoneFromParams = searchParams.get('phone')

  const [currentStep, setCurrentStep] = useState(0)
  const [firstName, setFirstName] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [dueDate, setDueDate] = useState<Date>()
  const [interests, setInterests] = useState("")
  const [preferredTime, setPreferredTime] = useState("09:00")
  const [smsConsent, setSmsConsent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (registrationStatus === 'success' && phoneFromParams) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('phone_number', decodeURIComponent(phoneFromParams))
            .single()

          if (error) throw error

          setFirstName(data.first_name)
          setDueDate(new Date(data.due_date))
          setIsSubmitted(true)

          // Send welcome message using handle-sms function
          const response = await supabase.functions.invoke('handle-sms', {
            body: {
              From: process.env.TWILIO_PHONE_NUMBER,
              To: decodeURIComponent(phoneFromParams),
              Body: `Hi ${data.first_name}! I'm Mother Athena and I'm here to help you grow a healthy baby. I'll send you a message each day along this magical journey. If you ever have a question, like can I eat this?!, just send me a message!\n\nA big part of having a successful pregnancy is to relax... so right now take a deep breath in and slowly exhale. You've got this! ❤️`
            }
          })

          if (response.error) throw response.error

          toast({
            title: "Welcome to Mother Athena!",
            description: "Please check your phone for your first message.",
          })
        } catch (error) {
          console.error('Error:', error)
          toast({
            variant: "destructive",
            title: "Error",
            description: "There was a problem sending your welcome message.",
          })
        }
      }
    }

    fetchProfile()
  }, [registrationStatus, phoneFromParams, toast])

  const totalSteps = 6

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dueDate) return
    setIsLoading(true)

    try {
      // Create new profile with trial status
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          phone_number: phone,
          first_name: firstName,
          city,
          state,
          due_date: dueDate.toISOString(),
          interests,
          preferred_notification_time: preferredTime,
          subscription_status: 'trial',
          trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })

      if (insertError) throw insertError

      // Redirect to welcome page with phone parameter
      window.location.href = `/welcome?phone=${encodeURIComponent(phone)}&registration=success`
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        variant: "destructive",
        title: "Registration error",
        description: "There was a problem with your registration. Please try again.",
      })
      setIsLoading(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return firstName?.length > 0 && phone?.length > 0
      case 1:
        return city?.length > 0 && state?.length > 0
      case 2:
        return dueDate !== undefined
      case 3:
        return interests?.length > 0
      case 4:
        return preferredTime?.length > 0
      case 5:
        return smsConsent === true
      default:
        return false
    }
  }

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <WelcomeMessage firstName={firstName} />
      </div>
    )
  }

  return (
    <div className="registration-form">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-content">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
          <div className="flex-1">
            <RegistrationSteps
              currentStep={currentStep}
              firstName={firstName}
              setFirstName={setFirstName}
              phone={phone}
              setPhone={setPhone}
              city={city}
              setCity={setCity}
              state={state}
              setState={setState}
              dueDate={dueDate}
              setDueDate={setDueDate}
              interests={interests}
              setInterests={setInterests}
              preferredTime={preferredTime}
              setPreferredTime={setPreferredTime}
              smsConsent={smsConsent}
              setSmsConsent={setSmsConsent}
            />
          </div>
          <div className="flex justify-between mt-6">
            {currentStep > 0 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            {currentStep < totalSteps - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid() || isLoading}
                className={`${currentStep === 0 ? 'w-full' : 'ml-auto'}`}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!isStepValid() || isLoading}
                className="ml-auto bg-peach-500 hover:bg-peach-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Start Free Trial"
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}