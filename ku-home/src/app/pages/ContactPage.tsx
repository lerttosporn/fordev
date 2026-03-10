import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // Basic validation
    if (!formData.firstName || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ firstName: '', lastName: '', email: '', subject: 'General Inquiry', message: '' });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img
            src="https://images.unsplash.com/photo-1669729507222-be4b4c3bcf57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5na29rJTIwbWFwJTIwbG9jYXRpb24lMjBwaW58ZW58MXx8fHwxNzcwOTY3MTUyfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Contact Map"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 text-center text-white p-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl font-light max-w-2xl mx-auto"
          >
            We'd love to hear from you. Get in touch with us for any inquiries.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
            <p className="text-gray-600 mb-12 text-lg">
              Whether you have a question about room availability, group bookings, or our facilities, our team is ready to answer all your questions.
            </p>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-[#006b54]/10 p-4 rounded-xl text-[#006b54] mr-6">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Address</h3>
                  <p className="text-gray-600 leading-relaxed">
                    KU Home, Kasetsart University<br />
                    50 Ngamwongwan Road, Lat Yao,<br />
                    Chatuchak, Bangkok 10900
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#006b54]/10 p-4 rounded-xl text-[#006b54] mr-6">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
                  <p className="text-gray-600 mb-1">
                    <a href="tel:064-130-6010" className="hover:text-[#006b54] transition-colors">
                      <span className="font-semibold">Line 1:</span> 064-130-6010
                    </a>
                  </p>
                  <p className="text-gray-600">
                    <a href="tel:064-130-9010" className="hover:text-[#006b54] transition-colors">
                      <span className="font-semibold">Line 2:</span> 064-130-9010
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#006b54]/10 p-4 rounded-xl text-[#006b54] mr-6">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-600 mb-1">
                    <a href="mailto:kuhome@ku.th" className="hover:text-[#006b54] transition-colors">
                      kuhome@ku.th
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#006b54]/10 p-4 rounded-xl text-[#006b54] mr-6">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Reception Hours</h3>
                  <p className="text-gray-600">
                    Open 24 hours daily
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 font-medium text-center">
                ✓ Message sent! We'll get back to you shortly.
              </div>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                  <input 
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#006b54] focus:ring-2 focus:ring-[#006b54]/20 outline-none transition-all"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                  <input 
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#006b54] focus:ring-2 focus:ring-[#006b54]/20 outline-none transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#006b54] focus:ring-2 focus:ring-[#006b54]/20 outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#006b54] focus:ring-2 focus:ring-[#006b54]/20 outline-none transition-all"
                >
                  <option>General Inquiry</option>
                  <option>Room Reservation</option>
                  <option>Group Booking</option>
                  <option>Event/Seminar</option>
                  <option>Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea 
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#006b54] focus:ring-2 focus:ring-[#006b54]/20 outline-none transition-all resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button 
                onClick={handleSubmit}
                className="w-full bg-[#006b54] text-white font-bold py-4 rounded-xl hover:bg-[#005a46] transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Send Message
                <Send className="w-4 h-4 ml-2" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
