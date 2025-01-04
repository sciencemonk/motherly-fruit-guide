import { ContactForm } from "@/components/ContactForm"

export const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-cream">
      <div className="container px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold text-sage-800 mb-4">
              Contact Us
            </h2>
            <p className="text-sage-600">
              Have questions? We're here to help you on your journey.
            </p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}