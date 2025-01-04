import { Baby, MessageCircle, Brain, Heart, Video, Sparkles } from "lucide-react"

export const FeaturesSection = () => {
  const features = [
    {
      icon: <Baby className="w-6 h-6 text-peach-500" />,
      title: "Daily Updates",
      description: "Receive daily messages about your baby's development"
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-peach-500" />,
      title: "24/7 Support",
      description: "Chat anytime with Mother Athena about your pregnancy"
    },
    {
      icon: <Brain className="w-6 h-6 text-peach-500" />,
      title: "Expert Guidance",
      description: "Get evidence-based advice tailored to your journey"
    },
    {
      icon: <Video className="w-6 h-6 text-peach-500" />,
      title: "Community Events",
      description: "Join expert-led sessions on fertility and motherhood"
    },
    {
      icon: <Heart className="w-6 h-6 text-peach-500" />,
      title: "Personalized Care",
      description: "Receive support focused on your specific interests"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-peach-500" />,
      title: "Fertility Support",
      description: "Whether you're expecting or trying to conceive, we're here for you"
    }
  ]

  return (
    <section id="features" className="py-24 bg-cream">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-sage-800 mb-4">
            Comprehensive Support for Your Journey
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto">
            From fertility to pregnancy and beyond, we're here to support you every step of the way
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="w-14 h-14 rounded-full bg-peach-50 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-sage-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-sage-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}