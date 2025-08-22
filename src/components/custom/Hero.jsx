import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div 
      className='flex flex-col items-center mx-auto max-w-3xl gap-9 text-center my-16'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className='font-extrabold text-4xl md:text-5xl leading-tight'
        variants={itemVariants}
      >
        <motion.span 
          className='block text-teal-500'
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Discover Your Next Adventure with
        </motion.span>
        <motion.span 
          className='block'
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <span className='text-teal-500'>AI:</span> Personalized Itineraries at
        </motion.span>
        <motion.span 
          className='block'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          Your Fingertips
        </motion.span>
      </motion.h1>
      
      <motion.p 
        className='text-lg text-gray-600 max-w-2xl'
        variants={itemVariants}
      >
        Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
      </motion.p>
      
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to={'/create-trip'}>
          <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-lg px-8 py-3 rounded-lg shadow-lg shadow-teal-500/25 transition-all duration-300">
            Get Started, It's Free
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default Hero