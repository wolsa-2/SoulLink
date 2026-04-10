import { Link, Outlet } from "react-router-dom";
import { Heart, Search, MessageSquare, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/discovery", label: "Discover", icon: Search },
    { to: "/chat", label: "Messages", icon: MessageSquare },
    { to: "/blog", label: "Blog" },
    { to: "/about", label: "About" },
  ];

  const footerLinks = [
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/terms", label: "Terms & Conditions" },
    { to: "/disclaimer", label: "Disclaimer" },
    { to: "/safety", label: "Safety Guidelines" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md border-brand-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-brand-500 fill-brand-500" />
            <span className="text-2xl font-serif font-bold text-brand-900">SoulLink</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-brand-800 hover:text-brand-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Button variant="default" className="bg-brand-600 hover:bg-brand-700 text-white rounded-full px-6">
              Join Now
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-brand-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-brand-100 p-4 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-lg font-medium text-brand-800 hover:text-brand-500"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button className="bg-brand-600 hover:bg-brand-700 text-white w-full">
              Join Now
            </Button>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-brand-900 text-brand-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-brand-300 fill-brand-300" />
                <span className="text-xl font-serif font-bold">SoulLink</span>
              </div>
              <p className="text-brand-200 text-sm leading-relaxed">
                Building meaningful connections through shared values, interests, and life goals. A safe space for friendship and networking.
              </p>
            </div>
            
            <div>
              <h4 className="font-serif font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-brand-300 hover:text-white text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-bold text-lg mb-4">Legal & Safety</h4>
              <ul className="space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-brand-300 hover:text-white text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-bold text-lg mb-4">Contact</h4>
              <p className="text-brand-300 text-sm">
                Questions? Reach out to us at:<br />
                <a href="mailto:support@soullink.com" className="hover:text-white underline">support@soullink.com</a>
              </p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-brand-800 text-center text-brand-400 text-xs">
            <p>© {new Date().getFullYear()} SoulLink. All rights reserved. Strictly non-adult content.</p>
          </div>
        </div>
      </footer>
      <Toaster position="top-center" />
    </div>
  );
}
