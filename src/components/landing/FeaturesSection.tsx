import { MessageSquare, Brain, Check, Sparkles, Phone, BarChart3 } from "lucide-react"

export const FeaturesSection = () => {
  const features = [
    {
      icon: <MessageSquare className="w-12 h-12 text-sage-500" />,
      title: "Simple Dream Journaling",
      description: "Record your dreams instantly via text message. Just send a quick text right after you wake up."
    },
    {
      icon: <Check className="w-12 h-12 text-sage-500" />,
      title: "Reality Checks",
      description: "Receive perfectly timed SMS reminders throughout the day to build dream awareness. Customizable schedule to match your daily routine."
    },
    {
      icon: <Brain className="w-12 h-12 text-sage-500" />,
      title: "AI Dream Analysis",
      description: "Our advanced AI analyzes your dreams to uncover patterns, themes, and potential triggers for lucidity. Get personalized insights to improve your practice."
    }
  ]

  const methodSteps = [
    {
      title: "Awareness",
      description: "Learn to recognize dream signs and develop a heightened sense of consciousness both in waking life and dreams."
    },
    {
      title: "Stabilization",
      description: "Master techniques to maintain lucidity and prevent premature awakening once you become conscious in your dreams."
    },
    {
      title: "Control",
      description: "Develop the ability to influence and shape your dream environment while maintaining lucid awareness."
    },
    {
      title: "Exploration",
      description: "Use your lucid dreams for personal growth, creativity, and exploring the limitless possibilities of your mind."
    }
  ]

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-sage-800 mb-6">
            Everything You Need to Master Lucid Dreaming
          </h2>
          <p className="text-lg text-sage-600 max-w-3xl mx-auto mb-8">
            Morpheus makes lucid dreaming accessible through the simplest tool you already use - text messages. 
            No complicated apps or dream journals needed.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 border border-sage-100"
            >
              <div className="mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold text-sage-800 mb-4">
                {feature.title}
              </h3>
              <p className="text-sage-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-sage-50 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto my-20">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <Phone className="w-6 h-6 text-sage-600" />
                <h3 className="text-xl font-semibold text-sage-800">
                  Powered by SMS
                </h3>
              </div>
              <p className="text-sage-600">
                Record dreams and receive reality checks through simple text messages. Your entries automatically sync to your personal dashboard for deeper analysis.
              </p>
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <BarChart3 className="w-6 h-6 text-sage-600" />
                <h3 className="text-xl font-semibold text-sage-800">
                  Powerful Dashboard
                </h3>
              </div>
              <p className="text-sage-600">
                Track your progress, analyze dream patterns, and get AI-powered insights through your personalized web dashboard. Everything syncs automatically.
              </p>
            </div>
          </div>
        </div>

        <div id="method" className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-sage-800 mb-8 text-center">
            The Morpheus Method
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {methodSteps.map((step, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-md border border-sage-100"
              >
                <h3 className="text-2xl font-semibold text-sage-800 mb-4">
                  {step.title}
                </h3>
                <p className="text-sage-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
