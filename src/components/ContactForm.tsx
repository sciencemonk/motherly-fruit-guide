import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

export const ContactForm = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    })
    setName("")
    setEmail("")
    setMessage("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-sage-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-sage-300 shadow-sm focus:border-sage-500 focus:ring-sage-500"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-sage-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-sage-300 shadow-sm focus:border-sage-500 focus:ring-sage-500"
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-sage-700">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-sage-300 shadow-sm focus:border-sage-500 focus:ring-sage-500"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Send Message
      </Button>
    </form>
  )
}