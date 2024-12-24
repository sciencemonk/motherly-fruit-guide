import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const OurStory = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sage-50 via-[#e0f2f1] to-sage-100">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="container px-4 py-16 mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg">
              <h1 className="text-3xl font-semibold text-sage-700 mb-6">Our Story</h1>
              <p className="text-sage-700">
                Mother Athena was born from a personal journey. Our founder, an engineer, and his wife were expecting 
                their first child when they realized the need for better pregnancy support. Combining his technical expertise 
                with their firsthand experience of pregnancy, he created Mother Athena to ensure that all expecting parents 
                have access to reliable information and support whenever they need it.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default OurStory