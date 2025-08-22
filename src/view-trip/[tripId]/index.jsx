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

    // Fetch trip info from Firebase with localStorage fallback
    const GetTripData = async () => {
        setLoading(true);
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
