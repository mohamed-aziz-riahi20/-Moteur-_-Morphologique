import React, { useState } from 'react';
import { morphologyApi } from '../services/api';
import ArabicInput from './ArabicInput';

const SchemeTab: React.FC = () => {
  const [schemeName, setSchemeName] = useState('');
  const [rule, setRule] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddScheme = async () => {
    if (!schemeName || !rule) return;
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await morphologyApi.addScheme({ scheme: schemeName, rule });
      setSuccess(res);
      setSchemeName('');
      setRule('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 dark:text-slate-100">
          <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </span>
          Ajouter un Nouveau Schème
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Enregistrez de nouvelles règles de dérivation morphologique.</p>
        
        <div className="space-y-6">
          <ArabicInput 
            label="Nom du Schème" 
            value={schemeName} 
            onChange={setSchemeName} 
            placeholder="Ex: فاعل"
          />
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Règle de remplacement</label>
            <input
              type="text"
              dir="rtl"
              value={rule}
              onChange={(e) => setRule(e.target.value)}
              placeholder="Ex: {1}ا{2}{3}"
              className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all arabic-font text-xl"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Utilisez <span className="font-mono text-purple-600 dark:text-purple-400">{`{1}, {2}, {3}`}</span> pour les lettres de la racine.
            </p>
          </div>

          <button
            onClick={handleAddScheme}
            disabled={loading || !schemeName || !rule}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 transition-all shadow-lg shadow-purple-200 dark:shadow-none"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer le Schème'}
          </button>
        </div>

        {success && (
          <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/40 text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="bg-slate-900 dark:bg-slate-900 border border-slate-800 text-white p-6 rounded-2xl shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-purple-300">Guide de Configuration</h3>
        <div className="space-y-3 text-sm text-slate-300">
          <p>Le système utilise des jetons de position pour les racines trilittères :</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><span className="text-purple-400 font-mono">{`{1}`}</span> : Première lettre</li>
            <li><span className="text-purple-400 font-mono">{`{2}`}</span> : Deuxième lettre</li>
            <li><span className="text-purple-400 font-mono">{`{3}`}</span> : Troisième lettre</li>
          </ul>
          <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="font-medium text-slate-100 mb-1">Exemple :</p>
            <p>Racine <span className="arabic-font text-lg text-emerald-400">كتب</span> + Schème <span className="font-mono text-purple-400">م{`{1}{2}`}و{`{3}`}</span> → <span className="arabic-font text-lg text-emerald-400">مكتوب</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeTab;