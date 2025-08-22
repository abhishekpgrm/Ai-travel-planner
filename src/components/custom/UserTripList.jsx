import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../service/firebase';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Plus, Clock, Shield, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

// The component now receives the user object as a prop
function UserTripList({ user }) { 
  const [userTrips, setUserTrips] = useState([]);
  // Start in a loading state, as this component only renders when we expect to fetch trips.
  const [loading, setLoading] = useState(true);

  const getEcoScoreBadge = (score) => {
    if (score > 75) return 'bg-green-500';
    if (score > 50) return 'bg-yellow-500';
    return 'bg-red-500';
  }; 

  useEffect(() => {
    // The effect runs only if the user prop is valid.
    if (user) {
      fetchUserTrips();
    }
  }, [user]); // The dependency is now the user prop from Home.jsx

  const deleteTrip = async (tripId, e) => {
    e.preventDefault(); // Prevent navigation to trip details
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      try {
        // Delete from Firebase
        await deleteDoc(doc(db, 'AITrips', tripId));
        
        // Update local state
        setUserTrips(prev => prev.filter(trip => trip.id !== tripId));
        
        // Update localStorage
        const localTrips = JSON.parse(localStorage.getItem('userTrips') || '[]');
        const updatedTrips = localTrips.filter(trip => trip.id !== tripId);
        localStorage.setItem('userTrips', JSON.stringify(updatedTrips));
        
        toast.success('Trip deleted successfully!');
      } catch (error) {
        console.error('Error deleting trip:', error);
        // If Firebase delete fails, still try to remove from localStorage
        const localTrips = JSON.parse(localStorage.getItem('userTrips') || '[]');
        const updatedTrips = localTrips.filter(trip => trip.id !== tripId);
        localStorage.setItem('userTrips', JSON.stringify(updatedTrips));
        setUserTrips(prev => prev.filter(trip => trip.id !== tripId));
        toast.success('Trip deleted from local storage!');
      }
    }
  };

  const fetchUserTrips = async () => {
    setLoading(true);
    try {
      // Try to fetch from Firebase first
      const q = query(collection(db, 'AITrips'), where('userEmail', '==', user.email));
      const querySnapshot = await getDocs(q);
      const trips = [];
      querySnapshot.forEach((doc) => {
        trips.push({ id: doc.id, ...doc.data() });
      });
      
      if (trips.length > 0) {
        setUserTrips(trips);
        // Also update localStorage with Firebase data
        localStorage.setItem('userTrips', JSON.stringify(trips));
      } else {
        // Fallback to localStorage if no Firebase data
        const localTrips = JSON.parse(localStorage.getItem('userTrips') || '[]');
        const userSpecificTrips = localTrips.filter(trip => trip.userEmail === user.email);
        setUserTrips(userSpecificTrips);
      }
    } catch (error) {
      console.error("Error fetching user trips from Firebase, using localStorage: ", error);
      // Fallback to localStorage on error
      const localTrips = JSON.parse(localStorage.getItem('userTrips') || '[]');
      const userSpecificTrips = localTrips.filter(trip => trip.userEmail === user.email);
      setUserTrips(userSpecificTrips);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // The loading state is now the primary check.
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">My Trips</h2>
          <p className="text-gray-600 mt-1">Your saved travel adventures</p>
        </div>
        <Link to="/create-trip">
          <Button className="bg-teal-500 hover:bg-teal-600 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Plan New Trip
          </Button>
        </Link>
      </div>

      {userTrips.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-auto-rows-fr"
        >
          {userTrips.map((trip) => (
            <motion.div key={trip.id} variants={itemVariants} className="flex flex-col">
              <Link to={`/view-trip/${trip.id}`} className="flex flex-col flex-1">
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col flex-1"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={trip.TripData?.locationImageUrl || '/placeholder.jpg'} 
                      alt={trip.userSelection?.location?.label}
                      className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                      {trip.userSelection?.budget}
                    </div>
                    <button
                      onClick={(e) => deleteTrip(trip.id, e)}
                      className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                      title="Delete trip"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-800 group-hover:text-teal-600 transition-colors line-clamp-2">
                        {trip.userSelection?.location?.label}
                      </h3>
                      <div className={`flex items-center gap-1 text-white px-2 py-1 rounded-full text-xs ${getEcoScoreBadge(trip.ecoScore)}`}>
                        <Shield className="h-3 w-3" />
                        <span>{trip.ecoScore}</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 flex-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-teal-500" />
                        <span>{trip.userSelection?.noOfDays} Days Trip</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-teal-500" />
                        <span className="line-clamp-1">{trip.userSelection?.travelers} Travelers</span>
                      </div>
                    </div>
                    <div className="mt-auto pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>
                          Created on {new Date(trip.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })} at {new Date(trip.createdAt).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-gray-50 rounded-xl"
        >
          <div className="max-w-md mx-auto">
            <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No trips yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't created any trips yet. Start planning your next adventure!
            </p>
            <Link to="/create-trip">
              <Button className="bg-teal-500 hover:bg-teal-600">
                Plan Your First Trip
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default UserTripList;
