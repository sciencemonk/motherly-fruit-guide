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
      const { data: codes } = await supabase
        .from('verification_codes')
        .select('phone_number')
        .eq('code', verificationCode)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single()

      if (!codes?.phone_number) {
        throw new Error('Invalid or expired code')
      }

      const { error: updateError } = await supabase
        .from('verification_codes')
        .update({ used: true })
        .eq('code', verificationCode)

      if (updateError) throw updateError

      const { data, error } = await supabase.functions.invoke('verify-code', {
        body: { 
          phone_number: codes.phone_number,
          code: verificationCode
        }
      })

      if (error) throw error

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
        navigate('/dashboard')
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