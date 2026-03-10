import { motion } from "motion/react";
import { Car, Coffee, Users, Armchair, Dumbbell, Monitor } from "lucide-react";

export function FacilitiesPage() {
  const facilities = [
    {
      image: "https://images.unsplash.com/photo-1641238178850-7d39c6284bf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGxvYmJ5JTIwbG91bmdlJTIwbW9kZXJufGVufDF8fHx8MTc3MDk2NzE1MXww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Lobby Lounge",
      description: "A spacious and modern lobby area perfect for casual meetings, reading, or waiting for your party. Designed with comfort and academic aesthetics in mind.",
      icon: <Armchair className="w-6 h-6" />
    },
    {
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1080",
      title: "Co-Working Space",
      description: "Quiet corners equipped with power outlets and high-speed Wi-Fi, ideal for students and faculty members who need to focus on their work.",
      icon: <Monitor className="w-6 h-6" />
    },
    {
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1080",
      title: "Meeting Rooms",
      description: "Fully equipped meeting rooms available for rental. Perfect for small seminars, thesis defenses, or group study sessions.",
      icon: <Users className="w-6 h-6" />
    },
    {
      image: "https://images.unsplash.com/photo-1595562709282-e8cb52b4737d?auto=format&fit=crop&q=80&w=1080",
      title: "KU Cafe",
      description: "Start your day with freshly brewed coffee and light snacks at our on-site cafe located on the ground floor.",
      icon: <Coffee className="w-6 h-6" />
    },
    {
      image: "https://images.unsplash.com/photo-1590674899505-8622b19612f3?auto=format&fit=crop&q=80&w=1080",
      title: "Secure Parking",
      description: "Ample parking space for guests, monitored by 24-hour security and CCTV surveillance.",
      icon: <Car className="w-6 h-6" />
    },
    {
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1080",
      title: "Fitness Center",
      description: "Stay active with our well-equipped gym featuring cardio machines and free weights for your daily workout routine.",
      icon: <Dumbbell className="w-6 h-6" />
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img
            src="https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=1920"
            alt="Facilities Hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 text-center text-white p-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Facilities
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl font-light max-w-2xl mx-auto"
          >
            Designed for your comfort, convenience, and productivity
          </motion.p>
        </div>
      </section>

      {/* Facilities List */}
      <section className="py-20 container mx-auto px-4 max-w-7xl">
        <div className="space-y-20">
          {facilities.map((facility, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}
            >
              <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-2xl h-[400px] relative group">
                <img 
                  src={facility.image} 
                  alt={facility.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="bg-[#006b54]/10 w-16 h-16 rounded-2xl flex items-center justify-center text-[#006b54] mb-6">
                  {facility.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{facility.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {facility.description}
                </p>
                <div className="h-1 w-20 bg-[#006b54] rounded-full"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
