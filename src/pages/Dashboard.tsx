import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import Navbar from "@/components/Navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Gift, User } from "lucide-react"

const Dashboard = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [profile, setProfile] = useState<any>(null)
  const [firstName, setFirstName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [dueDate, setDueDate] = useState<Date>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    fetchProfile()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      navigate('/')
    }
  }

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone_number', session.user.phone)
        .single()

      if (error) throw error

      setProfile(data)
      setFirstName(data.first_name || '')
      setPhoneNumber(data.phone_number || '')
      setDueDate(data.due_date ? new Date(data.due_date) : undefined)
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          due_date: dueDate?.toISOString().split('T')[0]
        })
        .eq('phone_number', phoneNumber)

      if (error) throw error

      toast({
        title: "Success",
        description: "Your profile has been updated"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      })
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sage-50 to-sage-100">
        <Navbar />
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-sage-100">
      <Navbar />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Your Profile
              </CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input
                  value={phoneNumber}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Due Date</label>
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  className="rounded-md border"
                />
              </div>
            </CardContent>
          </Card>

          {/* Credits Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Chat Credits
              </CardTitle>
              <CardDescription>Your available chat credits and usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Available Credits</p>
                    <p className="text-2xl font-bold">{profile?.chat_credits || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Next reset on {new Date(profile?.last_credits_reset).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Premium Membership
              </CardTitle>
              <CardDescription>Access unlimited chat credits and exclusive features</CardDescription>
            </CardHeader>
            <CardContent>
              {profile?.is_premium ? (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg">
                  <p className="font-medium">Active Premium Member</p>
                  <p className="text-sm">You have access to all premium features</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Upgrade to premium for unlimited chat credits and exclusive features
                  </p>
                  <Button variant="outline" className="w-full">
                    Upgrade to Premium ($29/month)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={handleUpdate} className="flex-1">
              Save Changes
            </Button>
            <Button onClick={handleLogout} variant="outline" className="flex-1">
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard