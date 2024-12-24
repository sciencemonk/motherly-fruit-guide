import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { ContactForm } from "@/components/ContactForm"

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sage-50 via-[#e0f2f1] to-sage-100">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="container px-4 py-16 mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg">
              <h1 className="text-3xl font-semibold text-sage-700 mb-6">Contact Us</h1>
              <p className="text-sage-700 mb-8">
                Have questions about our support or billing? We're here to help! Fill out the form below and we'll get back to you as soon as possible.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Contact