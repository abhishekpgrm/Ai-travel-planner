import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getPhoto } from '../../../service/photoAPI';
import { FaClock, FaMoneyBill, FaStar, FaWalking } from 'react-icons/fa';

function PlaceCardItem({ place }) {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      if (place?.placeName) {
        const url = await getPhoto(place.placeName);
        setPhotoUrl(url);
      }
    };

    fetchPhoto();
  }, [place]);

  if (!place) {
    return <p>No place details available.</p>;
  }

  return (
    <motion.a
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.placeName)}`}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.03, y: -5, boxShadow: '0px 8px 25px rgba(0,0,0,0.1)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="block bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer h-full flex flex-col"
    >
      <img
        src={photoUrl || place.placeImageUrl || '/placeholder.jpg'}
        alt={place.placeName}
        className="h-[150px] w-full object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="font-bold text-lg truncate" title={place.placeName}>{place.placeName}</h2>
        <p className="text-sm text-gray-500 mt-1 flex-grow">{place.placeDetails}</p>
        
        <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
          {place.timeToTravel && (
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <FaWalking className="text-teal-500 h-4 w-4" />
              <span>{place.timeToTravel}</span>
            </div>
          )}
          {place.openingHours && (
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <FaClock className="text-teal-500 h-4 w-4" />
              <span>{place.openingHours}</span>
            </div>
          )}
          {place.ticketPricing && place.ticketPricing !== 'N/A' && (
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <FaMoneyBill className="text-teal-500 h-4 w-4" />
              <span>{place.ticketPricing}</span>
            </div>
          )}
          {place.rating && (
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <FaStar className="text-amber-500 h-4 w-4" />
              <span>{place.rating} stars</span>
            </div>
          )}
        </div>
      </div>
    </motion.a>
  );
}

export default PlaceCardItem;
