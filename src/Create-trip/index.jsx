import React, { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { AI_PROMPT, SelectBudegetOptions, SelectTravelersList } from '../constants/options';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { chatSession } from '../service/AIModal';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MapPin, Calendar, Wallet, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../service/firebase';

function CreateTrip() {
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const userInfo = await userInfoResponse.json();
        
        // Store user info in localStorage
        const userData = {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          id: userInfo.id
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Dispatch a custom event to notify other components about the login
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'user',
          newValue: JSON.stringify(userData),
          oldValue: null
        }));
        
        toast.success('Logged in successfully!');
        setOpenDialog(false);
        onGenerateTrip(); // Automatically try to generate the trip again after successful login
      } catch (error) {
        console.error('Error fetching user info:', error);
        toast.error('Failed to get user information.');
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      toast.error('Failed to sign in with Google.');
    },
  });

  const onGenerateTrip = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (!formData?.location || !formData?.noOfDays || !formData?.budget || !formData?.travelers) {
      toast.error("Please fill in all the fields.");
      return;
    }

    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT
      .replace(/{location}/g, formData.location.label)
      .replace(/{totalDays}/g, formData.noOfDays)
      .replace(/{travelers}/g, formData.travelers)
      .replace(/{budget}/g, formData.budget);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const text = result.response.text();
      
      const startIndex = text.indexOf('{');
      const endIndex = text.lastIndexOf('}');

      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        const jsonString = text.substring(startIndex, endIndex + 1);
        try {
          const tripData = JSON.parse(jsonString);
          const docId = Date.now().toString();
          
          // Store trip data in both Firebase and localStorage
          const tripDocument = {
            userSelection: formData,
            TripData: tripData, // tripData now contains estimatedCost, ecoScore, etc. from the AI
            userEmail: user.email,
            id: docId,
            createdAt: new Date().toISOString(),
          };
          
          // Save to Firebase
          await setDoc(doc(db, "AITrips", docId), tripDocument);
          
          // Also save to localStorage for immediate access
          const existingTrips = JSON.parse(localStorage.getItem('userTrips') || '[]');
          existingTrips.push(tripDocument);
          localStorage.setItem('userTrips', JSON.stringify(existingTrips));
          localStorage.setItem(`trip_${docId}`, JSON.stringify(tripDocument));
          
          navigate('/view-trip/' + docId);
        } catch (error) {
          console.error("Failed to parse AI response JSON:", error);
          toast.error("AI failed to generate the trip in the correct format. Please try again.");
        }
      } else {
        console.error("No JSON object found in AI response.");
        toast.error("AI failed to generate a valid trip plan. Please try again.");
      }
    } catch (error) {
      console.error("Error generating trip:", error);
      toast.error("An unexpected error occurred while generating the trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-bold text-3xl mt-5 text-teal-500">Tell us your travel preferences 🗺️🌴</motion.h2>
      <motion.p 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate a customized itinerary for you.
      </motion.p>

      <div className="mt-12 flex flex-col gap-10">
        {/* Step 1: Destination */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: "easeOut" }} className="flex items-start gap-5">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-teal-500 text-white font-bold text-xl">1</div>
            <div className="h-full w-px bg-gray-300 my-2"></div>
          </div>
          <div className="w-full">
            <h2 className="text-xl font-bold flex items-center gap-2"><MapPin className="h-6 w-6 text-teal-500" /> What is your destination?</h2>
            <GooglePlacesAutocomplete
              apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
              selectProps={{
                placeholder: "Search for a city, country, or landmark",
                onChange: (value) => handleInputChange('location', value),
                isClearable: true,
                className: 'w-full mt-3',
                styles: { control: (provided) => ({ ...provided, borderRadius: '0.5rem' }) }
              }}
            />
          </div>
        </motion.div>

        {/* Step 2: Duration */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: "easeOut" }} className="flex items-start gap-5">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-teal-500 text-white font-bold text-xl">2</div>
            <div className="h-full w-px bg-gray-300 my-2"></div>
          </div>
          <div className="w-full">
            <h2 className="text-xl font-bold flex items-center gap-2"><Calendar className="h-6 w-6 text-teal-500" /> How many days will you be traveling?</h2>
            <input
              type="number"
              placeholder="E.g., 5"
              onChange={(e) => handleInputChange('noOfDays', e.target.value)}
              className="w-full p-2 border rounded-lg mt-3"
            />
          </div>
        </motion.div>

        {/* Step 3: Budget */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: "easeOut" }} className="flex items-start gap-5">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-teal-500 text-white font-bold text-xl">3</div>
            <div className="h-full w-px bg-gray-300 my-2"></div>
          </div>
          <div className="w-full">
            <h2 className="text-xl font-bold flex items-center gap-2"><Wallet className="h-6 w-6 text-teal-500" /> What's your budget?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-3">
              {SelectBudegetOptions.map((item, index) => (
                <motion.div
                  key={index}
                  onClick={() => handleInputChange('budget', item.title)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={`p-4 border cursor-pointer rounded-lg transition-colors duration-300 ${formData?.budget === item.title ? 'shadow-lg border-teal-600 bg-teal-100' : 'hover:shadow-lg bg-white'}`}>
                  <h2 className="text-4xl">{item.icon}</h2>
                  <h2 className="font-bold text-lg">{item.title}</h2>
                  <h2 className="text-sm text-gray-500">{item.desc}</h2>
                </motion.div>
              ))}
            </div>
            <h3 className="text-lg font-semibold mt-4 text-gray-700">Total Budget in INR (Optional)</h3>
            <input
              type="number"
              placeholder="E.g., 50000"
              onChange={(e) => handleInputChange('totalBudget', e.target.value)}
              className="w-full p-2 border rounded-lg mt-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </motion.div>

        {/* Step 4: Travelers */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: "easeOut" }} className="flex items-start gap-5">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-teal-500 text-white font-bold text-xl">4</div>
          <div className="w-full">
            <h2 className="text-xl font-bold flex items-center gap-2"><Users className="h-6 w-6 text-teal-500" /> Who are you traveling with?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-3">
              {SelectTravelersList.map((item, index) => (
                <motion.div
                  key={index}
                  onClick={() => handleInputChange('travelers', item.people)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={`p-4 border cursor-pointer rounded-lg transition-colors duration-300 ${formData?.travelers === item.people ? 'shadow-lg border-teal-600 bg-teal-100' : 'hover:shadow-lg bg-white'}`}>
                  <h2 className="text-4xl">{item.icon}</h2>
                  <h2 className="font-bold text-lg">{item.title}</h2>
                  <h2 className="text-sm text-gray-500">{item.desc}</h2>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="my-10 justify-end flex">
        <Button disabled={loading} onClick={onGenerateTrip} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 w-full md:w-auto">
          {loading ?
            <div className="flex items-center gap-2">
              <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />
              <span>Crafting Your Adventure...</span>
            </div>
            : 'Generate My Trip'
          }
        </Button>
      </motion.div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in to continue</DialogTitle>
            <DialogDescription asChild>
              <div>
                <img src="/logo.svg" alt="App Logo" />
                <h2 className="font-bold text-lg mt-7">Sign in to continue</h2>
                <p>Sign in to the App with Google authentication security</p>
                <Button onClick={login} className="w-full mt-5 gap-4 items-center">
                  <FcGoogle className="h-7 w-7" />
                  Sign in with Google
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
