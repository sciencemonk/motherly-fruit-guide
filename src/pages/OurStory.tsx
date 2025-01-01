import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Heart, Baby, Flower, LeafyGreen, Users } from "lucide-react"

const OurStory = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div 
          className="relative h-[50vh] flex items-center"
          style={{
            backgroundImage: 'url("/lovable-uploads/4e1d9a07-eb10-4bd0-a20d-59eea66c2289.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />
          <div className="relative container mx-auto px-4">
            <h1 className="text-5xl font-bold text-sage-800 mb-4">Our Vision</h1>
            <p className="text-xl text-sage-700 max-w-2xl">
              Empowering mothers to nurture the next generation through personalized support and cutting-edge technology.
            </p>
          </div>
        </div>

        {/* Story Content */}
        <div className="container px-4 py-16 mx-auto">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col items-center text-center p-6 bg-sage-50/50 rounded-lg">
                  <Baby className="w-12 h-12 text-sage-600 mb-4" />
                  <h3 className="text-xl font-semibold text-sage-700 mb-3">Our Beginning</h3>
                  <p className="text-sage-700">
                    Mother Athena was born from a vision of supporting mothers through their pregnancy journey using the power of AI and personalized care.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center p-6 bg-sage-50/50 rounded-lg">
                  <Users className="w-12 h-12 text-peach-400 mb-4" />
                  <h3 className="text-xl font-semibold text-sage-700 mb-3">Our Community</h3>
                  <p className="text-sage-700">
                    We're building a future where every mother has access to personalized support, expert guidance, and a community that celebrates the journey of motherhood.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-cream/50 rounded-lg">
                <LeafyGreen className="w-12 h-12 text-sage-500 mb-4" />
                <h3 className="text-xl font-semibold text-sage-700 mb-3">Our Mission</h3>
                <p className="text-sage-700 max-w-2xl">
                  We envision a world where every pregnancy is supported with the best of human care and technological innovation. 
                  By cultivating a pro-family future, we're helping create stronger communities and healthier generations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default OurStory