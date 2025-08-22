import React from 'react';
import { motion } from 'framer-motion';

function Footer() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 1.0 }}
      className='my-10 pt-6 border-t border-gray-200'
    >
      <h2 className='text-center text-gray-500 text-sm flex items-center justify-center gap-2'>
        Made with
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "loop"
          }}
          style={{ display: 'inline-block' }}
        >
          ❤️
        </motion.span>
        by Abhishek
      </h2>
    </motion.div>
  );
}

export default Footer;