import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../service/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { X } from 'lucide-react';

const budgetOptions = [
  { value: 'economy', label: 'Economy ($)' },
  { value: 'mid-range', label: 'Mid-range ($$)' },
  { value: 'luxury', label: 'Luxury ($$$)' },
];
const travelTypes = [
  'Adventure',
  'Leisure',
  'Business',
  'Cultural',
  'Culinary',
];
const accommodationOptions = [
  'Hotels',
  'Hostels',
  'Airbnb',
  'Resorts',
];
const transportationOptions = [
  'Flights',
  'Trains',
  'Cars',
  'Buses',
];
const dietaryOptions = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Halal',
  'Kosher',
  'No Restrictions',
];

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    photoURL: '',
    favoriteDestinations: [],
    budget: '',
    travelTypes: [],
    accommodations: [],
    transportation: [],
    accessibility: '',
    dietary: [],
    travelHistory: [],
    wishlist: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newWishlist, setNewWishlist] = useState('');
  const [newWishlistPriority, setNewWishlistPriority] = useState('Medium');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [travelHistory, setTravelHistory] = useState([]);

  useEffect(() => {
    if (user) {
      setProfile((p) => ({
        ...p,
        name: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || '',
        favoriteDestinations: [],
      }));
      fetchProfile();
      fetchTravelHistory();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const docRef = doc(db, 'UserProfiles', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const profileData = docSnap.data();
        setProfile((prev) => ({ ...prev, ...profileData }));
      }
    } catch (err) {
      toast.error('Failed to load profile');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name, value) => {
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      let photoURL = profile.photoURL;
      if (photoFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `profile_photos/${user.uid}`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
        await updateProfile(user, { photoURL });
      }

      const updatedProfile = { ...profile, photoURL };
      const docRef = doc(db, 'UserProfiles', user.uid);
      await setDoc(docRef, updatedProfile, { merge: true });

      setProfile(updatedProfile);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to save profile');
      console.error(err);
    }
    setSaving(false);
    setPhotoFile(null);
    setPhotoPreview('');
  };

  const fetchTravelHistory = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'AITrips'), where('userEmail', '==', user.email));
      const querySnapshot = await getDocs(q);
      const trips = [];
      querySnapshot.forEach((doc) => {
        trips.push({ id: doc.id, ...doc.data() });
      });
      setTravelHistory(trips);
    } catch (err) {
      toast.error('Failed to load travel history');
      console.error(err);
    }
  };

  const addWishlistItem = () => {
    if (!newWishlist) return;
    setProfile((prev) => ({
      ...prev,
      wishlist: [
        ...prev.wishlist,
        { destination: newWishlist, priority: newWishlistPriority },
      ],
    }));
    setNewWishlist('');
    setNewWishlistPriority('Medium');
  };

  if (loading) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={photoPreview || profile.photoURL || '/placeholder.png'}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
            <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-gray-700 text-white rounded-full p-1 cursor-pointer hover:bg-gray-600">
              ✏️
              <input id="photo-upload" type="file" className="hidden" onChange={(e) => {
                setPhotoFile(e.target.files[0]);
                setPhotoPreview(URL.createObjectURL(e.target.files[0]));
              }} />
            </label>
          </div>
          <Input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="flex-1"
          />
        </div>
        <Input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          placeholder="Email"
          className=""
          disabled
        />
        <Input
          type="tel"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          placeholder="Phone Number"
        />
        {/* Travel Preferences */}
        <div>
          <label className="font-semibold">Favorite Destinations</label>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACES_API_KEY}
            selectProps={{
              isMulti: true,
              value: profile.favoriteDestinations,
              onChange: (value) => handleArrayChange('favoriteDestinations', value),
              placeholder: 'Search for cities, landmarks...',
            }}
          />
        </div>
        <div>
          <label className="font-semibold">Budget Range</label>
          <select
            name="budget"
            value={profile.budget}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Select budget</option>
            {budgetOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold">Travel Types</label>
          <select
            multiple
            value={profile.travelTypes}
            onChange={(e) =>
              handleArrayChange(
                'travelTypes',
                Array.from(e.target.selectedOptions, (o) => o.value)
              )
            }
            className="w-full border rounded p-2"
          >
            {travelTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold">Accommodation Preferences</label>
          <select
            multiple
            value={profile.accommodations}
            onChange={(e) =>
              handleArrayChange(
                'accommodations',
                Array.from(e.target.selectedOptions, (o) => o.value)
              )
            }
            className="w-full border rounded p-2"
          >
            {accommodationOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold">Transportation Preferences</label>
          <select
            multiple
            value={profile.transportation}
            onChange={(e) =>
              handleArrayChange(
                'transportation',
                Array.from(e.target.selectedOptions, (o) => o.value)
              )
            }
            className="w-full border rounded p-2"
          >
            {transportationOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <Input
          type="text"
          name="accessibility"
          value={profile.accessibility}
          onChange={handleChange}
          placeholder="Accessibility needs (e.g. wheelchair, visual aid, etc.)"
        />
        <div>
          <label className="font-semibold">Dietary Restrictions</label>
          <select
            multiple
            value={profile.dietary}
            onChange={(e) =>
              handleArrayChange(
                'dietary',
                Array.from(e.target.selectedOptions, (o) => o.value)
              )
            }
            className="w-full border rounded p-2"
          >
            {dietaryOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        {/* Travel History */}
        <div>
          <h3 className="text-xl font-bold mt-6 mb-4">Travel History</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {travelHistory.length > 0 ? (
              travelHistory.map((trip) => (
                <div key={trip.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <img src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${trip.tripData?.locationInfo?.photo_ref}&key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}`} alt={trip.userSelection?.location?.label} className="w-full h-32 object-cover rounded-md mb-2" />
                  <h4 className="font-bold">{trip.userSelection?.location?.label}</h4>
                  <p className="text-sm text-gray-500">{trip.userSelection?.noOfDays} Days</p>
                  <Button asChild variant="outline" className="mt-2 w-full">
                    <a href={`/view-trip/${trip.id}`} target="_blank" rel="noopener noreferrer">View Itinerary</a>
                  </Button>
                </div>
              ))
            ) : (
              <p>No past trips yet.</p>
            )}
          </div>
        </div>
        {/* Wishlist */}
        <div>
          <label className="font-semibold">Wishlist Destinations</label>
          <div className="flex gap-2 mb-2">
            <Input
              type="text"
              value={newWishlist}
              onChange={(e) => setNewWishlist(e.target.value)}
              placeholder="Add destination"
            />
            <select
              value={newWishlistPriority}
              onChange={(e) => setNewWishlistPriority(e.target.value)}
              className="border rounded p-2"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <Button onClick={addWishlistItem} type="button">
              Add
            </Button>
          </div>
          <ul className="list-disc ml-6">
            {profile.wishlist.length === 0 && <li>No wishlist items.</li>}
            {profile.wishlist.map((item, i) => (
              <li key={i}>
                {item.destination} <span className="text-xs text-gray-500">[{item.priority}]</span>
              </li>
            ))}
          </ul>
        </div>
        <Button onClick={handleSave} disabled={saving} className="mt-4">
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
