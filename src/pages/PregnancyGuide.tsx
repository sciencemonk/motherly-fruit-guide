import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Hero } from "@/components/landing/Hero"
import { Features } from "@/components/landing/Features"
import { Disclaimer } from "@/components/landing/Disclaimer"

const PregnancyGuide = () => {
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

export default PregnancyGuide