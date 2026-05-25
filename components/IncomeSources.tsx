"use client";

import { useState } from 'react';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  monthlySalary: number;
  isActive: boolean;
}

interface IncomeSourcesProps {
  jobs: Job[];
  onUpdate: () => void;
}

export default function IncomeSources({ jobs, onUpdate }: IncomeSourcesProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newSalary, setNewSalary] = useState('');

  const addJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSalary) return;

    try {
      await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, monthlySalary: newSalary }),
      });

      setNewTitle('');
      setNewSalary('');
      onUpdate();
    } catch (error) {
      console.error('Add job error:', error);
    }
  };

  const updateJob = async (id: string, updates: Partial<Job>) => {
    try {
      await fetch('/api/jobs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      onUpdate();
    } catch (error) {
      console.error('Update job error:', error);
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm('Удалить этот источник дохода?')) return;
    
    try {
      await fetch(`/api/jobs?id=${id}`, { method: 'DELETE' });
      onUpdate();
    } catch (error) {
      console.error('Delete job error:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 h-full">
      <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-zinc-100 flex items-center gap-2">
        <TrendingUp className="text-emerald-500" size={20} />
        Источники доходов
      </h2>
      
      <div className="space-y-3 mb-8">
        {jobs.length === 0 && (
          <div className="py-6 text-center text-slate-400 dark:text-zinc-500 text-sm italic border-2 border-dashed border-slate-100 dark:border-zinc-800 rounded-xl">
            Источники не добавлены
          </div>
        )}
        {jobs.map((job) => (
          <div key={job.id} className="group flex flex-wrap items-center justify-between p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-zinc-700 transition-all gap-4">
            <div className="flex-1 min-w-[200px]">
              <p className="font-bold text-slate-800 dark:text-zinc-200 truncate">{job.title}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="relative w-full max-w-[160px]">
                  <input
                    type="number"
                    defaultValue={job.monthlySalary}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val !== job.monthlySalary) {
                        updateJob(job.id, { monthlySalary: val });
                      }
                    }}
                    className="w-full pl-2 pr-10 py-1 text-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">сум</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateJob(job.id, { isActive: !job.isActive })}
                className={`p-2 rounded-lg transition-colors ${
                  job.isActive 
                    ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' 
                    : 'text-slate-400 bg-slate-100 dark:bg-zinc-800'
                }`}
                title={job.isActive ? 'Активен' : 'Неактивен'}
              >
                {job.isActive ? <CheckCircle size={20} /> : <Circle size={20} />}
              </button>
              
              <button
                onClick={() => deleteJob(job.id)}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Удалить"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={addJob} className="space-y-3">
        <input
          type="text"
          placeholder="Название источника"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full p-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Сумма дохода"
            value={newSalary}
            onChange={(e) => setNewSalary(e.target.value)}
            className="flex-1 p-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <button
            type="submit"
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm active:scale-95"
          >
            <Plus size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}

import { TrendingUp as TrendingUpIcon } from 'lucide-react';
const TrendingUp = TrendingUpIcon;
