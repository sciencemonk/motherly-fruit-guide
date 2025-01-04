import { RegistrationForm } from "@/components/RegistrationForm"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "react-router-dom"
import { sendWelcomeMessage } from "@/components/registration/utils/welcomeMessage"
import { PregnancyReport } from "@/components/PregnancyReport"
import { WelcomeMessage } from "@/components/pregnancy-report/WelcomeMessage"
import { supabase } from "@/integrations/supabase/client"
import { Hero } from "@/components/landing/Hero"
import { Features } from "@/components/landing/Features"
import { Disclaimer } from "@/components/landing/Disclaimer"

const Index = () => {
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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Disclaimer />
      </main>
      <Footer />
    </div>
  )
}

export default Index