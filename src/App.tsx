import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Index from "@/pages/Index"
import OurStory from "@/pages/OurStory"
import Contact from "@/pages/Contact"
import Privacy from "@/pages/Privacy"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/our-story" element={<OurStory />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </Router>
  )
}

export default App