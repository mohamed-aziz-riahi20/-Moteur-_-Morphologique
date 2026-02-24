import React from 'react';
import { Stats } from '../types';

interface StatisticsProps {
  roots: Record<string, { text: string; derivatives: string[] }>;
  patterns: any[];
  stats: Stats;
}

const Statistics: React.FC<StatisticsProps> = ({ roots, patterns, stats }) => {
  return (
    <div className="animate-fade-in space-y-8">
      {/* ===== CARTES ===== */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Total Racines</p>
          <p className="text-5xl font-bold text-amber-500">{stats.totalRoots}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Total Schèmes</p>
          <p className="text-5xl font-bold text-indigo-600">{stats.totalPatterns}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Total Dérivés</p>
          <p className="text-5xl font-bold text-emerald-600">{stats.totalDerivatives}</p>
        </div>
      </div>

      {/* ===== LISTE DES RACINES AVL ===== */}
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 bg-white p-8 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-bold text-slate-800 mb-6">
            Production par Racine (AVL complet)
          </h3>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
            {Object.values(roots).map((r, i) => (
              <div key={r.text} className="flex items-center gap-4">
                <span className="text-xs text-slate-400 w-6">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span className="font-arabic font-bold text-2xl text-slate-800 w-16 text-right">
                  {r.text}
                </span>

                <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width: `${
                        stats.totalDerivatives > 0
                          ? Math.max((r.derivatives.length / stats.totalDerivatives) * 100, 4)
                          : 0
                      }%`,
                    }}
                  />
                </div>

                <span className="text-sm font-bold text-slate-600 w-8 text-right">
                  {r.derivatives.length}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== COMPLEXITÉ ===== */}
        <div className="bg-[#1e293b] p-8 rounded-2xl text-white">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase mb-6">
            Complexité Algorithmique
          </h3>

          <div className="space-y-5">
            <div className="flex justify-between">
              <p>Recherche AVL</p>
              <span className="text-emerald-400 font-mono">
                O(log {stats.totalRoots})
              </span>
            </div>
            <div className="flex justify-between">
              <p>Hash Table</p>
              <span className="text-emerald-400 font-mono">O(1)</span>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
