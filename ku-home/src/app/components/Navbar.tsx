import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext.tsx";
import { AuthModal } from "./AuthModal.tsx";
import { Button } from "./ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu.tsx";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  const links = [
    { name: "Home", href: "/" },
    { name: "Accommodation", href: "/rooms" },
    { name: "Our Services", href: "/services" },
    { name: "Facilities", href: "/facilities" },
    { name: "Contact Us", href: "/contact" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-[#006b54] tracking-tight">KU Home</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-600 hover:text-[#006b54] font-medium transition-colors duration-200 text-sm uppercase tracking-wide"
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="h-6 w-px bg-gray-200 mx-2"></div>

              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-[#006b54] transition-colors p-2 rounded-full hover:bg-gray-100">
                      <div className="w-8 h-8 rounded-full bg-[#006b54] text-white flex items-center justify-center font-bold">
                        {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="font-bold">{user.name || 'User'}</div>
                      <div className="text-xs font-normal text-gray-500">{user.email}</div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    {(user.role === 'admin' || user.role === 'staff') && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex items-center cursor-pointer">
                            Admin Portal
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => setAuthModalOpen(true)}
                  variant="ghost"
                  className="text-gray-600 hover:text-[#006b54]"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}

              <Link
                to="/rooms"
                className="bg-[#006b54] hover:bg-[#005a46] text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
              >
                BOOK NOW
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              {!loading && !user && (
                <Button
                  onClick={() => setAuthModalOpen(true)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600"
                >
                  <LogIn className="w-5 h-5" />
                </Button>
              )}
              {user && (
                <Link 
                  to="/profile" 
                  className="text-gray-600 hover:text-[#006b54]"
                >
                   <User className="w-6 h-6" />
                </Link>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-[#006b54] focus:outline-none"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-2">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-[#006b54] hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                {user && (
                  <>
                    <Link
                      to="/profile"
                      className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-[#006b54] hover:bg-gray-50 flex items-center"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="w-5 h-5 mr-3" /> My Profile
                    </Link>
                    {(user.role === 'admin' || user.role === 'staff') && (
                      <Link
                        to="/admin"
                        className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-[#006b54] hover:bg-gray-50 flex items-center"
                        onClick={() => setIsOpen(false)}
                      >
                        <LayoutDashboard className="w-5 h-5 mr-3" /> Admin Portal
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <LogOut className="w-5 h-5 mr-3" /> Sign Out
                    </button>
                  </>
                )}
                {!user && !loading && (
                  <button
                    onClick={() => {
                      setAuthModalOpen(true);
                      setIsOpen(false);
                    }}
                    className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-[#006b54] hover:bg-gray-50 flex items-center"
                  >
                    <LogIn className="w-5 h-5 mr-3" /> Sign In
                  </button>
                )}
                <div className="pt-4">
                  <Link
                    to="/rooms"
                    className="block w-full text-center bg-[#006b54] text-white px-4 py-3 rounded-md font-bold shadow-md"
                    onClick={() => setIsOpen(false)}
                  >
                    BOOK NOW
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
