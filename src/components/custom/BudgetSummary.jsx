import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BudgetSummary = ({ expenses, budget }) => {
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingBudget = budget - totalExpenses;

  const expenseData = expenses.map(e => ({ name: e.description, value: e.amount }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Budget Summary</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Estimated Budget</p>
          <p className="text-xl font-bold">${budget.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="text-xl font-bold text-red-500">${totalExpenses.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Remaining</p>
          <p className={`text-xl font-bold ${remainingBudget >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${remainingBudget.toFixed(2)}
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={expenseData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {expenseData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetSummary;
