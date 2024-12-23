import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import { ContactForm } from "./ContactForm"

const Navbar = () => {
  return (
    <div className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center">
        <div className="mr-8 flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/6301462c-0c02-4ad5-b07a-13888e2f0268.png" 
              alt="Mother Athens Logo" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="hidden font-bold sm:inline-block">Mother Athens</span>
          </Link>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>About Us</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 w-[400px]">
                  <div className="grid gap-1">
                    <h4 className="font-medium leading-none">Our Mission</h4>
                    <p className="text-sm text-muted-foreground">
                      Supporting mothers through their pregnancy journey with evidence-based guidance.
                    </p>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Dialog>
                <DialogTrigger className={cn(
                  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                )}>
                  Contact
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Contact Us</DialogTitle>
                  </DialogHeader>
                  <ContactForm />
                </DialogContent>
              </Dialog>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  )
}

export default Navbar