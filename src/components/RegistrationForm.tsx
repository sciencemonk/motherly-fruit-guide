import { useState } from "react"
import { StepIndicator } from "./registration/StepIndicator"
import { RegistrationSteps } from "./registration/RegistrationSteps"
import { Button } from "./ui/button"
import { Loader2 } from "lucide-react"
import { WelcomeMessage } from "./pregnancy-report/WelcomeMessage"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useRegistrationSubmit } from "./registration/RegistrationState"
import { useToast } from "@/hooks/use-toast"
import { DialogTitle } from "@/components/ui/dialog"

export function RegistrationForm() {
  const [searchParams] = useSearchParams()
  const registrationStatus = searchParams.get('registration')
  const phoneFromParams = searchParams.get('phone')
  const { toast } = useToast()
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(0)
  const [firstName, setFirstName] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [dueDate, setDueDate] = useState<Date>()
  const [interests, setInterests] = useState("")
  const [lifestyle, setLifestyle] = useState("")
  const [preferredTime, setPreferredTime] = useState("09:00")
  const [smsConsent, setSmsConsent] = useState(false)
  
  const { isLoading, isSubmitted, handleSubmit } = useRegistrationSubmit()

  const totalSteps = 7

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      console.log(`Moving to step ${currentStep + 1}`)
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      console.log(`Moving back to step ${currentStep - 1}`)
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dueDate) {
      toast({
        variant: "destructive",
        title: "Due date required",
        description: "Please select your due date to continue.",
      })
      return
    }

    console.log('Starting registration submission with data:', {
      firstName,
      phone,
      city,
      state,
      dueDate: dueDate.toISOString(),
      interests,
      lifestyle,
      preferredTime,
      smsConsent
    })

    try {
      await handleSubmit({
        firstName,
        phone,
        city,
        state,
        dueDate,
        interests,
        lifestyle,
        preferredTime,
        smsConsent
      })
      
      // Redirect to welcome page with necessary parameters
      navigate(`/welcome?phone=${encodeURIComponent(phone)}&firstName=${encodeURIComponent(firstName)}&registration=success`)
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "There was a problem with your registration. Please try again.",
      })
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
        return lifestyle?.length > 0
      case 5:
        return preferredTime?.length > 0
      case 6:
        return smsConsent === true
      default:
        return false
    }
  }

  if (isSubmitted || (registrationStatus === 'success' && phoneFromParams)) {
    console.log('Registration completed successfully, showing welcome message')
    return (
      <div className="space-y-6">
        <WelcomeMessage firstName={firstName} />
      </div>
    )
  }

  return (
    <div className="registration-form">
      <DialogTitle className="sr-only">Registration Form</DialogTitle>
      <form onSubmit={handleFormSubmit} className="space-y-6" aria-describedby="registration-form-description">
        <div id="registration-form-description" className="sr-only">
          Multi-step registration form for Mother Athena pregnancy support service
        </div>
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
              lifestyle={lifestyle}
              setLifestyle={setLifestyle}
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