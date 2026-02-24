import React, { useState, useEffect } from 'react';
import { morphologyApi } from '../services/api';
import SearchableSelect from './SearchableSelect';

const DerivativesTab: React.FC = () => {
  const [rootsList, setRootsList] = useState<string[]>([]);
  const [root, setRoot] = useState('');
  const [derivatives, setDerivatives] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoots = async () => {
      try {
        const res = await morphologyApi.getRoots();
        setRootsList(res);
      } catch (e) {
        setError('Erreur chargement des racines');
      }
    };
    loadRoots();
  }, []);

  const handleFetch = async () => {
    if (!root) return;
    setLoading(true);
    setError(null);
    setDerivatives([]);
    try {
      const res = await morphologyApi.getDerivatives({ root });
      setDerivatives(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 dark:text-slate-100">
          <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
          </span>
          Historique des Dérivés
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <SearchableSelect
            label="Rechercher par racine"
            value={root}
            onChange={setRoot}
            placeholder="Ex: دخل"
            options={rootsList}
          />
          <button
            onClick={handleFetch}
            disabled={loading || !root}
            className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 transition-all shadow-lg shadow-amber-100 dark:shadow-none"
          >
            {loading ? 'Chargement...' : 'Afficher'}
          </button>
        </div>
        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/40 text-sm">
            {error}
          </div>
        )}
      </div>
      {derivatives.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-right" dir="rtl">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600 dark:text-slate-400">Mot Dérivé</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600 dark:text-slate-400">Fréquence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {derivatives.map((entry, idx) => {
                const parts = entry.split(' (f=');
                const word = parts[0];
                const freq = parts[1]?.replace(')', '') || '1';
                return (
                  <tr key={idx} className="hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-colors">
                    <td className="px-6 py-4 arabic-font text-2xl text-slate-700 dark:text-slate-200">{word}</td>
                    <td className="px-6 py-4 text-center font-mono">
                      <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold">
                        {freq}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : root && !loading && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-slate-400 dark:text-slate-500 italic">Aucun dérivé validé trouvé pour cette racine.</p>
        </div>
      )}
    </div>
  );
};

export default DerivativesTab;