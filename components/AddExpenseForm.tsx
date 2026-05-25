"use client";

import { useState } from 'react';
import { CreditCard, Tag, FileText, Calendar, Plus } from 'lucide-react';

interface AddExpenseFormProps {
  onUpdate: () => void;
}

const CATEGORIES = [
  { value: 'Rent', label: 'Аренда' },
  { value: 'Utilities', label: 'Коммунальные услуги' },
  { value: 'Groceries', label: 'Продукты питания' },
  { value: 'Subscriptions', label: 'Подписки' },
  { value: 'Others', label: 'Прочее' },
];

export default function AddExpenseForm({ onUpdate }: AddExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    try {
      await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: parseFloat(amount), 
          category, 
          description, 
          date 
        }),
      });

      setAmount('');
      setDescription('');
      onUpdate();
    } catch (error) {
      console.error('Add expense error:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-zinc-800">
      <h2 className="text-2xl font-black mb-8 text-slate-900 dark:text-zinc-100 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
          <CreditCard size={24} />
        </div>
        Новый расход
      </h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-zinc-400">
            <Tag size={16} /> Сумма (сум)
          </label>
          <input
            type="number"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-4 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg font-bold"
            placeholder="0"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-zinc-400">
            <Plus size={16} /> Категория
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
            required
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2 lg:col-span-1">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-zinc-400">
            <FileText size={16} /> Описание
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="Заметки..."
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-zinc-400">
            <Calendar size={16} /> Дата
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-4 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            required
          />
        </div>

        <div className="md:col-span-2 lg:col-span-4 mt-2">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98]"
          >
            Добавить транзакцию
          </button>
        </div>
      </form>
    </div>
  );
}
