import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Share2, Twitter, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PregnancyReport } from "@/components/PregnancyReport"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

const Welcome = () => {
  const [searchParams] = useSearchParams()
  const { toast } = useToast()
  const [profile, setProfile] = useState<{ firstName?: string; dueDate?: Date } | null>(null)
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
    } else {
      setIsLoading(false)
    }
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sage-50 via-[#e0f2f1] to-sage-100">
        <div className="animate-pulse text-sage-600">Loading your pregnancy report...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sage-50 via-[#e0f2f1] to-sage-100">
      <Navbar />
      <main className="flex-grow container px-4 pt-20 pb-8 md:py-24">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Welcome Message */}
          <div className="text-center space-y-6 bg-white p-8 md:p-12 rounded-lg shadow-md">
            <h1 className="text-4xl font-bold text-sage-800">Welcome to Mother Athena!</h1>
            <p className="text-2xl text-sage-600">Your AI-powered pregnancy companion</p>
            <div className="mt-8 text-sage-700 space-y-4">
              <p className="text-lg">We're excited to be part of your pregnancy journey! 🎉</p>
              <p className="text-lg">Please check your phone for your first message from Mother Athena.</p>
            </div>
          </div>

          {/* Pregnancy Report */}
          {profile?.dueDate && (
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-sage-800 text-center">Your Pregnancy Report</h2>
              <PregnancyReport 
                dueDate={profile.dueDate}
                firstName={profile.firstName}
              />
            </div>
          )}

          {/* Social Sharing */}
          <div className="bg-white p-8 md:p-12 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-sage-800 mb-6 flex items-center gap-2">
              <Share2 className="w-6 h-6" />
              Share Your Journey
            </h2>
            <p className="text-lg text-sage-600 mb-8">
              Let your friends and family know about your pregnancy journey with Mother Athena!
            </p>
            <div className="flex flex-wrap gap-4">
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
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Welcome