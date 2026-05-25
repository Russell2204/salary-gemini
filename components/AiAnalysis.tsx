"use client";

import { useState } from 'react';
import { Sparkles, Loader2, BrainCircuit, Lightbulb, TrendingUp } from 'lucide-react';

interface AnalysisData {
  analysis: string;
  tips: string[];
  forecast: string;
}

export default function AiAnalysis() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze', { method: 'POST' });
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при анализе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20 mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Sparkles className="text-blue-200 animate-pulse" size={24} />
            <h2 className="text-xl font-bold">Искусственный интеллект Gemini</h2>
          </div>
          <p className="text-blue-100 text-sm max-w-md">
            Получите персональный анализ ваших финансов и советы по оптимизации бюджета с помощью AI.
          </p>
        </div>
        
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-2xl font-bold hover:bg-blue-50 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Анализируем...
            </>
          ) : (
            <>
              <BrainCircuit size={20} />
              Проанализировать
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-rose-500/20 border border-rose-500/30 rounded-xl text-sm">
          {error}
        </div>
      )}

      {data && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
            <div className="flex items-center gap-2 mb-3 text-blue-200">
              <BrainCircuit size={18} />
              <h3 className="font-bold uppercase text-xs tracking-wider">Анализ</h3>
            </div>
            <p className="text-sm leading-relaxed">{data.analysis}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
            <div className="flex items-center gap-2 mb-3 text-blue-200">
              <Lightbulb size={18} />
              <h3 className="font-bold uppercase text-xs tracking-wider">Советы</h3>
            </div>
            <ul className="space-y-3">
              {data.tips.map((tip, i) => (
                <li key={i} className="text-sm flex gap-2">
                  <span className="text-blue-300 font-bold">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
            <div className="flex items-center gap-2 mb-3 text-blue-200">
              <TrendingUp size={18} />
              <h3 className="font-bold uppercase text-xs tracking-wider">Прогноз</h3>
            </div>
            <p className="text-sm leading-relaxed">{data.forecast}</p>
          </div>
        </div>
      )}
    </div>
  );
}
