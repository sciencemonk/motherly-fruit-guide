import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gradient-to-b from-cream to-sage-100">
        <div className="container px-4 py-16 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-sage-800 mb-8">Privacy Notice</h1>
            
            <div className="prose prose-sage max-w-none">
              <p className="text-sage-700 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-sage-800 mb-4">1. Introduction</h2>
                <p className="text-sage-700 mb-4">
                  Mother Athena ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. 
                  This Privacy Notice explains how we collect, use, disclose, and safeguard your information when you use our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-sage-800 mb-4">2. Information We Collect</h2>
                <p className="text-sage-700 mb-4">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 text-sage-700 mb-4">
                  <li>Name and contact information, including your mobile phone number</li>
                  <li>Due date and pregnancy-related information</li>
                  <li>Communications between you and Mother Athena</li>
                  <li>Usage data and interaction with our services</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-sage-800 mb-4">3. Mobile Phone Data Collection and Usage</h2>
                <p className="text-sage-700 mb-4">
                  When you provide your mobile phone number to Mother Athena:
                </p>
                <ul className="list-disc pl-6 text-sage-700 mb-4">
                  <li>You consent to receive SMS messages from Mother Athena related to your pregnancy journey</li>
                  <li>Your mobile number will be used solely for providing our pregnancy support services</li>
                  <li>We will never share your mobile number with third parties or affiliates for marketing or promotional purposes</li>
                  <li>You can opt out of receiving messages at any time by texting STOP</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-sage-800 mb-4">4. Third-Party Sharing Policy</h2>
                <p className="text-sage-700 mb-4">
                  We do not sell, rent, or share your personal information, including your mobile phone number, with third parties 
                  or affiliates for their marketing or promotional purposes. Your information may only be shared with service 
                  providers who assist us in operating our services and are bound by contractual obligations to keep personal 
                  information confidential and use it only for the purposes for which we disclose it to them.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-sage-800 mb-4">5. Use of Information</h2>
                <p className="text-sage-700 mb-4">
                  We use your information to:
                </p>
                <ul className="list-disc pl-6 text-sage-700 mb-4">
                  <li>Provide and improve our pregnancy support services</li>
                  <li>Send pregnancy updates and relevant information via SMS</li>
                  <li>Respond to your questions and requests</li>
                  <li>Analyze and improve our services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-sage-800 mb-4">6. Your Rights and Choices</h2>
                <p className="text-sage-700 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-sage-700 mb-4">
                  <li>Opt out of SMS messages at any time</li>
                  <li>Request access to your personal information</li>
                  <li>Request correction of your personal information</li>
                  <li>Request deletion of your personal information</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-sage-800 mb-4">7. Data Security</h2>
                <p className="text-sage-700 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information, 
                  including your mobile phone number, against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-sage-800 mb-4">8. Changes to Privacy Notice</h2>
                <p className="text-sage-700 mb-4">
                  We may update this Privacy Notice at any time. Your continued use of our services after any changes 
                  indicates your acceptance of the updated Privacy Notice. We will notify you of any material changes 
                  via SMS or email.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-sage-800 mb-4">9. Contact Us</h2>
                <p className="text-sage-700">
                  If you have questions about this Privacy Notice or our privacy practices, please contact us at support@motherathena.com
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Privacy