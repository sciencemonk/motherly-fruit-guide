import { RegistrationForm } from "@/components/RegistrationForm"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Baby, MessageCircle, Stethoscope, Heart } from "lucide-react"

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-screen">
          <div className="absolute inset-0">
            <img 
              src="/lovable-uploads/73d233d8-dfd2-4872-9af1-eb3596c612cc.png" 
              alt="Pregnant woman in white" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
          </div>
          
          <div className="relative container px-4 pt-32 md:pt-40">
            <span className="inline-block px-4 py-2 rounded-full bg-peach-100 text-peach-700 text-sm font-medium mb-6">
              ✨ 7-Day Free Trial
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-sage-800 mb-6">
              A new era of<br />pregnancy
            </h1>
            <p className="text-xl md:text-2xl text-sage-700 mb-8 max-w-2xl">
              The world's most advanced pregnancy support guide to help you grow a healthy baby.
            </p>
            <button className="bg-peach-500 hover:bg-peach-600 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors">
              Start Your Free Trial
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-peach-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Baby className="w-6 h-6 text-peach-500" />
                </div>
                <h3 className="text-lg font-semibold text-sage-800 mb-2">Daily Updates</h3>
                <p className="text-sage-600">Receive daily messages about your baby's development</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-peach-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-peach-500" />
                </div>
                <h3 className="text-lg font-semibold text-sage-800 mb-2">24/7 Support</h3>
                <p className="text-sage-600">Chat anytime with Mother Athena about your pregnancy</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-peach-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="w-6 h-6 text-peach-500" />
                </div>
                <h3 className="text-lg font-semibold text-sage-800 mb-2">Expert Guidance</h3>
                <p className="text-sage-600">Get evidence-based advice tailored to your journey</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-peach-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-peach-500" />
                </div>
                <h3 className="text-lg font-semibold text-sage-800 mb-2">Personalized Care</h3>
                <p className="text-sage-600">Receive support focused on your specific interests</p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-20 bg-sage-50">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-sage-800 mb-6">Our Vision</h2>
              <p className="text-xl text-sage-700">
                Empowering mothers to nurture the next generation through personalized support and cutting-edge technology.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-white">
          <div className="container px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Baby className="w-8 h-8 text-sage-600" />
                </div>
                <h3 className="text-2xl font-semibold text-sage-800 mb-4">Our Beginning</h3>
                <p className="text-sage-700">
                  Mother Athena began as a deeply personal project. When our founder, a software engineer, 
                  saw his wife Athena navigating the complexities of pregnancy, he realized technology could 
                  make a difference.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-peach-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-peach-500" />
                </div>
                <h3 className="text-2xl font-semibold text-sage-800 mb-4">Our Community</h3>
                <p className="text-sage-700">
                  We're building a future where every mother has access to personalized support, expert 
                  guidance, and a community that celebrates the journey of motherhood.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Registration Form Section */}
        <section className="py-20 bg-sage-50">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto">
              <RegistrationForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Index