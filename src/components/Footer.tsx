import { Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-sage-800">Morpheus</h3>
            <p className="text-sage-600 text-sm">
              Your gateway to conscious dreaming and lucid dream mastery.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-sage-800">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sage-600 hover:text-sage-800 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sage-600 hover:text-sage-800 text-sm">
                  Privacy Notice
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sage-600 hover:text-sage-800 text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-sage-800">Contact</h3>
            <p className="text-sage-600 text-sm">
              Questions? Reach out to us at support@ducil.com
            </p>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="text-center text-sm text-sage-600">
          <p>&copy; {new Date().getFullYear()} Morpheus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer