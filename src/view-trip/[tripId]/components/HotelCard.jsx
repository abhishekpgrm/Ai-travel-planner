import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getPhoto } from '../../../service/photoAPI';

function HotelCard({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      if (hotel?.hotelName) {
        const url = await getPhoto(hotel.hotelName);
        setPhotoUrl(url);
      }
    };

    fetchPhoto();
  }, [hotel]);

  return (
    <motion.a
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel?.hotelName + ',' + hotel?.hotelAddress)}`}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.03, y: -5, boxShadow: '0px 8px 25px rgba(0,0,0,0.1)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="block bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer h-full"
    >
      <div className="flex flex-col h-full">
        <img src={photoUrl || "/placeholder.jpg"} alt={hotel?.hotelName} className="h-[180px] w-full object-cover flex-shrink-0" />
        <div className="p-4 flex flex-col flex-grow">
          <h2 className="font-bold text-lg line-clamp-2 min-h-[3.5rem]" title={hotel?.hotelName}>{hotel?.hotelName}</h2>
          <h2 className="text-xs text-gray-500 mt-1 line-clamp-2 flex-grow">📍 {hotel?.hotelAddress}</h2>
          <div className="flex justify-between items-center mt-3">
            <h2 className="text-md font-semibold text-teal-600">₹ {hotel?.price}</h2>
            <h2 className="text-sm bg-teal-100 text-teal-800 px-2 py-1 rounded-full font-medium">⭐ {hotel?.rating}</h2>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

export default HotelCard;
