import React from 'react';
import { motion } from 'framer-motion';
import HotelCard from './HotelCard';

function Hotels({ trip }) {
  const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-8">
      <h2 className="font-bold text-2xl text-gray-800">Hotel Recommendations</h2>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-4"
        style={{ gridAutoRows: '1fr' }}>
        {trip?.TripData?.hotelOptions?.map((hotel, index) => (
          <motion.div key={index} variants={itemVariants} className="h-full">
            <HotelCard hotel={hotel} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Hotels;
