import React, { useState } from 'react';
import AddExpense from './AddExpense';
import ExpenseList from './ExpenseList';
import BudgetSummary from './BudgetSummary';
import GroupExpense from './GroupExpense';

const Budget = () => {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(1000); // Example budget

  const handleAddExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  return (
    <div className="p-4">
      <div className="p-4 border rounded-lg mb-4">
        <h2 className="text-2xl font-bold mb-4">Personal Budget Planner</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Estimated Budget</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(parseFloat(e.target.value))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <AddExpense onAddExpense={handleAddExpense} />
            <ExpenseList expenses={expenses} />
          </div>
          <div>
            <BudgetSummary expenses={expenses} budget={budget} />
          </div>
        </div>
      </div>
      <GroupExpense />
    </div>
  );
};

export default Budget;
