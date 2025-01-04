import { useState } from "react"
import { StepIndicator } from "./registration/StepIndicator"
import { RegistrationSteps } from "./registration/RegistrationSteps"
import { Button } from "./ui/button"
import { Loader2 } from "lucide-react"
import { WelcomeMessage } from "./pregnancy-report/WelcomeMessage"
import { useSearchParams } from "react-router-dom"
import { useRegistrationSubmit } from "./registration/RegistrationState"

export function RegistrationForm() {
  const [searchParams] = useSearchParams()
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
  
  const { isLoading, isSubmitted, handleSubmit } = useRegistrationSubmit()

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dueDate) return

    await handleSubmit({
      firstName,
      phone,
      city,
      state,
      dueDate,
      interests,
      preferredTime,
      smsConsent
    })
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

  if (isSubmitted || (registrationStatus === 'success' && phoneFromParams)) {
    return (
      <div className="space-y-6">
        <WelcomeMessage firstName={firstName} />
      </div>
    )
  }

  return (
    <div className="registration-form">
      <form onSubmit={handleFormSubmit} className="space-y-6">
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