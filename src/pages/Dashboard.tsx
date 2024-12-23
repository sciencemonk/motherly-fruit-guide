import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import Navbar from "@/components/Navbar"

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
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-sage-100">
      <Navbar />
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
          
          <div className="space-y-6">
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

            <div>
              <label className="block text-sm font-medium mb-2">Premium Membership</label>
              {profile?.is_premium ? (
                <p className="text-green-600">Active Premium Member</p>
              ) : (
                <Button variant="outline" className="w-full">
                  Upgrade to Premium ($29/month)
                </Button>
              )}
            </div>

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
    </div>
  )
}

export default Dashboard