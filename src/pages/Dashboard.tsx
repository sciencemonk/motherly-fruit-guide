import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import Navbar from "@/components/Navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Moon, Bell } from "lucide-react"

const Dashboard = () => {
  const { toast } = useToast()
  const [profile, setProfile] = useState<any>(null)
  const [dreams, setDreams] = useState<any[]>([])
  const [firstName, setFirstName] = useState("Test")
  const [phoneNumber, setPhoneNumber] = useState("+1234567890")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
    fetchDreams()
  }, [])

  const fetchProfile = async () => {
    try {
      // For development, we'll use a test profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone_number', phoneNumber)
        .single()

      if (error) throw error

      setProfile(data)
      setFirstName(data?.first_name || 'Test')
    } catch (error) {
      console.error('Error fetching profile:', error)
      // Create a test profile if none exists
      const { data, error: insertError } = await supabase
        .from('profiles')
        .insert({
          phone_number: phoneNumber,
          first_name: firstName,
          login_code: 'TEST123', // Adding the required login_code
          reality_check_start_time: '08:00:00',
          reality_check_end_time: '20:00:00',
          reality_check_interval: 120
        })
        .select()
        .single()

      if (!insertError) {
        setProfile(data)
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchDreams = async () => {
    try {
      const { data, error } = await supabase
        .from('dreams')
        .select('*')
        .eq('phone_number', phoneNumber)
        .order('dream_date', { ascending: false })

      if (error) throw error
      setDreams(data || [])
    } catch (error) {
      console.error('Error fetching dreams:', error)
    }
  }

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          reality_check_start_time: profile.reality_check_start_time,
          reality_check_end_time: profile.reality_check_end_time,
          reality_check_interval: profile.reality_check_interval
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
          {/* Welcome Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Welcome back, {firstName}
              </CardTitle>
              <CardDescription>Your lucid dreaming journey awaits</CardDescription>
            </CardHeader>
          </Card>

          {/* Dreams Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                Dream Journal
              </CardTitle>
              <CardDescription>Your recent dreams and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dreams.length === 0 ? (
                  <p className="text-muted-foreground">
                    No dreams recorded yet. Text your dreams to our number to start your journal.
                  </p>
                ) : (
                  dreams.map((dream) => (
                    <div key={dream.id} className="border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">
                        {new Date(dream.dream_date).toLocaleDateString()}
                      </p>
                      <p className="mt-2">{dream.content}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Reality Checks Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Reality Checks
              </CardTitle>
              <CardDescription>
                You'll receive reality check prompts every {profile?.reality_check_interval} minutes
                between {profile?.reality_check_start_time} and {profile?.reality_check_end_time}
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="flex gap-4">
            <Button onClick={handleUpdate} className="flex-1">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard