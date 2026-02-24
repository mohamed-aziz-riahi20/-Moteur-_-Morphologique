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
  const [resultScheme, setResultScheme] = useState<string | null>(null);
  const [results, setResults] = useState<Array<{ derivative: string; scheme: string }>>([]);
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
    setResultScheme(null);
    setResults([]);
    try {
      const res = await morphologyApi.generate({ root, scheme });
      setResult(res);
      setResultScheme(scheme);
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
    setResultScheme(null);
    setResults([]);
    try {
      const res = await morphologyApi.generateAll({ root });
      
      // ✅ Vérification complète et sécurisée
      if (res && Array.isArray(res) && res.length > 0) {
        const firstElement = res[0];
        
        // Cas 1: L'API retourne déjà des objets {derivative, scheme}
        if (
          firstElement && 
          typeof firstElement === 'object' && 
          !Array.isArray(firstElement) &&
          'derivative' in firstElement && 
          'scheme' in firstElement
        ) {
          console.log('✅ API retourne déjà le bon format');
          const formattedResults = res.map((item: any) => ({
  derivative: item.derivative,
  scheme: item.scheme
}));
setResults(formattedResults);
        } 
        // Cas 2: L'API retourne juste des strings
        else if (typeof firstElement === 'string') {
          console.log('⚙️ Génération manuelle des schèmes');
          const derivativesWithSchemes: Array<{ derivative: string; scheme: string }> = [];
          
          // Générer un mot pour chaque schème disponible
          for (const currentScheme of schemesList) {
            try {
              const derivative = await morphologyApi.generate({ root, scheme: currentScheme });
              if (derivative) {
                derivativesWithSchemes.push({
                  derivative: derivative,
                  scheme: currentScheme
                });
              }
            } catch (err) {
              // Ignorer les erreurs pour les schèmes non applicables
              
            }
          }
          
          setResults(derivativesWithSchemes);
        } else {
          console.warn('⚠️ Format de réponse inattendu:', firstElement);
          setResults([]);
        }
      } else {
        // Aucun résultat
        console.log('⚠️ Aucun résultat retourné par l\'API');
        setResults([]);
      }
    } catch (err: any) {
      console.error('Erreur:', err);
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
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/40 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Mot généré :</span>
                <span className="arabic-font text-3xl text-emerald-700 dark:text-emerald-400">{result}</span>
              </div>
              {resultScheme && (
                <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Schème utilisé :</span>
                  <span className="arabic-font text-xl text-teal-600 dark:text-teal-400 font-medium">{resultScheme}</span>
                </div>
              )}
            </div>
          )}
          {results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {results.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md transition-all cursor-default group"
                >
                  {/* Mot dérivé */}
                  <div className="text-center mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                    <span className="arabic-font text-2xl text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-bold">
                      {item.derivative}
                    </span>
                  </div>
                  
                  {/* Schème */}
                  <div className="text-center">
                    <div className="text-xs text-slate-500 dark:text-slate-500 mb-1">Schème</div>
                    <span className="arabic-font text-lg text-teal-600 dark:text-teal-400 font-medium">
                      {item.scheme}
                    </span>
                  </div>
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