import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Index from "@/pages/Index"
import AboutUs from "@/pages/AboutUs"
import Contact from "@/pages/Contact"
import Privacy from "@/pages/Privacy"
import Welcome from "@/pages/Welcome"
import Home from "@/pages/Home"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pregnancy-guide" element={<Index />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/welcome" element={<Welcome />} />
      </Routes>
    </Router>
  )
}

export default App