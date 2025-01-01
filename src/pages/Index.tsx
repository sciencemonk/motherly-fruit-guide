import { RegistrationForm } from "@/components/RegistrationForm"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Baby, MessageSquare, Brain, Heart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "react-router-dom"
import { sendWelcomeMessage } from "@/components/registration/utils/welcomeMessage"
import { PregnancyReport } from "@/components/PregnancyReport"
import { WelcomeMessage } from "@/components/pregnancy-report/WelcomeMessage"
import { supabase } from "@/integrations/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

const Index = () => {
  const [showRegistration, setShowRegistration] = useState(false)
  const [searchParams] = useSearchParams()
  const { toast } = useToast()
  const [profile, setProfile] = useState<{ firstName?: string; dueDate?: Date } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const registration = searchParams.get('registration')
    const phone = searchParams.get('phone')
    const firstName = searchParams.get('firstName')

    if (registration === 'success' && phone) {
      // Send welcome message
      sendWelcomeMessage(phone, firstName || '')
        .then(() => {
          toast({
            title: "Welcome to Mother Athena!",
            description: "Check your phone for a welcome message. We're excited to be part of your journey!",
          })
        })
        .catch((error) => {
          console.error('Error sending welcome message:', error)
          toast({
            variant: "destructive",
            title: "Welcome message error",
            description: "There was a problem sending your welcome message. Our team has been notified.",
          })
        })

      // Fetch profile data for the pregnancy report
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

  const handleOpenChange = (open: boolean) => {
    // Only allow closing via the X button by ignoring outside clicks
    if (!open) {
      return;
    }
    setShowRegistration(open);
  };

  // Show pregnancy report if registration was successful
  if (searchParams.get('registration') === 'success' && profile?.dueDate) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sage-50 via-[#e0f2f1] to-sage-100">
        <Navbar />
        <main className="flex-grow container px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <WelcomeMessage firstName={profile.firstName || ''} />
            <PregnancyReport 
              dueDate={profile.dueDate} 
              firstName={profile.firstName}
            />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Show loading state while fetching profile
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sage-50 via-[#e0f2f1] to-sage-100">
        <div className="animate-pulse text-sage-600">Loading...</div>
      </div>
    )
  }

  // Show landing page if no successful registration
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sage-50 via-[#e0f2f1] to-sage-100">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="container px-4 py-8 md:py-16 mx-auto">
          <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
            {/* Hero Section */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-peach-100 text-peach-800 text-sm font-medium">
                  <Sparkles className="w-4 h-4 mr-2" />
                  7-Day Free Trial
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-sage-800 mb-4">
                Meet Mother Athena
              </h1>
              <p className="text-lg text-sage-700 max-w-2xl mx-auto mb-8">
                Your personal AI pregnancy guide, providing daily advice and support to help you grow a healthy baby. 
              </p>
              <Dialog open={showRegistration} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-peach-400 hover:bg-peach-500 text-peach-900 font-semibold text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    Start Your Free Trial
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] p-0">
                  <div className="p-6">
                    <RegistrationForm />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* How It Works Section */}
            <div className="grid md:grid-cols-4 gap-8 py-8">
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-peach-100 flex items-center justify-center">
                  <Baby className="w-6 h-6 text-peach-500" />
                </div>
                <h3 className="font-semibold text-sage-800">Daily Updates</h3>
                <p className="text-sage-600 text-sm">
                  Receive daily messages about your baby's development
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-peach-100 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-peach-500" />
                </div>
                <h3 className="font-semibold text-sage-800">24/7 Support</h3>
                <p className="text-sage-600 text-sm">
                  Chat anytime with Mother Athena about your pregnancy
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-peach-100 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-peach-500" />
                </div>
                <h3 className="font-semibold text-sage-800">Expert Guidance</h3>
                <p className="text-sage-600 text-sm">
                  Get evidence-based advice tailored to your journey
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-peach-100 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-peach-500" />
                </div>
                <h3 className="font-semibold text-sage-800">Personalized Care</h3>
                <p className="text-sage-600 text-sm">
                  Receive support focused on your specific interests
                </p>
              </div>
            </div>

            {/* Medical Disclaimer */}
            <div className="mt-12 text-center text-sm text-sage-600 px-4">
              <p className="max-w-2xl mx-auto">
                * Mother Athena is not a replacement for professional medical care.
                Always consult with your healthcare provider for medical advice and
                emergency situations.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Index