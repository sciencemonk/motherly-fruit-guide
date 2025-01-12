import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { supabase } from "./integrations/supabase/client"
import Index from "./pages/Index"
import Privacy from "./pages/Privacy"
import Dashboard from "./pages/Dashboard"
import Contact from "./pages/Contact"
import "./App.css"

function App() {
  return (
    <React.StrictMode>
      <SessionContextProvider supabaseClient={supabase}>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Router>
      </SessionContextProvider>
    </React.StrictMode>
  )
}

export default App