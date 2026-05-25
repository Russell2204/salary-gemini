"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import Dashboard from '@/components/Dashboard';
import AiAnalysis from '@/components/AiAnalysis';
import IncomeSources from '@/components/IncomeSources';
import AddExpenseForm from '@/components/AddExpenseForm';
import TransactionsList from '@/components/TransactionsList';
import FinanceChart from '@/components/FinanceChart';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LayoutDashboard } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  monthlySalary: number;
  isActive: boolean;
}

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  Rent: 'Аренда',
  Utilities: 'Коммунальные услуги',
  Groceries: 'Продукты питания',
  Subscriptions: 'Подписки',
  Others: 'Прочее',
};

const CATEGORY_CHART_COLORS: Record<string, string> = {
  Rent: '#3b82f6', // blue-500
  Utilities: '#f59e0b', // amber-500
  Groceries: '#10b981', // emerald-500
  Subscriptions: '#6366f1', // indigo-500
  Others: '#64748b', // slate-500
};

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [jobsRes, expensesRes] = await Promise.all([
        fetch('/api/jobs'),
        fetch('/api/expenses'),
      ]);
      
      if (!jobsRes.ok || !expensesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const jobsData = await jobsRes.json();
      const expensesData = await expensesRes.json();
      
      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setExpenses(Array.isArray(expensesData) ? expensesData : []);
    } catch (error) {
      console.error('Fetch data error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalIncome = useMemo(() => 
    jobs.filter((job) => job.isActive).reduce((sum, job) => sum + job.monthlySalary, 0),
  [jobs]);
    
  const totalExpenses = useMemo(() => 
    expenses.reduce((sum, exp) => sum + exp.amount, 0),
  [expenses]);

  const expenseChartData = useMemo(() => {
    const totals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
      name: label,
      value: totals[key] || 0,
      color: CATEGORY_CHART_COLORS[key],
    })).filter(item => item.value > 0);
  }, [expenses]);

  const incomeChartData = useMemo(() => {
    return jobs
      .filter(job => job.isActive)
      .map(job => ({
        name: job.title,
        value: job.monthlySalary,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`, // Random vibrant color for each job
      }));
  }, [jobs]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600/20 border-t-blue-600"></div>
          <p className="text-sm font-bold text-slate-400 animate-pulse">Загружаем данные...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-zinc-800 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <LayoutDashboard size={28} strokeWidth={2.5} />
            <span className="text-xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">VibeFinance</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        <Dashboard totalIncome={totalIncome} totalExpenses={totalExpenses} />
        
        <AiAnalysis />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <AddExpenseForm onUpdate={fetchData} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              <FinanceChart data={expenseChartData} title="Структура расходов" />
              <FinanceChart data={incomeChartData} title="Источники дохода" />
            </div>

            <TransactionsList expenses={expenses} onUpdate={fetchData} />
          </div>
          
          <div className="lg:col-span-4 h-fit sticky top-28">
            <IncomeSources jobs={jobs} onUpdate={fetchData} />
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto py-12 px-4 text-center border-t border-slate-200 dark:border-zinc-800 mt-12">
        <p className="text-sm font-bold text-slate-400">© 2026 VibeFinance. Все данные хранятся локально.</p>
      </footer>
    </div>
  );
}
