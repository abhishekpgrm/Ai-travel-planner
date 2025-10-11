import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../service/firebase';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Plus, Clock, User, DollarSign, Plane, Globe, Heart, Star, ArrowRight } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="text-center mb-12">
              <div className="h-12 bg-gray-200 rounded-2xl w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded-xl w-96 mx-auto mb-8"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-200 h-32 rounded-3xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 h-96 rounded-3xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 pt-20 sm:pt-24 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-12"
        >
          {/* Header Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 text-sm font-bold text-purple-700 mb-6">
                <Plane className="w-5 h-5" />
                Your Travel Collection
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
                My <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Adventures</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
                Relive your journeys and discover new destinations with AI-powered travel planning
              </p>
              {user && (
                <div className="flex items-center justify-center gap-3 mb-8">
                  <img 
                    src={user.picture || '/default-avatar.png'} 
                    alt={user.name} 
                    className="w-12 h-12 rounded-full object-cover border-3 border-white shadow-lg"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8b5cf6&color=fff&size=48`;
                    }}
                  />
                  <div className="text-left">
                    <div className="font-bold text-gray-900">Welcome back, {user.name.split(' ')[0]}! ✈️</div>
                    <div className="text-sm text-gray-600">Ready for your next adventure?</div>
                  </div>
                </div>
              )}
              <Link to="/create-trip">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Plan New Adventure
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Stats Section */}
          {userTrips.length > 0 && (
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 text-center shadow-xl border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Plane className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-2">{userTrips.length}</div>
                <div className="text-gray-600 font-semibold">Total Trips</div>
              </div>
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 text-center shadow-xl border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-2">
                  {userTrips.reduce((acc, trip) => acc + (parseInt(trip.userSelection?.noOfDays) || 0), 0)}
                </div>
                <div className="text-gray-600 font-semibold">Days Planned</div>
              </div>
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 text-center shadow-xl border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-2">
                  {new Set(userTrips.map(trip => trip.userSelection?.location?.label)).size}
                </div>
                <div className="text-gray-600 font-semibold">Destinations</div>
              </div>
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 text-center shadow-xl border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-2">∞</div>
                <div className="text-gray-600 font-semibold">Memories</div>
              </div>
            </motion.div>
          )}

          {/* Trips Grid */}
          {userTrips.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {userTrips.map((trip) => (
                <motion.div key={trip.id} variants={itemVariants}>
                  <Link to={`/view-trip/${trip.id}`}>
                    <motion.div 
                      whileHover={{ y: -12, scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-white/20"
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
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                          {trip.userSelection?.budget}
                        </div>
                        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          AI Planned
                        </div>
                        <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="text-sm font-medium">View Details</div>
                        </div>
                      </div>
                      <div className="p-8">
                        <h3 className="font-black text-2xl text-gray-900 group-hover:text-purple-600 transition-colors mb-6 line-clamp-2">
                          {trip.userSelection?.location?.label}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 text-center">
                            <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                            <div className="font-bold text-gray-900">{trip.userSelection?.noOfDays}</div>
                            <div className="text-xs text-gray-600">Days</div>
                          </div>
                          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-4 text-center">
                            <User className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                            <div className="font-bold text-gray-900 text-sm">{trip.userSelection?.travelers}</div>
                            <div className="text-xs text-gray-600">Travelers</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>
                              {trip.createdAt ? (
                                new Date(trip.createdAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric' 
                                })
                              ) : (
                                'Recent'
                              )}
                            </span>
                          </div>
                          <div className="text-purple-600 font-semibold text-sm group-hover:text-purple-700 transition-colors">
                            View Details →
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20"
            >
              <div className="max-w-lg mx-auto">
                <div className="w-32 h-32 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <Plane className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-4xl font-black text-gray-900 mb-4">
                  Your Journey Starts Here
                </h3>
                <p className="text-gray-600 mb-12 text-xl leading-relaxed">
                  Ready to explore the world? Create your first AI-powered itinerary and discover amazing destinations tailored just for you!
                </p>
                <Link to="/create-trip">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-12 py-6 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-xl flex items-center gap-3 mx-auto"
                  >
                    <Plus className="w-6 h-6" />
                    Plan Your First Adventure
                    <ArrowRight className="w-6 h-6" />
                  </motion.button>
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
