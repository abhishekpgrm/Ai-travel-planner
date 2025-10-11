import React, { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { AI_PROMPT, SelectBudegetOptions, SelectTravelersList } from '../constants/options';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { chatSession } from '../service/AIModal';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MapPin, Calendar, Wallet, Users, Sparkles, ArrowRight, ArrowLeft, Check, Zap, Globe, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    { id: 'destination', title: 'Where to?', icon: MapPin, description: 'Choose your dream destination' },
    { id: 'duration', title: 'How long?', icon: Calendar, description: 'Plan your perfect timeline' },
    { id: 'budget', title: 'Budget style?', icon: Wallet, description: 'Select your spending preference' },
    { id: 'travelers', title: 'Who\'s going?', icon: Users, description: 'Tell us about your travel group' }
  ];

  const isStepComplete = (stepIndex) => {
    switch (stepIndex) {
      case 0: return formData.location;
      case 1: return formData.noOfDays;
      case 2: return formData.budget;
      case 3: return formData.travelers;
      default: return false;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

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
    try {
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

      console.log('Sending prompt to AI...');
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      console.log('AI response received');
      const text = result.response.text();
      console.log('AI response text:', text);
      
      const startIndex = text.indexOf('{');
      const endIndex = text.lastIndexOf('}');

      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        const jsonString = text.substring(startIndex, endIndex + 1);
        console.log('Parsing JSON...');
        const tripData = JSON.parse(jsonString);
        const docId = Date.now().toString();
        
        const tripDocument = {
          userSelection: formData,
          TripData: tripData,
          userEmail: user.email,
          id: docId,
          createdAt: new Date().toISOString(),
        };
        
        console.log('Saving to Firebase...');
        await setDoc(doc(db, "AITrips", docId), tripDocument);
        console.log('Saved to Firebase successfully');
        
        const existingTrips = JSON.parse(localStorage.getItem('userTrips') || '[]');
        existingTrips.push(tripDocument);
        localStorage.setItem('userTrips', JSON.stringify(existingTrips));
        localStorage.setItem(`trip_${docId}`, JSON.stringify(tripDocument));
        
        console.log('Navigating to trip page...');
        navigate('/view-trip/' + docId);
      } else {
        console.error('No valid JSON found in response');
        toast.error("AI failed to generate a valid trip plan. Please try again.");
      }
    } catch (error) {
      console.error("Detailed error:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      toast.error(`Error: ${error.message || 'An unexpected error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 pt-20 sm:pt-24 pb-8 sm:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 text-sm font-bold text-purple-700 mb-8"
          >
            <Zap className="w-5 h-5" />
            AI-Powered Trip Builder
          </motion.div>
          <h1 className="font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4 sm:mb-6">
            Create Your <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Dream Trip</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Our AI will craft a personalized itinerary based on your preferences, budget, and travel style in just seconds.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                    index <= currentStep 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent shadow-lg' 
                      : 'bg-white text-gray-400 border-gray-200'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isStepComplete(index) ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </motion.div>
                {index < steps.length - 1 && (
                  <div className={`w-16 md:w-24 h-1 mx-2 rounded-full transition-all duration-500 ${
                    index < currentStep ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{steps[currentStep].title}</h3>
            <p className="text-gray-600">{steps[currentStep].description}</p>
          </div>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl border border-white/20 mb-6 sm:mb-8"
          >
            {currentStep === 0 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <MapPin className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">Where would you like to go?</h3>
                  <p className="text-gray-600 text-lg">Search for cities, countries, or specific landmarks</p>
                </div>
                <div className="max-w-2xl mx-auto">
                  <GooglePlacesAutocomplete
                    apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                    selectProps={{
                      placeholder: "🌍 Search destinations (e.g., Paris, Tokyo, Bali)...",
                      onChange: (value) => handleInputChange('location', value),
                      isClearable: true,
                      className: 'w-full text-lg',
                      styles: { 
                        control: (provided, state) => ({ 
                          ...provided, 
                          borderRadius: '1.5rem',
                          padding: '1rem',
                          border: state.isFocused ? '3px solid #8b5cf6' : '3px solid #e2e8f0',
                          boxShadow: state.isFocused ? '0 0 0 4px rgba(139, 92, 246, 0.1)' : 'none',
                          transition: 'all 0.3s ease',
                          fontSize: '18px',
                          minHeight: '64px',
                          '&:hover': { borderColor: '#8b5cf6' }
                        }),
                        menu: (provided) => ({
                          ...provided,
                          borderRadius: '1.5rem',
                          overflow: 'hidden',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                          border: '1px solid #e2e8f0'
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected ? '#8b5cf6' : state.isFocused ? 'rgba(139, 92, 246, 0.1)' : 'white',
                          color: state.isSelected ? 'white' : '#374151',
                          padding: '12px 20px',
                          fontSize: '16px',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer'
                        })
                      }
                    }}
                  />
                </div>
                {formData.location && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200"
                  >
                    <div className="flex items-center justify-center gap-3 text-green-700">
                      <Check className="w-6 h-6" />
                      <span className="font-semibold text-lg">Great choice! {formData.location.label} it is!</span>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Calendar className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">How many days?</h3>
                  <p className="text-gray-600 text-lg">Tell us the duration of your perfect getaway</p>
                </div>
                <div className="max-w-md mx-auto">
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="30"
                      placeholder="7"
                      value={formData.noOfDays || ''}
                      onChange={(e) => handleInputChange('noOfDays', e.target.value)}
                      className="w-full p-6 text-center text-3xl font-bold border-3 border-gray-200 rounded-3xl outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 bg-white/50 backdrop-blur-sm"
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 font-medium">
                      days
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-8">
                    {[3, 7, 14].map((days) => (
                      <motion.button
                        key={days}
                        onClick={() => handleInputChange('noOfDays', days.toString())}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-4 rounded-2xl border-2 font-semibold transition-all duration-300 ${
                          formData.noOfDays === days.toString()
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent shadow-lg'
                            : 'bg-white/70 text-gray-700 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {days} days
                      </motion.button>
                    ))}
                  </div>
                </div>
                {formData.noOfDays && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200"
                  >
                    <div className="flex items-center justify-center gap-3 text-blue-700">
                      <Check className="w-6 h-6" />
                      <span className="font-semibold text-lg">{formData.noOfDays} days of adventure ahead!</span>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Wallet className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">What's your budget style?</h3>
                  <p className="text-gray-600 text-lg">Choose the spending approach that fits your travel dreams</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {SelectBudegetOptions.map((item, index) => (
                    <motion.div
                      key={index}
                      onClick={() => handleInputChange('budget', item.title)}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -8 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative p-8 cursor-pointer rounded-3xl transition-all duration-300 border-3 ${
                        formData?.budget === item.title 
                          ? 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-500 shadow-2xl' 
                          : 'bg-white/70 border-gray-200 hover:border-purple-300 hover:shadow-xl'
                      }`}
                    >
                      {formData?.budget === item.title && (
                        <motion.div
                          layoutId="budget-selected"
                          className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      <div className="text-center">
                        <div className="text-5xl mb-4">{item.icon}</div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="max-w-md mx-auto">
                  <label className="block text-lg font-semibold text-gray-700 mb-3 text-center">
                    Total Budget (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-semibold">₹</span>
                    <input
                      type="number"
                      placeholder="50,000"
                      value={formData.totalBudget || ''}
                      onChange={(e) => handleInputChange('totalBudget', e.target.value)}
                      className="w-full pl-10 pr-4 py-4 border-3 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all duration-300 text-lg bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">Who's joining the adventure?</h3>
                  <p className="text-gray-600 text-lg">Tell us about your travel companions</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {SelectTravelersList.map((item, index) => (
                    <motion.div
                      key={index}
                      onClick={() => handleInputChange('travelers', item.people)}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -8 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative p-8 cursor-pointer rounded-3xl transition-all duration-300 border-3 ${
                        formData?.travelers === item.people 
                          ? 'bg-gradient-to-br from-pink-50 to-purple-50 border-pink-500 shadow-2xl' 
                          : 'bg-white/70 border-gray-200 hover:border-pink-300 hover:shadow-xl'
                      }`}
                    >
                      {formData?.travelers === item.people && (
                        <motion.div
                          layoutId="travelers-selected"
                          className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      <div className="text-center">
                        <div className="text-5xl mb-4">{item.icon}</div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <motion.button
            onClick={prevStep}
            disabled={currentStep === 0}
            whileHover={{ scale: currentStep === 0 ? 1 : 1.05 }}
            whileTap={{ scale: currentStep === 0 ? 1 : 0.95 }}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-2xl font-semibold transition-all duration-300 order-2 sm:order-1 ${
              currentStep === 0 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="hidden sm:inline">Previous</span>
          </motion.button>

          {currentStep < steps.length - 1 ? (
            <motion.button
              onClick={nextStep}
              disabled={!isStepComplete(currentStep)}
              whileHover={{ scale: isStepComplete(currentStep) ? 1.05 : 1 }}
              whileTap={{ scale: isStepComplete(currentStep) ? 0.95 : 1 }}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                isStepComplete(currentStep)
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl hover:shadow-2xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next Step
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              onClick={onGenerateTrip}
              disabled={loading || !isStepComplete(currentStep)}
              whileHover={{ scale: (!loading && isStepComplete(currentStep)) ? 1.05 : 1 }}
              whileTap={{ scale: (!loading && isStepComplete(currentStep)) ? 0.95 : 1 }}
              className={`relative overflow-hidden flex items-center gap-3 px-10 py-5 rounded-3xl font-bold text-xl transition-all duration-300 ${
                loading || !isStepComplete(currentStep)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-2xl hover:shadow-3xl'
              }`}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <AiOutlineLoading3Quarters className="w-6 h-6" />
                  </motion.div>
                  <span>Creating Your Adventure...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>Generate My Trip</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                  />
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">Almost there!</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Sign in to save your trip and access it from anywhere
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-6">
            <Button 
              onClick={login} 
              className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3"
            >
              <FcGoogle className="w-6 h-6" />
              Continue with Google
            </Button>
            <p className="text-xs text-gray-500 text-center">
              We'll never share your data. Your privacy is our priority.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
