import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { PregnancyReport } from "@/components/PregnancyReport"
import { WelcomeMessage } from "@/components/pregnancy-report/WelcomeMessage"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Share2, Twitter, Facebook } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const Welcome = () => {
  const [searchParams] = useSearchParams()
  const { toast } = useToast()
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const phone = searchParams.get('phone')
    
    if (phone) {
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name, due_date')
            .eq('phone_number', phone)
            .single()

          if (error) throw error

          if (data) {
            setProfile({
              firstName: data.first_name,
              dueDate: data.due_date ? new Date(data.due_date) : undefined
            })
          }
        } catch (error) {
          console.error('Error fetching profile:', error)
          toast({
            variant: "destructive",
            title: "Error loading your profile",
            description: "We couldn't load your pregnancy report. Please try refreshing the page.",
          })
        } finally {
          setIsLoading(false)
        }
      }

      fetchProfile()
    }
  }, [searchParams, toast])

  const shareOnTwitter = () => {
    const text = encodeURIComponent("I just started my pregnancy journey with Mother Athena - the most advanced AI pregnancy guide! 🤰✨")
    const url = encodeURIComponent("https://motherathena.com")
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  }

  const shareOnFacebook = () => {
    const url = encodeURIComponent("https://motherathena.com")
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sage-50 via-[#e0f2f1] to-sage-100">
        <div className="animate-pulse text-sage-600">Loading your pregnancy report...</div>
      </div>
    )
  }

  if (!profile?.dueDate) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sage-50 via-[#e0f2f1] to-sage-100">
        <div className="text-sage-600">No pregnancy information found.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sage-50 via-[#e0f2f1] to-sage-100">
      <Navbar />
      <main className="flex-grow container px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <WelcomeMessage firstName={profile.firstName || ''} />
          
          <div className="flex justify-center gap-4 mb-8">
            <Button onClick={shareOnTwitter} className="flex items-center gap-2">
              <Twitter className="w-4 h-4" />
              Share on X
            </Button>
            <Button onClick={shareOnFacebook} className="flex items-center gap-2">
              <Facebook className="w-4 h-4" />
              Share on Facebook
            </Button>
          </div>

          <PregnancyReport 
            dueDate={profile.dueDate} 
            firstName={profile.firstName}
          />

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">Your Pregnancy Journey Begins</h2>
            <div className="space-y-4 text-sage-700">
              <p>
                Welcome to Mother Athena! We're excited to be part of your pregnancy journey. 
                Here's what you can expect:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Daily personalized tips and advice via SMS</li>
                <li>Weekly development updates about your baby</li>
                <li>24/7 access to AI-powered pregnancy support</li>
                <li>Customized nutrition and exercise recommendations</li>
                <li>Regular check-ins and milestone celebrations</li>
              </ul>
              <p>
                Remember to check your phone for daily updates and feel free to text us anytime 
                with your questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Welcome