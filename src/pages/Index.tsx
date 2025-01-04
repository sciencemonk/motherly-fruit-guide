import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

const Index = () => {
  const [question, setQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState("")
  const { toast } = useToast()
  const maxChars = 200
  const maxQuestions = 10

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('handle-sms', {
        body: {
          message: question,
          isPregnancyQuestion: true
        }
      })

      if (error) throw error

      setResponse(data.message)
      setQuestion("")
    } catch (error) {
      console.error('Error getting response:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow container max-w-4xl mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Where <span className="text-blue-500">Questions</span> Meet Mother AI
          </h1>
          <p className="text-lg text-gray-600">
            Get instant educational insights about your pregnancy concerns
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your pregnancy questions one at a time..."
              className="min-h-[100px] p-4 text-lg"
              maxLength={maxChars}
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>0 of {maxQuestions} questions asked</span>
              <span>{question.length} of {maxChars} characters used</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-500 mt-0.5" />
            <p className="text-sm text-amber-800">
              For educational purposes only. Consult healthcare professionals for medical advice.
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full md:w-auto"
            disabled={isLoading || !question.trim()}
          >
            {isLoading ? "Generating Response..." : "Get Answer"}
          </Button>
        </form>

        {response && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Response:</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
          </div>
        )}

        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
          <ul className="space-y-2 text-blue-800">
            <li>• Be specific about your symptoms or concerns</li>
            <li>• Include relevant details about your pregnancy stage</li>
            <li>• Mention any specific worries or complications</li>
            <li>• Remember this is for educational purposes only</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Index