import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

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
        
        toast.success('Logged in successfully!');
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
    toast.success('Signed out successfully!');
  };

  return (
    <motion.header 
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 px-4 py-3 flex justify-between items-center shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Link to="/" className="flex items-center gap-3 cursor-pointer group">
        <motion.img 
          src="/logo.png" 
          alt="AI Travel Planner Logo" 
          className="h-12 w-12 sm:h-14 sm:w-14 object-contain transition-transform duration-300 group-hover:scale-110" 
          whileHover={{ rotate: 5 }}
        />
        <motion.h1 
          className="font-bold text-xl sm:text-2xl text-gray-800 hidden sm:block bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent" 
          style={{ fontFamily: 'Poppins, sans-serif' }}
          whileHover={{ scale: 1.05 }}
        >
          AI Travel Planner
        </motion.h1>
      </Link>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/my-trips" className="font-medium text-gray-700 hover:text-teal-500 px-3 py-2 rounded-lg hover:bg-teal-50 transition-all duration-300">
            My Trips
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/contact-us" className="font-medium text-gray-700 hover:text-teal-500 px-3 py-2 rounded-lg hover:bg-teal-50 transition-all duration-300">
            Contact Us
          </Link>
        </motion.div>
      </nav>

      <div className="flex items-center gap-3">
        {user ? (
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <motion.img 
                src={user.picture || '/default-avatar.png'} 
                alt={user.name} 
                className="w-8 h-8 rounded-full object-cover border-2 border-teal-200 shadow-sm"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=14b8a6&color=fff&size=32`;
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                Hi, {user.name.split(' ')[0]}
              </span>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleSignOut} variant="outline" size="sm" className="text-xs border-gray-300 hover:border-red-300 hover:text-red-500 transition-colors">
                Sign Out
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button onClick={login} size="sm" className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg shadow-teal-500/25 border-0">
              Sign In
            </Button>
          </motion.div>
        )}

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <nav className="flex flex-col items-center gap-4">
            <Link to="/my-trips" onClick={toggleMenu} className="font-medium text-gray-700 hover:text-teal-500">My Trips</Link>
            <Link to="/contact-us" onClick={toggleMenu} className="font-medium text-gray-700 hover:text-teal-500">Contact Us</Link>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}

export default Header;
