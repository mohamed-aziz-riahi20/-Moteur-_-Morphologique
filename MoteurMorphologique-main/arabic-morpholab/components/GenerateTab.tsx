import React, { useState, useEffect } from 'react';
import { morphologyApi } from '../services/api';
import { MorphologyRequest } from '../types';
import SearchableSelect from './SearchableSelect';

const GenerateTab: React.FC = () => {
  const [root, setRoot] = useState('');
  const [scheme, setScheme] = useState('');
  const [rootsList, setRootsList] = useState<string[]>([]);
  const [schemesList, setSchemesList] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Chargement initial des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [r, s] = await Promise.all([
          morphologyApi.getRoots(),
          morphologyApi.getSchemes()
        ]);
        setRootsList(r);
        setSchemesList(s);
      } catch (e) {
        console.error("Erreur chargement listes", e);
      }
    };
    fetchData();
  }, []);

  const handleGenerate = async () => {
    if (!root || !scheme) return;
    setLoading(true);
    setResult(null);
    setResults([]);
    try {
      const res = await morphologyApi.generate({ root, scheme });
      setResult(res);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAll = async () => {
    if (!root) return;
    setLoading(true);
    setResult(null);
    setResults([]);
    try {
      const res = await morphologyApi.generateAll({ root });
      setResults(res);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 dark:text-slate-100">
          <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l2.25 2.25a1 1 0 001.428 0l4.5-4.5a1 1 0 00-1.428-1.417L10 11.59 8.713 9.539z" clipRule="evenodd" />
            </svg>
          </span>
          Génération Morphologique
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SearchableSelect
            label="Racine (3 lettres)"
            value={root}
            onChange={setRoot}
            placeholder="Ex: كتب"
            options={rootsList}
          />
          <SearchableSelect
            label="Schème (Optionnel)"
            value={scheme}
            onChange={setScheme}
            placeholder="Ex: فاعل"
            options={schemesList}
          />
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={handleGenerate}
            disabled={loading || !root || !scheme}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 transition-colors shadow-lg shadow-emerald-200 dark:shadow-none"
          >
            {loading ? 'Génération...' : 'Générer Word'}
          </button>
          <button
            onClick={handleGenerateAll}
            disabled={loading || !root}
            className="px-6 py-2.5 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-emerald-600 dark:border-emerald-900 rounded-xl font-medium hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
          >
            Générer tous les dérivés
          </button>
        </div>
      </div>
      {(result || results.length > 0) && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-4">Résultats</h3>
         
          {result && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-between border border-emerald-100 dark:border-emerald-900/40 mb-4">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Mot généré :</span>
              <span className="arabic-font text-3xl text-emerald-700 dark:text-emerald-400">{result}</span>
            </div>
          )}
          {results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {results.map((word, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all cursor-default group">
                  <span className="arabic-font text-2xl text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{word}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default GenerateTab;