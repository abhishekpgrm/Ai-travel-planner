import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Menu, X, Plane, User, LogOut, MessageCircle } from 'lucide-react';

function Header() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Listen for storage changes (login from other tabs/components)
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        if (e.newValue) {
          setUser(JSON.parse(e.newValue));
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const userInfo = await userInfoResponse.json();
        
        // Store user info in localStorage
        const userData = {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          id: userInfo.id
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        toast.success('Welcome aboard! 🎉');
      } catch (error) {
        console.error('Error fetching user info:', error);
        toast.error('Failed to get user information.');
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      toast.error('Failed to sign in with Google.');
    },
  });

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success('See you next time! 👋');
  };

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative p-2 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg"
          >
            <Plane className="w-6 h-6 text-white" />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="font-black text-2xl bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Wanderlust
            </h1>
            <p className="text-xs text-gray-500 font-medium -mt-1">AI Travel Planner</p>
          </motion.div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3">
          <motion.div whileHover={{ y: -3, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/my-trips" className="relative px-6 py-3 rounded-2xl font-bold text-gray-700 hover:text-white transition-all duration-300 group overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                <Plane className="w-4 h-4" />
                My Trips
              </span>
              <motion.div 
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.1 }}
              />
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -3, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/contact-us" className="relative px-6 py-3 rounded-2xl font-bold text-gray-700 hover:text-white transition-all duration-300 group overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Contact
              </span>
              <motion.div 
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.1 }}
              />
            </Link>
          </motion.div>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
                <motion.img 
                  src={user.picture || '/default-avatar.png'} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8b5cf6&color=fff&size=32`;
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                />
                <span className="text-sm font-semibold text-gray-700 hidden sm:block">
                  {user.name.split(' ')[0]}
                </span>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  size="sm" 
                  className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-2xl font-semibold px-4 py-2 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }} 
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button 
                onClick={login} 
                className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-xl border-0 rounded-2xl font-bold px-8 py-3 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Sign In
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </Button>
            </motion.div>
          )}

          {/* Mobile Menu Button */}
          <motion.div className="md:hidden" whileTap={{ scale: 0.9 }}>
            <button 
              onClick={toggleMenu} 
              className="p-3 rounded-2xl text-gray-700 hover:bg-purple-50 focus:outline-none transition-all duration-300 border border-gray-200"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl py-6 border-t border-gray-200/50 shadow-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <nav className="flex flex-col items-center gap-4 px-6">
            <Link 
              to="/my-trips" 
              onClick={toggleMenu} 
              className="w-full text-center font-bold text-gray-700 hover:text-white px-6 py-4 rounded-2xl hover:bg-gradient-to-r hover:from-teal-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Plane className="w-5 h-5" />
              My Trips
            </Link>
            <Link 
              to="/contact-us" 
              onClick={toggleMenu} 
              className="w-full text-center font-bold text-gray-700 hover:text-white px-6 py-4 rounded-2xl hover:bg-gradient-to-r hover:from-emerald-600 hover:to-green-600 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <MessageCircle className="w-5 h-5" />
              Contact
            </Link>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}

export default Header;
