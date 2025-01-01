import { Baby, MessageSquare, Brain, Heart } from "lucide-react"

export const Features = () => {
  const features = [
    {
      icon: Baby,
      title: "Daily Updates",
      description: "Receive daily messages about your baby's development"
    },
    {
      icon: MessageSquare,
      title: "24/7 Support",
      description: "Chat anytime with Mother Athena about your pregnancy"
    },
    {
      icon: Brain,
      title: "Expert Guidance",
      description: "Get evidence-based advice tailored to your journey"
    },
    {
      icon: Heart,
      title: "Personalized Care",
      description: "Receive support focused on your specific interests"
    }
  ]

  return (
    <div className="py-24 bg-sage-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-peach-100 flex items-center justify-center">
                <feature.icon className="w-7 h-7 text-peach-500" />
              </div>
              <h3 className="text-lg font-semibold text-sage-800">{feature.title}</h3>
              <p className="text-sage-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}