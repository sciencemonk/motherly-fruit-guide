import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import Privacy from "./pages/Privacy"
import Dashboard from "./pages/Dashboard"
import OurStory from "./pages/OurStory"
import Contact from "./pages/Contact"
import "./App.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/our-story" element={<OurStory />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  )
}

export default App