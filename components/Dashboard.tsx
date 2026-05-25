"use client";

import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface DashboardProps {
  totalIncome: number;
  totalExpenses: number;
}

export default function Dashboard({ totalIncome, totalExpenses }: DashboardProps) {
  const balance = totalIncome - totalExpenses;
  const balanceColor = balance < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 transition-all hover:shadow-md group">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <TrendingUp size={24} />
          </div>
          <h3 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Общий доход</h3>
        </div>
        <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-zinc-100 break-words">{totalIncome.toLocaleString()} сум</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 transition-all hover:shadow-md group overflow-hidden">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
            <TrendingDown size={24} />
          </div>
          <h3 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Всего расходов</h3>
        </div>
        <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-zinc-100 break-words">{totalExpenses.toLocaleString()} сум</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 transition-all hover:shadow-md group overflow-hidden">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
            <Wallet size={24} />
          </div>
          <h3 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Чистый баланс</h3>
        </div>
        <p className={`text-2xl sm:text-3xl font-black ${balanceColor} break-words`}>{balance.toLocaleString()} сум</p>
      </div>
    </div>
  );
}
