import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { Link } from "react-router-dom"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSendCode = async () => {
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.functions.invoke('send-verification-code', {
        body: { phone_number: phoneNumber }
      })

      if (error) throw error

      setIsVerifying(true)
      toast({
        title: "Success",
        description: "Verification code sent to your phone"
      })
    } catch (error) {
      console.error('Error sending code:', error)
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast({
        title: "Error",
        description: "Please enter the verification code",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('verify-code', {
        body: { 
          phone_number: phoneNumber,
          code: verificationCode
        }
      })

      if (error) throw error

      if (data?.token) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          phone: phoneNumber,
          password: data.token
        })

        if (signInError) throw signInError

        toast({
          title: "Success",
          description: "You have been logged in successfully"
        })
        onClose()
      }
    } catch (error) {
      console.error('Error verifying code:', error)
      toast({
        title: "Error",
        description: "Invalid verification code. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setIsVerifying(false)
    setVerificationCode("")
    setPhoneNumber("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log in to Mother Athena</DialogTitle>
          <p className="text-sm text-sage-600 mt-2">
            Don't have an account? <Link to="/" onClick={handleClose} className="text-sage-800 hover:underline">Click here</Link> to get started.
          </p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!isVerifying ? (
            <div className="grid gap-2">
              <PhoneInput
                international
                defaultCountry="US"
                value={phoneNumber}
                onChange={setPhoneNumber as (value: string | undefined) => void}
                className="flex h-10 w-full rounded-md border border-sage-200 bg-white/80 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sage-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendCode} 
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Code"}
              </Button>
            </div>
          ) : (
            <div className="grid gap-2">
              <Input
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                disabled={isLoading}
              />
              <Button 
                onClick={handleVerifyCode}
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}