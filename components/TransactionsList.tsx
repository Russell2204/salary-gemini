"use client";

import { Trash2, History, BarChart3 } from 'lucide-react';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string;
}

interface TransactionsListProps {
  expenses: Expense[];
  onUpdate: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  Rent: 'Аренда',
  Utilities: 'Коммунальные услуги',
  Groceries: 'Продукты питания',
  Subscriptions: 'Подписки',
  Others: 'Прочее',
};

const CATEGORY_COLORS: Record<string, string> = {
  Rent: 'bg-blue-500',
  Utilities: 'bg-amber-500',
  Groceries: 'bg-emerald-500',
  Subscriptions: 'bg-indigo-500',
  Others: 'bg-slate-500',
};

const CATEGORY_CHIP_STYLES: Record<string, string> = {
  Rent: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Utilities: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Groceries: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  Subscriptions: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  Others: 'bg-slate-50 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400',
};

export default function TransactionsList({ expenses, onUpdate }: TransactionsListProps) {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const deleteExpense = async (id: string) => {
    if (!confirm('Удалить этот расход?')) return;
    
    try {
      await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
      onUpdate();
    } catch (error) {
      console.error('Delete expense error:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Аналитика */}
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-zinc-800">
        <h2 className="text-xl font-black mb-8 text-slate-900 dark:text-zinc-100 flex items-center gap-2">
          <BarChart3 className="text-blue-500" size={24} />
          Распределение трат
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
            const amount = categoryTotals[key] || 0;
            const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
            return (
              <div key={key} className="space-y-2">
                <div className="flex flex-wrap justify-between items-end gap-2">
                  <span className="text-sm font-bold text-slate-700 dark:text-zinc-300">{label}</span>
                  <div className="text-right whitespace-nowrap">
                    <span className="text-sm font-black text-slate-900 dark:text-zinc-100">{amount.toLocaleString()} сум</span>
                    <span className="text-[10px] ml-1.5 font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-tight">{percentage.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`${CATEGORY_COLORS[key]} h-full rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Список транзакций */}
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden">
        <h2 className="text-xl font-black mb-8 text-slate-900 dark:text-zinc-100 flex items-center gap-2">
          <History className="text-blue-500" size={24} />
          История операций
        </h2>
        <div className="overflow-x-auto -mx-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.15em] font-black text-slate-400 dark:text-zinc-500 border-b border-slate-100 dark:border-zinc-800">
                <th className="px-8 pb-4 font-black">Дата</th>
                <th className="px-4 pb-4 font-black">Категория</th>
                <th className="px-4 pb-4 font-black">Описание</th>
                <th className="px-4 pb-4 font-black text-right">Сумма</th>
                <th className="px-8 pb-4 font-black text-right">Управление</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/50">
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400 dark:text-zinc-500 text-sm italic">
                    Операций еще не совершалось
                  </td>
                </tr>
              )}
              {expenses.map((exp) => (
                <tr key={exp.id} className="text-sm group hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-8 py-5 whitespace-nowrap font-medium text-slate-500 dark:text-zinc-400">
                    {new Date(exp.date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="px-2 py-5">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${CATEGORY_CHIP_STYLES[exp.category]}`}>
                      {CATEGORY_LABELS[exp.category]}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-slate-600 dark:text-zinc-300 font-medium">
                    {exp.description || <span className="text-slate-300 dark:text-zinc-600">—</span>}
                  </td>
                  <td className="px-4 py-5 text-right font-black text-slate-900 dark:text-zinc-100 tabular-nums">
                    {exp.amount.toLocaleString()} сум
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 dark:text-zinc-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      title="Удалить"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
