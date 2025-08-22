import React from 'react';

const ExpenseList = ({ expenses }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Expenses</h3>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id} className="flex justify-between border-b p-2">
            <span>{expense.description}</span>
            <span>${expense.amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;
