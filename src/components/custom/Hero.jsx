import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Globe2, MapPin, Plane, Calendar, Star, Zap } from 'lucide-react'

function Hero() {
  return (
    <div className='relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden'>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 rounded-full"
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', filter: 'blur(100px)', opacity: 0.3 }}
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full"
          style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', filter: 'blur(120px)', opacity: 0.25 }}
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -40, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full"
          style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', filter: 'blur(90px)', opacity: 0.2 }}
          animate={{ 
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className='max-w-6xl mx-auto text-center space-y-6 sm:space-y-8'>
        {/* Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.05, y: -2 }}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-semibold shadow-2xl"
          style={{ color: '#4f46e5' }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="w-5 h-5" fill="currentColor" />
          </motion.div>
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold">
            Next-Gen AI Travel Planner
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className='font-black text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl leading-[0.9] tracking-tight mb-4 sm:mb-6'>
            <span className="block bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              Dream.
            </span>
            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Plan.
            </span>
            <span className="block bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
              Explore.
            </span>
          </h1>
        </motion.div>
        
        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className='text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed max-w-4xl mx-auto font-medium text-gray-600 px-4'
        >
          Create <span className="font-bold text-purple-600">personalized adventures</span> in seconds with our AI that understands your style, budget, and wanderlust.
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-8 sm:mt-12 px-4"
        >
          <Link to={'/create-trip'}>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button className="group relative bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 text-white text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 rounded-3xl shadow-2xl font-bold border-0 overflow-hidden w-full sm:w-auto">
                <span className="relative z-10 flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  Start Your Journey
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                />
              </Button>
            </motion.div>
          </Link>
          
          <Link to="/view-trip/demo">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button variant="outline" className="text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 rounded-3xl border-2 border-gray-300 font-bold transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80 w-full sm:w-auto">
                <Globe2 className="mr-3 w-6 h-6 text-teal-600" />
                <span className="text-gray-700">See Demo</span>
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Stats/Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-12 sm:mt-16 lg:mt-20 max-w-4xl mx-auto px-4"
        >
          {[
            { icon: Star, number: '50K+', text: 'Happy Travelers', color: 'text-yellow-500' },
            { icon: Globe2, number: '200+', text: 'Destinations', color: 'text-blue-500' },
            { icon: Zap, number: '10s', text: 'Planning Time', color: 'text-purple-500' },
            { icon: MapPin, number: '99%', text: 'Satisfaction', color: 'text-green-500' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 + i * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center p-6 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/20 shadow-lg"
            >
              <item.icon className={`w-8 h-8 mx-auto mb-3 ${item.color}`} />
              <div className="text-3xl font-black text-gray-900 mb-1">{item.number}</div>
              <div className="text-sm font-semibold text-gray-600">{item.text}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Hero