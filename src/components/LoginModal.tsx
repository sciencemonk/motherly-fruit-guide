import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Link, useNavigate } from "react-router-dom"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

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
      // First, find the profile with this login code
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')  // Select all fields to get complete profile
        .eq('login_code', verificationCode.toUpperCase())
        .maybeSingle()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
        throw new Error('Error verifying code')
      }

      if (!profile) {
        throw new Error('Invalid code')
      }

      // Sign in directly with phone number and login code
      const { error: signInError } = await supabase.auth.signInWithPassword({
        phone: profile.phone_number,
        password: verificationCode.toUpperCase()  // Use the login code as the password
      })

      if (signInError) {
        console.error('Sign in error:', signInError)
        throw signInError
      }

      toast({
        title: "Success",
        description: "You have been logged in successfully"
      })
      
      // First navigate to dashboard
      navigate('/dashboard')
      // Then close the modal
      onClose()
    } catch (error) {
      console.error('Error verifying code:', error)
      let errorMessage = "Invalid verification code. Please check and try again."
      
      if (error instanceof Error) {
        if (error.message === 'Invalid code') {
          errorMessage = "Invalid code. Please check and try again."
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setVerificationCode("")
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
          <p className="text-sm text-sage-600 mt-2">
            Ask Mother Athena for your login code via text msg.
          </p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
              {isLoading ? "Verifying..." : "Log In"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}