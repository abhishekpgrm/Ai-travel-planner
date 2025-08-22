import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../service/firebase';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Plus, Clock, User, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/button';

function MyTrips() {
  const [user, setUser] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Redirect to home if not logged in
      navigate('/');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchUserTrips();
    }
  }, [user]);

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
        // Sort trips by creation date (newest first)
        trips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUserTrips(trips);
        // Also update localStorage with Firebase data
        localStorage.setItem('userTrips', JSON.stringify(trips));
      } else {
        // Fallback to localStorage if no Firebase data
        const localTrips = JSON.parse(localStorage.getItem('userTrips') || '[]');
        const userSpecificTrips = localTrips.filter(trip => trip.userEmail === user.email);
        userSpecificTrips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUserTrips(userSpecificTrips);
      }
    } catch (error) {
      console.error("Error fetching user trips from Firebase, using localStorage: ", error);
      // Fallback to localStorage on error
      const localTrips = JSON.parse(localStorage.getItem('userTrips') || '[]');
      const userSpecificTrips = localTrips.filter(trip => trip.userEmail === user.email);
      userSpecificTrips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-5 sm:px-10 md:px-20 lg:px-32 xl:px-56">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 h-80 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-5 sm:px-10 md:px-20 lg:px-32 xl:px-56">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">My Trips</h1>
              <p className="text-gray-600 mt-2">Your saved travel adventures and itineraries</p>
              {user && (
                <div className="flex items-center gap-2 mt-2">
                  <img 
                    src={user.picture || '/default-avatar.png'} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full object-cover border-2 border-teal-200"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=14b8a6&color=fff&size=32`;
                    }}
                  />
                  <span className="text-sm text-gray-600">Welcome back, {user.name.split(' ')[0]}!</span>
                </div>
              )}
            </div>
            <Link to="/create-trip">
              <Button className="bg-teal-500 hover:bg-teal-600 flex items-center gap-2 px-6 py-3">
                <Plus className="h-5 w-5" />
                Plan New Trip
              </Button>
            </Link>
          </div>

          {/* Stats Section */}
          {userTrips.length > 0 && (
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">{userTrips.length}</div>
                  <div className="text-sm text-gray-600">Total Trips</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {userTrips.reduce((acc, trip) => acc + (parseInt(trip.userSelection?.noOfDays) || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Days Planned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Set(userTrips.map(trip => trip.userSelection?.location?.label)).size}
                  </div>
                  <div className="text-sm text-gray-600">Destinations</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Trips Grid */}
          {userTrips.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {userTrips.map((trip) => (
                <motion.div key={trip.id} variants={itemVariants}>
                  <Link to={`/view-trip/${trip.id}`}>
                    <motion.div 
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
                    >
                      <div className="relative overflow-hidden">
                        <img 
                          src={trip.TripData?.locationImageUrl || trip.userSelection?.locationImageUrl || '/placeholder.jpg'} 
                          alt={trip.userSelection?.location?.label || 'Trip destination'}
                          className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = '/placeholder.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
                          {trip.userSelection?.budget}
                        </div>
                        <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="text-sm font-medium">View Details</div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-bold text-xl text-gray-800 group-hover:text-teal-600 transition-colors line-clamp-2">
                            {trip.userSelection?.location?.label}
                          </h3>
                        </div>
                        <div className="space-y-3 text-sm text-gray-600">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-teal-500 flex-shrink-0" />
                            <span className="font-medium">{trip.userSelection?.noOfDays} Days Trip</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            <span>{trip.userSelection?.travelers}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <DollarSign className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="capitalize">{trip.userSelection?.budget} Budget</span>
                          </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span>
                              {trip.createdAt ? (
                                `Created on ${new Date(trip.createdAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })} at ${new Date(trip.createdAt).toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}`
                              ) : (
                                'Created recently'
                              )}
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
              className="text-center py-20 bg-white rounded-xl shadow-sm"
            >
              <div className="max-w-md mx-auto">
                <div className="bg-teal-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="h-10 w-10 text-teal-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  No trips yet
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  You haven't created any trips yet. Start planning your next adventure and create unforgettable memories!
                </p>
                <Link to="/create-trip">
                  <Button className="bg-teal-500 hover:bg-teal-600 px-8 py-3 text-lg">
                    Plan Your First Trip
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default MyTrips;
