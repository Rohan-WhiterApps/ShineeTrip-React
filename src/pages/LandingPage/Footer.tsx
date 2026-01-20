"use client"

import { Facebook, Instagram, Twitter, Linkedin, Phone, Mail } from "lucide-react"
import { useState } from "react"
import Logo from "../../assets/Logo.png"

export default function Footer() {
  const [email, setEmail] = useState("")

  const handleSubscribe = () => {
    if (email) {
      setEmail("")
    }
  }

  return (
    <footer className="bg-[#374646] text-white text-sm font-opensans">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
   
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-3">
                 <img src={Logo} alt="Shinee Trip Logo" className="h-14 w-auto object-contain" />
                 <div className="flex flex-col">
                   <span className="text-white font-medium text-2xl tracking-wide border-b-2 border-[#C9A961] font-opensans">
                     SHINEE <span className="text-[#C9A961]">TRIP</span>
                   </span>
                 </div>
              </div>
            </div>

            <p className="text-white text-xs mb-4 leading-relaxed">
              Curating extraordinary journeys across India, Nepal & Bhutan since 2010.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#C9A86A]" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#C9A86A]" />
                <span>info@shineetrip.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-2">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="border border-white p-1.5 hover:border-[#C9A86A] transition text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Our Offices */}
          <div>
            <h3 className="text-[#C9A86A] font-semibold mb-3 text-xs tracking-wide">
              OUR OFFICES
              <div className="h-0.5 bg-[#C9A86A] w-10 mt-1"></div>
            </h3>
            <ul className="space-y-2">
              {["Himachal Pradesh", "Mumbai, Maharashtra", "Chandigarh, Punjab", "Kathmandu, Nepal"].map((place, i) => (
                <li key={i}>
                  <a href="#" className="hover:text-[#C9A86A] transition">{place}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-[#C9A86A] font-semibold mb-3 text-xs tracking-wide">
              DESTINATIONS
              <div className="h-0.5 bg-[#C9A86A] w-10 mt-1"></div>
            </h3>
            <ul className="space-y-2">
              {["Shimla & Manali", "Kasol & Kullu", "Nepal Tours", "Bhutan Packages"].map((dest, i) => (
                <li key={i}>
                  <a href="#" className="hover:text-[#C9A86A] transition">{dest}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#C9A86A] font-semibold mb-3 text-xs tracking-wide">
              QUICK LINKS
              <div className="h-0.5 bg-[#C9A86A] w-10 mt-1"></div>
            </h3>
            <ul className="space-y-2">
              {["About Us", "Our Services", "Testimonials", "Contact"].map((link, i) => (
                <li key={i}>
                  <a href="#" className="hover:text-[#C9A86A] transition">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stay Connected */}
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-2 text-xs tracking-wide">
            STAY CONNECTED
            <div className="h-0.5 bg-[#C9A86A] w-10 mt-1"></div>
          </h3>
          <p className="text-xs mb-3">Subscribe for exclusive travel offers and inspiration.</p>
          <div className="flex max-w-md">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#C9A86A] text-sm"
            />
            <button
              onClick={handleSubscribe}
              className="bg-[#D2A256] hover:bg-[#B8956A] transition flex items-center justify-center text-white"
              style={{
                width: '68px',
                height: '45.6px'
              }}
           > 
              <Mail size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-400 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-white space-y-2 md:space-y-0">
          <p>© 2025 Shinee Trip. All Rights Reserved.</p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Service", "Sitemap"].map((item, i) => (
              <a key={i} href={item === "Privacy Policy" ? "/privacy-policy" : "#"} className="hover:text-[#C9A86A] transition">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
