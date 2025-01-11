import { Brain, Moon, Check, Sparkles, Flower2, BookOpen } from "lucide-react"

export const FeaturesSection = () => {
  const features = [
    {
      icon: <BookOpen className="w-6 h-6 text-sage-500" />,
      title: "Dream Journal",
      description: "Record and analyze your dreams with AI-powered insights"
    },
    {
      icon: <Check className="w-6 h-6 text-sage-500" />,
      title: "Reality Checks",
      description: "Regular reminders to build dream awareness throughout the day"
    },
    {
      icon: <Flower2 className="w-6 h-6 text-sage-500" />,
      title: "Pre-sleep Meditation",
      description: "Guided sessions to enhance dream recall and lucidity"
    },
    {
      icon: <Brain className="w-6 h-6 text-sage-500" />,
      title: "Awareness",
      description: "Learn to recognize dream signs and maintain consciousness"
    },
    {
      icon: <Moon className="w-6 h-6 text-sage-500" />,
      title: "Stabilization",
      description: "Master techniques to stay in lucid dreams longer"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-sage-500" />,
      title: "Control & Exploration",
      description: "Shape your dreams and unlock limitless possibilities"
    }
  ]

  return (
    <section id="features" className="py-24 bg-cream">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-sage-800 mb-4">
            The Ducil Framework
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto">
            Our comprehensive approach combines ancient wisdom with modern technology to help you achieve lucidity
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="w-14 h-14 rounded-full bg-sage-50 flex items-center justify-center mb-4">
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