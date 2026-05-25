"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface FinanceChartProps {
  data: CategoryData[];
  title: string;
}

export default function FinanceChart({ data, title }: FinanceChartProps) {
  const isEmpty = data.length === 0 || data.every(d => d.value === 0);

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 flex flex-col min-h-[480px]">
      <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-zinc-100">{title}</h3>
      <div className="flex-1 w-full relative flex flex-col">
        {isEmpty ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-zinc-500 italic text-sm">
            Нет данных для отображения
          </div>
        ) : (
          <>
            <div className="flex-1 min-h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--background)', 
                      borderRadius: '12px', 
                      border: '1px solid var(--border)', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      zIndex: 50
                    }}
                    itemStyle={{ color: 'var(--foreground)', fontSize: '12px', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Кастомная легенда для предотвращения вылета из контейнера */}
            <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2">
              {data.map((entry, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-[11px] font-bold text-slate-600 dark:text-zinc-400 whitespace-nowrap">
                    {entry.name}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
