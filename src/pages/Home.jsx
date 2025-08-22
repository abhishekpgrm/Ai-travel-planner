import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/custom/Hero';
import { motion } from 'framer-motion';

function Home() {
  const [user, setUser] = useState(null);

  // Check localStorage for user data
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="container mx-auto px-5 sm:px-10 md:px-20 lg:px-32 xl:px-56">
          <Hero />
        </div>
      </section>

      {/* Call to Action Section for Non-Logged Users */}
      {!user && (
        <motion.section 
          className="py-16 bg-gray-50"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="container mx-auto px-5 sm:px-10 md:px-20 lg:px-32 xl:px-56 text-center">
            <motion.h2 
              className="text-3xl font-bold text-gray-800 mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Ready to Plan Your Perfect Trip?
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Sign in to save your trips, access your itineraries from anywhere, and get personalized recommendations.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/create-trip" 
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg shadow-teal-500/25 transition-all duration-300"
              >
                Start Planning Now
              </Link>
            </motion.div>
          </div>
        </motion.section>
      )}
    </div>
  );
}

export default Home;
