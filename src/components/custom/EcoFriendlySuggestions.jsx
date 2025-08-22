import React from 'react';
import { motion } from 'framer-motion';

const EcoFriendlySuggestions = ({ tripData }) => {
  const { ecoScore, carbonFootprint, ecoFriendlyTips } = tripData?.TripData || {};

  if (!ecoScore && !carbonFootprint && !ecoFriendlyTips) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 bg-white rounded-2xl shadow-lg mt-8"
      >
        <h2 className="text-2xl font-bold text-gray-800">Eco-Friendly Suggestions</h2>
        <p className="mt-4 text-gray-600">
          Eco-friendly suggestions are available for new trips. Create a new trip to get personalized carbon footprint data and sustainability tips.
        </p>
      </motion.div>
    );
  }

  const getEcoScoreBadge = (score) => {
    if (score >= 7) return 'bg-green-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const transportModes = [
    { name: 'Flight', icon: '✈️', value: carbonFootprint?.flight, color: 'bg-red-50' },
    { name: 'Train', icon: '🚆', value: carbonFootprint?.train, color: 'bg-green-50' },
    { name: 'Car', icon: '🚗', value: carbonFootprint?.car, color: 'bg-blue-50' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white rounded-2xl shadow-lg mt-8"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Eco-Friendly Suggestions</h2>
        {ecoScore && (
          <div className={`text-white px-3 py-1 rounded-full text-sm font-semibold ${getEcoScoreBadge(ecoScore)}`}>
            Eco Score: {ecoScore}/10
          </div>
        )}
      </div>

      {carbonFootprint && (
        <>
          <p className="mb-4 text-gray-600">Choosing sustainable travel options can significantly reduce your carbon footprint. Here's an estimated comparison for your trip:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {transportModes.map((mode) => (
              mode.value && (
                <div key={mode.name} className={`p-4 border rounded-lg ${mode.color}`}>
                  <h3 className="text-lg font-semibold">{mode.name} {mode.icon}</h3>
                  <p className="text-2xl font-bold">{mode.value} kg CO₂</p>
                  <p className="text-sm text-gray-500">per passenger (round trip)</p>
                </div>
              )
            ))}
          </div>
        </>
      )}

      {ecoFriendlyTips && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700">Our Recommendations:</h3>
          <p className="text-gray-600 mt-2">{ecoFriendlyTips}</p>
        </div>
      )}
    </motion.div>
  );
};

export default EcoFriendlySuggestions;
