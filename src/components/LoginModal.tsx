import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showCodeInput, setShowCodeInput] = useState(false)

  const handleSendCode = async () => {
    if (!phone) {
      toast({
        variant: "destructive",
        title: "Phone number required",
        description: "Please enter your phone number to continue."
      })
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.functions.invoke('send-verification-code', {
        body: { phone_number: phone }
      })

      if (error) throw error

      setShowCodeInput(true)
      toast({
        title: "Code sent!",
        description: "Please check your phone for the verification code."
      })
    } catch (error) {
      console.error('Error sending code:', error)
      toast({
        variant: "destructive",
        title: "Error sending code",
        description: "Please try again later."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!code) {
      toast({
        variant: "destructive",
        title: "Code required",
        description: "Please enter the verification code sent to your phone."
      })
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('verify-code', {
        body: { phone_number: phone, code }
      })

      if (error) throw error

      toast({
        title: "Login successful",
        description: "Welcome back!"
      })
      onClose()
      navigate("/dashboard")
    } catch (error) {
      console.error('Error verifying code:', error)
      toast({
        variant: "destructive",
        title: "Invalid code",
        description: "Please check the code and try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to Morpheus</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <PhoneInput
              international
              defaultCountry="US"
              value={phone}
              onChange={(value) => setPhone(value || "")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading || showCodeInput}
            />
          </div>
          
          {showCodeInput ? (
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter verification code"
                disabled={isLoading}
              />
              <Button 
                className="w-full mt-4" 
                onClick={handleVerifyCode}
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </div>
          ) : (
            <Button 
              className="w-full mt-4" 
              onClick={handleSendCode}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Code"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}