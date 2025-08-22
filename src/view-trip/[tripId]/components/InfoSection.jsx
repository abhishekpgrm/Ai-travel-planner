import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IoIosSend } from "react-icons/io";
import { toast } from 'sonner'; // Import toast for notifications
import { Button } from '../../../components/ui/button';
import { getPhoto } from '../../../service/photoAPI';

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      if (trip?.userSelection?.location?.label) {
        const url = await getPhoto(trip.userSelection.location.label);
        setPhotoUrl(url);
      }
    };

    fetchPhoto();
  }, [trip]);

  const handleShare = async () => {
    const shareData = {
      title: 'Check out my AI-generated travel itinerary!',
      text: `I'm planning a trip to ${trip?.userSelection?.location?.label} for ${trip?.userSelection?.noOfDays} days. Here are the details:`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that do not support the Web Share API
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to share trip.');
      console.error('Error sharing:', error);
    }
  };

   return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={photoUrl || trip?.TripData?.imageUrl || "/placeholder.jpg"}
        alt={trip?.userSelection?.location?.label || "Trip location"}
        className="h-[340px] w-full object-cover rounded-xl shadow-lg"
      />
      <div className='flex justify-between items-center mt-5'>
        <div className='flex flex-col gap-2'>
          <h2 className="font-bold text-3xl text-gray-800">
             {trip?.userSelection?.location?.label}
          </h2>
          <div className='flex flex-wrap gap-3 mt-2'>
            <h2 className='p-2 px-4 bg-teal-100 text-teal-800 rounded-full text-sm font-semibold flex items-center gap-2'>📅 {trip.userSelection?.noOfDays} Days</h2>
            <h2 className='p-2 px-4 bg-teal-100 text-teal-800 rounded-full text-sm font-semibold flex items-center gap-2'>💰 {trip.userSelection?.budget}</h2>
            <h2 className='p-2 px-4 bg-teal-100 text-teal-800 rounded-full text-sm font-semibold flex items-center gap-2'>👥 {trip.userSelection?.travelers} Travelers</h2>
          </div>
        </div>
        <Button onClick={handleShare} className="bg-teal-500 hover:bg-teal-600 text-white rounded-full p-3 h-auto">
          <IoIosSend size={24} />
        </Button>
      </div>

      {/* Best Time to Visit Section */}
      {trip?.TripData?.bestTimeToVisit && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='mt-6'>
            <h2 className="font-bold text-2xl text-gray-800">Best Time to Visit</h2>
            <p className="text-md text-gray-600 mt-2">{trip.TripData.bestTimeToVisit}</p>
        </motion.div>
      )}

    </motion.div>
  );
}

export default InfoSection;
