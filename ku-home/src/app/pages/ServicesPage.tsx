import { motion } from "motion/react";
import { Clock, Shirt, Shield, Wifi, Utensils, Luggage, Sparkles, PhoneCall } from "lucide-react";

export function ServicesPage() {
  const services = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Front Desk",
      description: "Our reception team is available around the clock to assist you with check-in, check-out, and any inquiries during your stay."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Daily Housekeeping",
      description: "Enjoy a clean and comfortable environment with our professional daily housekeeping service."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "24-Hour Security",
      description: "Your safety is our priority. We provide 24-hour security personnel and CCTV surveillance throughout the property."
    },
    {
      icon: <Wifi className="w-8 h-8" />,
      title: "High-Speed Wi-Fi",
      description: "Stay connected with complimentary high-speed internet access available in all rooms and public areas."
    },
    {
      icon: <Luggage className="w-8 h-8" />,
      title: "Luggage Storage",
      description: "Arriving early or leaving late? Secure luggage storage is available at the front desk for your convenience."
    },
    {
      icon: <Shirt className="w-8 h-8" />,
      title: "Laundry Service",
      description: "Professional laundry and dry cleaning services are available upon request (additional charges apply)."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1920"
            alt="Hotel Services"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 text-center text-white p-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Our Services
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl font-light max-w-2xl mx-auto"
          >
            Exceptional hospitality tailored to your needs
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-[#006b54]/10 rounded-2xl flex items-center justify-center text-[#006b54] mb-6 group-hover:bg-[#006b54] group-hover:text-white transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#006b54] py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Need Special Assistance?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Our team is dedicated to making your stay as comfortable as possible. 
            If you have specific requirements, please don't hesitate to contact us.
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="/#contact" 
              className="bg-white text-[#006b54] px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              <PhoneCall className="w-5 h-5 mr-2" />
              Contact Front Desk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
