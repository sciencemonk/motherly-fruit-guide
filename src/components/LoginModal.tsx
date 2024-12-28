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
      // First check if the code exists and is valid
      const { data: codes, error } = await supabase
        .from('verification_codes')
        .select('phone_number, expires_at')
        .eq('code', verificationCode)
        .eq('used', false)
        .maybeSingle()

      if (error) throw error

      // If no code found or code is expired
      if (!codes) {
        throw new Error('Code not found')
      }

      // Check if code is expired
      if (new Date(codes.expires_at) < new Date()) {
        throw new Error('Code has expired')
      }

      // Mark code as used
      const { error: updateError } = await supabase
        .from('verification_codes')
        .update({ used: true })
        .eq('code', verificationCode)

      if (updateError) throw updateError

      const { data, error: verifyError } = await supabase.functions.invoke('verify-code', {
        body: { 
          phone_number: codes.phone_number,
          code: verificationCode
        }
      })

      if (verifyError) throw verifyError

      if (data?.token) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          phone: codes.phone_number,
          password: data.token
        })

        if (signInError) throw signInError

        toast({
          title: "Success",
          description: "You have been logged in successfully"
        })
        
        // Close the modal first
        onClose()
        // Then navigate to dashboard
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error verifying code:', error)
      let errorMessage = "Invalid verification code. Please try again."
      
      if (error instanceof Error) {
        if (error.message === 'Code not found') {
          errorMessage = "Code not found. Please check and try again."
        } else if (error.message === 'Code has expired') {
          errorMessage = "This code has expired. Please request a new one."
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