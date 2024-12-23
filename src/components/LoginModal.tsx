import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const { toast } = useToast()

  const handleSendCode = async () => {
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber}`
      const { error } = await supabase.functions.invoke('send-verification-code', {
        body: { phone_number: formattedPhone }
      })

      if (error) throw error

      setIsVerifying(true)
      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleVerifyCode = async () => {
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber}`
      const { data, error } = await supabase.functions.invoke('verify-code', {
        body: { 
          phone_number: formattedPhone,
          code: verificationCode
        }
      })

      if (error) throw error

      if (data?.token) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          phone: formattedPhone,
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
      toast({
        title: "Error",
        description: "Invalid verification code. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log in to Mother Athena</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!isVerifying ? (
            <>
              <div className="grid gap-2">
                <Input
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Button onClick={handleSendCode}>Send Code</Button>
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-2">
                <Input
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                />
                <Button onClick={handleVerifyCode}>Verify Code</Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}