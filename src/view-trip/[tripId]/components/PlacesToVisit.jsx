import React from 'react';
import { motion } from 'framer-motion';
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({ trip }) {
  // Check if trip and itinerary data are available and if itinerary is an array
  if (!trip?.TripData?.itinerary || !Array.isArray(trip.TripData.itinerary)) {
    return (
      <div className="mt-8">
        <h2 className="font-bold text-2xl text-gray-800">Places to Visit</h2>
        <p className="text-gray-500 mt-2">No itinerary data available or data is in an incorrect format.</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
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
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mt-8">
      <h2 className="font-bold text-2xl text-gray-800">Places to Visit</h2>
      <div className="mt-4 space-y-6">
        {trip.TripData.itinerary.map((day, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="p-4 border border-gray-200 rounded-xl shadow-sm bg-white">
            <h3 className="font-bold text-xl text-teal-600">Day {day.day}: {day.title}</h3>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className='grid md:grid-cols-2 gap-5 mt-4'>
              {day.places && day.places.length > 0 ? (
                day.places.map((place, idx) => (
                  <motion.div key={idx} variants={itemVariants}>
                    <PlaceCardItem place={place} />
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full">No plans available for this day.</p>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default PlacesToVisit;
