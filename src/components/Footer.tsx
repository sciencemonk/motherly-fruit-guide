import { Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-sage-800">Mother Athena</h3>
            <p className="text-sage-600 text-sm">
              Supporting mothers through their pregnancy journey with evidence-based guidance.
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
              Questions? Reach out to us at support@motherathena.com
            </p>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="text-center text-sm text-sage-600">
          <p>&copy; {new Date().getFullYear()} Mother Athena. All rights reserved.</p>
          <p className="mt-2">
            Mother Athena, powered by OpenAI, may generate information that is inaccurate or does not meet your needs. 
            Mother Athena is not responsible for your use of any generated information, and such generated information will have no legal effect. 
            The processing of your information is subject to Mother Athena's{" "}
            <Link to="/privacy" className="text-sage-800 hover:underline">Privacy Notice</Link>.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer