import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { PregnancyReport } from "@/components/PregnancyReport"
import { WelcomeMessage } from "@/components/pregnancy-report/WelcomeMessage"
import { Share2, Twitter, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const Welcome = () => {
  const [searchParams] = useSearchParams()
  const { toast } = useToast()
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const phone = searchParams.get('phone')
      console.log('Phone from URL:', phone) // Debug log
      
      if (!phone) {
        console.error('No phone number provided in URL')
        setIsLoading(false)
        return
      }

      try {
        const decodedPhone = decodeURIComponent(phone)
        console.log('Decoded phone:', decodedPhone) // Debug log

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('phone_number', decodedPhone)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
          throw error
        }

        console.log('Profile data:', data) // Debug log
        setProfile(data)

        // Send welcome message after successful checkout
        const { error: welcomeError } = await supabase.functions.invoke('send-welcome-sms', {
          body: { 
            phone_number: data.phone_number, 
            first_name: data.first_name,
            message: `Welcome to Mother Athena, ${data.first_name}! We're excited to be part of your pregnancy journey.`
          }
        })

        if (welcomeError) throw welcomeError

        toast({
          title: "Welcome to Mother Athena!",
          description: "Please check your phone for your first message.",
        })
      } catch (error) {
        console.error('Error in welcome page:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was a problem loading your profile.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [searchParams, toast])

  const handleShare = (platform: 'twitter' | 'facebook') => {
    const text = encodeURIComponent("I just started my pregnancy journey with Mother Athena - the most advanced AI pregnancy guide! 🤰✨")
    const url = encodeURIComponent("https://motherathena.com")

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`
    }

    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading your pregnancy guide...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-sage-800 mb-4">Profile Not Found</h1>
          <p className="text-sage-600">We couldn't find your profile. Please try signing up again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sage-50 via-[#e0f2f1] to-sage-100">
      <Navbar />
      <main className="flex-grow container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <WelcomeMessage firstName={profile.first_name} />
          
          {/* Social Sharing */}
          <div className="my-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-sage-800 mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share Your Journey
            </h2>
            <p className="text-sage-600 mb-4">
              Let your friends and family know about your pregnancy journey with Mother Athena!
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => handleShare('twitter')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Twitter className="w-4 h-4" />
                Share on X
              </Button>
              <Button
                onClick={() => handleShare('facebook')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Facebook className="w-4 h-4" />
                Share on Facebook
              </Button>
            </div>
          </div>

          {/* Pregnancy Report */}
          {profile.due_date && (
            <PregnancyReport 
              dueDate={new Date(profile.due_date)} 
              firstName={profile.first_name}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Welcome