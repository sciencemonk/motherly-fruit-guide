import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl font-bold text-sage-800">Welcome to Mother Athena</h1>
            <p className="text-xl text-sage-700">
              Your trusted companion throughout your pregnancy journey. Discover personalized guidance,
              expert advice, and a supportive community.
            </p>
            <div className="space-y-4">
              <Link to="/pregnancy-guide">
                <Button className="bg-peach-400 hover:bg-peach-500 text-peach-900 px-8 py-6 rounded-full text-lg">
                  Explore Our Pregnancy Guide
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Home