import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { Link, useNavigate } from "react-router-dom"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  // Check if user is already authenticated
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        navigate('/dashboard')
      }
    }
    checkSession()
  }, [navigate])

  const handleVerifyCode = async () => {
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive"
      })
      return
    }

    if (!verificationCode || verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit code",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      // First verify the login code
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('phone_number', phoneNumber)
        .eq('login_code', verificationCode)
        .maybeSingle()

      if (profileError) throw profileError

      if (!profile) {
        toast({
          title: "Error",
          description: "Invalid phone number or verification code",
          variant: "destructive"
        })
        return
      }

      // Sign in the user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        phone: phoneNumber,
        password: verificationCode
      })

      if (signInError) {
        console.error('Sign in error:', signInError)
        throw signInError
      }

      if (!signInData.session) {
        throw new Error('No session created')
      }

      // Store the session
      localStorage.setItem('userPhoneNumber', phoneNumber)
      
      toast({
        title: "Success",
        description: "You have been logged in successfully"
      })
      
      onClose()
      navigate('/dashboard')
    } catch (error) {
      console.error('Error during login:', error)
      toast({
        title: "Error",
        description: "Failed to log in. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setVerificationCode("")
    setPhoneNumber("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log in to Morpheus</DialogTitle>
          <p className="text-sm text-sage-600 mt-2">
            Don't have an account? <Link to="/" onClick={handleClose} className="text-sage-800 hover:underline">Click here</Link> to get started.
          </p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-4">
            <div>
              <label htmlFor="phone" className="text-sm font-medium mb-2 block text-sage-700">
                Phone Number
              </label>
              <PhoneInput
                international
                defaultCountry="US"
                value={phoneNumber}
                onChange={setPhoneNumber as (value: string | undefined) => void}
                className="flex h-10 w-full rounded-md border border-sage-200 bg-white/80 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sage-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="code" className="text-sm font-medium mb-2 block text-sage-700">
                6-Digit Code
              </label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '')
                  if (value.length <= 6) {
                    setVerificationCode(value)
                  }
                }}
                maxLength={6}
                disabled={isLoading}
                className="bg-white/80 backdrop-blur-sm"
              />
            </div>
            <Button 
              onClick={handleVerifyCode}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}