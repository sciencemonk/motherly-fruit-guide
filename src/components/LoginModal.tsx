import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [phone, setPhone] = useState("")
  const [loginCode, setLoginCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // First, check if the phone number and login code combination exists
      const { data: profiles, error: queryError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone_number', phone)
        .eq('login_code', parseInt(loginCode))
        .single()

      if (queryError || !profiles) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid phone number or login code"
        })
        return
      }

      // If profile exists, create a session
      const { error: signInError } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          data: {
            phone_number: phone
          }
        }
      })

      if (signInError) {
        console.error("Login error:", signInError)
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "An error occurred during login"
        })
        return
      }

      // Success - close modal and redirect to dashboard
      toast({
        title: "Login successful",
        description: "Welcome back!"
      })
      onClose()
      navigate("/dashboard")

    } catch (error) {
      console.error("Login error:", error)
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An unexpected error occurred"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login to Morpheus</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="loginCode">Login Code</Label>
            <Input
              id="loginCode"
              type="number"
              placeholder="Enter your login code"
              value={loginCode}
              onChange={(e) => setLoginCode(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}