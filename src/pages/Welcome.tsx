import { Heart, Baby, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Welcome = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sage-50 via-[#e0f2f1] to-sage-100">
      <Navbar />
      <main className="flex-grow container px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Message */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-sage-800">Welcome to Mother Athena!</h1>
            <p className="text-xl text-sage-600">Your AI-powered pregnancy companion</p>
          </div>

          {/* Message Alert */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-peach-500">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="w-6 h-6 text-peach-500" />
              <h2 className="text-xl font-semibold text-sage-800">Check Your Phone</h2>
            </div>
            <p className="text-sage-600">
              We've sent your first message from Mother Athena. Keep an eye on your phone for daily personalized updates about your pregnancy journey.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-peach-500" />
                <h3 className="text-xl font-semibold text-sage-800">Daily Support</h3>
              </div>
              <p className="text-sage-600">
                Receive daily messages with personalized advice, tips, and insights tailored to your stage of pregnancy.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <Baby className="w-6 h-6 text-peach-500" />
                <h3 className="text-xl font-semibold text-sage-800">Track Development</h3>
              </div>
              <p className="text-sage-600">
                Stay informed about your baby's growth and development with weekly updates and milestone tracking.
              </p>
            </div>
          </div>

          {/* Getting Started Tips */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-sage-800 mb-4">Getting Started</h3>
            <ul className="space-y-3 text-sage-600">
              <li>✓ Save Mother Athena's number in your contacts</li>
              <li>✓ Reply to our messages anytime with questions</li>
              <li>✓ Share important updates with your healthcare provider</li>
              <li>✓ Enable notifications to never miss an update</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Welcome;