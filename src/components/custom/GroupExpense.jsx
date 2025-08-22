import React, { useState } from 'react';

const GroupExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [members] = useState(['You', 'Friend 1', 'Friend 2']);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(members[0]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!description || !amount) return;
    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      paidBy,
    };
    setExpenses([...expenses, newExpense]);
    setDescription('');
    setAmount('');
  };

  const calculateBalances = () => {
    const balances = members.reduce((acc, member) => ({ ...acc, [member]: 0 }), {});

    expenses.forEach(({ amount, paidBy }) => {
      const share = amount / members.length;
      members.forEach(member => {
        if (member === paidBy) {
          balances[member] += amount - share;
        } else {
          balances[member] -= share;
        }
      });
    });

    return balances;
  };

  const balances = calculateBalances();

  return (
    <div className="p-4 border rounded-lg mt-4">
      <h2 className="text-2xl font-bold mb-4">Group Expense Tracker</h2>
      <form onSubmit={handleAddExpense} className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="border p-2 rounded w-full"
          >
            {members.map(member => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2">
          Add Shared Expense
        </button>
      </form>

      <div>
        <h3 className="text-lg font-semibold mb-2">Balances</h3>
        <ul>
          {Object.entries(balances).map(([member, balance]) => (
            <li key={member} className={`flex justify-between p-2 rounded ${balance > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <span>{member}</span>
              <span>{balance >= 0 ? `Gets back $${balance.toFixed(2)}` : `Owes $${-balance.toFixed(2)}`}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroupExpense;
