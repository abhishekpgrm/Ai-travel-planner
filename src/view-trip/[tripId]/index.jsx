import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import InfoSection from './components/InfoSection';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../service/firebase';
import Hotels from './components/Hotels';
import PlacesToVisit from './components/PlacesToVisit';
import Footer from './components/Footer';
import SkeletonLoader from './components/SkeletonLoader';
import BudgetBreakdown from '../../components/custom/BudgetBreakdown';
import EcoFriendlySuggestions from '../../components/custom/EcoFriendlySuggestions';

function ViewTrip() {
      const { tripId } = useParams();

  useEffect(() => {
    document.body.style.backgroundColor = "#f1f5f9";
    return () => {
        document.body.style.backgroundColor = "#fff";
    }
  }, []);
    const [trip, setTrip] = useState(null); // Initialize as null to represent no data
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        if (tripId) {
            GetTripData();
        }
    }, [tripId]);

    // Demo trip data
    const getDemoTrip = () => {
        return {
            userSelection: {
                location: { label: "Paris, France" },
                noOfDays: "5",
                budget: "Moderate",
                travelers: "2 People"
            },
            TripData: {
                location: "Paris, France",
                locationImageUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800",
                hotels: [
                    {
                        hotelName: "Hotel des Grands Boulevards",
                        hotelAddress: "17 Boulevard Poissonnière, 75002 Paris",
                        price: "€120-180/night",
                        hotelImageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
                        geoCoordinates: "48.8708, 2.3439",
                        rating: 4.3,
                        description: "Charming boutique hotel in the heart of Paris with elegant rooms and excellent service."
                    },
                    {
                        hotelName: "Le Marais Hotel",
                        hotelAddress: "8 Rue des Mauvais Garçons, 75004 Paris",
                        price: "€90-140/night",
                        hotelImageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
                        geoCoordinates: "48.8566, 2.3522",
                        rating: 4.1,
                        description: "Historic hotel in Le Marais district with traditional French charm."
                    }
                ],
                itinerary: [
                    {
                        day: "Day 1",
                        plan: [
                            {
                                placeName: "Eiffel Tower",
                                placeDetails: "Iconic iron lattice tower and symbol of Paris",
                                placeImageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400",
                                geoCoordinates: "48.8584, 2.2945",
                                ticketPricing: "€29.40",
                                timeToTravel: "2-3 hours",
                                rating: 4.6
                            },
                            {
                                placeName: "Seine River Cruise",
                                placeDetails: "Scenic boat tour along the Seine River",
                                placeImageUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400",
                                geoCoordinates: "48.8566, 2.3522",
                                ticketPricing: "€15",
                                timeToTravel: "1 hour",
                                rating: 4.4
                            }
                        ]
                    },
                    {
                        day: "Day 2",
                        plan: [
                            {
                                placeName: "Louvre Museum",
                                placeDetails: "World's largest art museum and historic monument",
                                placeImageUrl: "https://images.unsplash.com/photo-1566139992930-b159fc2c2ad6?w=400",
                                geoCoordinates: "48.8606, 2.3376",
                                ticketPricing: "€17",
                                timeToTravel: "3-4 hours",
                                rating: 4.5
                            }
                        ]
                    }
                ]
            }
        };
    };

    // Fetch trip info from Firebase with localStorage fallback
    const GetTripData = async () => {
        setLoading(true);
        
        // Handle demo trip
        if (tripId === 'demo') {
            setTimeout(() => {
                setTrip(getDemoTrip());
                setLoading(false);
            }, 1000); // Simulate loading
            return;
        }
        
        try {
            // Try Firebase first
            const docRef = doc(db, 'AITrips', tripId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const tripData = docSnap.data();
                setTrip(tripData);
                // Cache in localStorage for future access
                localStorage.setItem(`trip_${tripId}`, JSON.stringify(tripData));
            } else {
                // Fallback to localStorage
                const storedTrip = localStorage.getItem(`trip_${tripId}`);
                if (storedTrip) {
                    setTrip(JSON.parse(storedTrip));
                } else {
                    console.log('No trip found in Firebase or localStorage');
                    toast.error('No trip found!');
                }
            }
        } catch (error) {
            console.error('Error fetching from Firebase, trying localStorage:', error);
            // Fallback to localStorage on Firebase error
            try {
                const storedTrip = localStorage.getItem(`trip_${tripId}`);
                if (storedTrip) {
                    setTrip(JSON.parse(storedTrip));
                } else {
                    toast.error('No trip found!');
                }
            } catch (localError) {
                console.error('Error fetching from localStorage:', localError);
                toast.error('Failed to fetch trip data!');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 sm:p-10 md:px-20 lg:px-44 xl:px-56">
            {/* Loading state */}
            {loading && <SkeletonLoader />}

            {/* Render components only when trip data is available */}
            {!loading && trip && (
                <>
                    {/* Information Section */}
                    <InfoSection trip={trip} />

                    {/* Recommended Hotels */}
                    <Hotels trip={trip} />

                    {/* Daily Plan */}
                    <PlacesToVisit trip={trip} />

                    {/* Budget Breakdown Section */}
                    <BudgetBreakdown trip={trip} />

                    {/* Eco Friendly Suggestions */}
                    <EcoFriendlySuggestions tripData={trip} />

                    {/* Footer */}
                     <Footer />
                </>
            )}

            {/* Fallback for no data */}
            {!loading && !trip && (
                <p className="text-red-500">No trip details available.</p>
            )}
        </div>
    );
}

export default ViewTrip;
