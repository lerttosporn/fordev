import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#004d3d] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand & Address */}
          <div>
            <span className="text-2xl font-bold tracking-tight mb-6 block">KU Home</span>
            <div className="flex items-start space-x-3 text-gray-300 mb-4">
              <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
              <p className="leading-relaxed">
                Kasetsart University<br />
                50 Ngamwongwan Road,<br />
                Lat Yao, Chatuchak,<br />
                Bangkok 10900
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white/90">Contact Us</h3>
            <div className="space-y-4">
              <a href="tel:064-130-6010" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
                <span>064-130-6010</span>
              </a>
              <a href="tel:064-130-9010" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
                <span>064-130-9010</span>
              </a>
              <a href="mailto:kuhome@ku.th" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
                <span>kuhome@ku.th</span>
              </a>
            </div>
          </div>

          {/* Quick Links / Social */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white/90">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-[#006b54] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-[#006b54] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <p className="mt-6 text-gray-400 text-sm">
              Experience the warmth of Kasetsart hospitality.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} KU Home. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
