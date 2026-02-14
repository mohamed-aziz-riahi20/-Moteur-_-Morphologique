import React, { useState, useEffect } from 'react';
import { morphologyApi } from '../services/api';
import { ValidationResult } from '../types';
import SearchableSelect from './SearchableSelect';
import ArabicInput from './ArabicInput';

const ValidateTab: React.FC = () => {
  const [rootsList, setRootsList] = useState<string[]>([]);
  const [root, setRoot] = useState('');
  const [word, setWord] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
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

  const handleValidate = async () => {
    if (!root || !word) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await morphologyApi.validate({ root, word });
      setResult(res);
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
          <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.925-2.438 9.284-6.166 11.953a11.954 11.954 0 01-3.668 1.82 11.953 11.953 0 01-8.166-11.953c0-.68.056-1.35.166-2.001zm6.547 4.54a1 1 0 00-1.428 1.417l2.25 2.25a1 1 0 001.428 0l4.5-4.5a1 1 0 00-1.428-1.417L10 11.59 8.713 9.539z" clipRule="evenodd" />
            </svg>
          </span>
          Validation Morphologique
        </h2>
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SearchableSelect
            label="Racine"
            value={root}
            onChange={setRoot}
            placeholder="Ex: كتب"
            options={rootsList}
          />
          <ArabicInput
            label="Mot à valider"
            value={word}
            onChange={setWord}
            placeholder="Ex: كاتب"
          />
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={handleValidate}
            disabled={loading || !root || !word}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 transition-colors shadow-lg shadow-emerald-200 dark:shadow-none"
          >
            {loading ? 'Validation en cours...' : 'Vérifier la validité'}
          </button>
        </div>
        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
            {error}
          </div>
        )}
      </div>
      {result && (
        <div className={`p-8 rounded-2xl border-2 transition-all duration-500 ${result.valid ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-full ${result.valid ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
              {result.valid ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${result.valid ? 'text-emerald-800' : 'text-red-800'}`}>
                {result.valid ? 'Mot Valide !' : 'Mot Non Valide'}
              </h3>
              <p className="text-slate-600">Résultat de l'analyse structurelle</p>
            </div>
          </div>
          {result.valid && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/50 p-4 rounded-xl border border-emerald-100">
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Racine identifiée</p>
                <p className="arabic-font text-3xl text-emerald-700">{result.root}</p>
              </div>
              <div className="bg-white/50 p-4 rounded-xl border border-emerald-100">
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Schème détecté</p>
                <p className="arabic-font text-3xl text-emerald-700">{result.scheme}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ValidateTab;