import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const BudgetBreakdown = ({ trip }) => {
  const estimatedCost = trip?.TripData?.estimatedCost;
  const userBudget = trip?.userSelection?.totalBudget;

  if (!estimatedCost) {
    return null; // Don't render if there's no cost data
  }

  // Helper to parse budget strings like "50000-70000" into an average number
  const parseBudget = (budget) => {
    if (typeof budget === 'number') return budget;
    if (typeof budget !== 'string') return 0;
    const parts = budget.split('-').map(s => parseInt(s.trim(), 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return (parts[0] + parts[1]) / 2;
    }
    if (!isNaN(parts[0])) {
      return parts[0];
    }
    return 0;
  };

  const data = [
    { name: 'Flights/Transport', value: parseBudget(estimatedCost.flights) },
    { name: 'Accommodation', value: parseBudget(estimatedCost.accommodation) },
    { name: 'Food', value: parseBudget(estimatedCost.food) },
    { name: 'Activities', value: parseBudget(estimatedCost.activities) },
  ];

  const COLORS = ['#14b8a6', '#0d9488', '#06b6d4', '#10b981']; // Teal-based theme colors

  const totalEstimatedCost = data.reduce((sum, item) => sum + item.value, 0);
  const budgetDifference = userBudget ? userBudget - totalEstimatedCost : null;

  const renderBudgetStatus = () => {
    if (userBudget) {
      if (budgetDifference >= 0) {
        return (
          <p className="text-lg font-semibold text-green-600">
            ✅ Within Budget (₹{budgetDifference.toLocaleString()} under)
          </p>
        );
      } else {
        return (
          <p className="text-lg font-semibold text-red-600">
            ⚠️ Over Budget by ₹{(-budgetDifference).toLocaleString()}
          </p>
        );
      }
    }
    return <p className="text-lg font-semibold text-gray-500">Budget not specified.</p>;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white rounded-2xl shadow-lg mt-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Budget Breakdown</h2>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-700">Summary</h3>
          <div className="text-lg text-gray-600">
            <p><strong>Total Estimated Cost:</strong> ₹{totalEstimatedCost.toLocaleString()}</p>
            {userBudget && <p><strong>Your Budget:</strong> ₹{Number(userBudget).toLocaleString()}</p>}
          </div>
          {renderBudgetStatus()}
        </div>
      </div>
    </motion.div>
  );
};

export default BudgetBreakdown;
