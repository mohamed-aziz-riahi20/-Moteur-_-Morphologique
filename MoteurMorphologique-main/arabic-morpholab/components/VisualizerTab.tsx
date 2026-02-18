import React, { useState, useEffect } from 'react';
import { morphologyApi } from '../services/api';
import { AVLNode, HashTableStructure } from '../types';

const VisualizerTab: React.FC = () => {
  const [view, setView] = useState<'avl' | 'hash'>('avl');
  const [treeData, setTreeData] = useState<AVLNode | null>(null);
  const [hashData, setHashData] = useState<HashTableStructure | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshData();
  }, [view]);

  const refreshData = async () => {
    setLoading(true);
    try {
      if (view === 'avl') {
        const data = await morphologyApi.getTreeStructure();
        setTreeData(data);
      } else {
        const data = await morphologyApi.getHashStructure();
        if (Array.isArray(data)) {
          setHashData({ buckets: data }); 
        }
      }
    } catch (e) {
      console.error("Erreur de chargement des structures", e);
      setHashData({ buckets: [] }); 
    } finally {
      setLoading(false);
    }
  };

  // Design original de l'arbre conservé
  const renderAVLNode = (node: AVLNode | undefined) => {
    if (!node) return null;
    return (
      <div className="flex flex-col items-center">
        <div className="bg-emerald-100 dark:bg-emerald-900/40 border-2 border-emerald-500 p-3 rounded-full shadow-md z-10 w-16 h-16 flex flex-col items-center justify-center">
          <span className="arabic-font text-xl font-bold text-emerald-800 dark:text-emerald-200">{node.root}</span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400">h={node.height}</span>
        </div>
        <div className="flex gap-8 mt-8 relative">
          {node.left && <div className="absolute top-[-32px] left-1/2 w-px h-8 bg-slate-300 dark:bg-slate-700 -translate-x-full -rotate-45 origin-top"></div>}
          {node.right && <div className="absolute top-[-32px] right-1/2 w-px h-8 bg-slate-300 dark:bg-slate-700 translate-x-full rotate-45 origin-top"></div>}
          
          <div className="flex-1">{renderAVLNode(node.left)}</div>
          <div className="flex-1">{renderAVLNode(node.right)}</div>
        </div>
      </div>
    );
  };

  return (
    /* Conteneur principal qui prend 100% de la largeur disponible */
    <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Barre d'outils / Sélecteur */}
      <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 w-fit shadow-sm">
        <button 
          onClick={() => setView('avl')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${view === 'avl' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          Arbre AVL (Racines)
        </button>
        <button 
          onClick={() => setView('hash')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${view === 'hash' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          Table de Hachage (Schèmes)
        </button>
      </div>

      {/* 
          CADRE DYNAMIQUE 
          - w-full : occupe toute la largeur
          - h-[calc(100vh-280px)] : occupe toute la hauteur restante de l'écran de l'utilisateur
      */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full overflow-hidden transition-all duration-300">
        <div className="h-[calc(100vh-280px)] min-h-[500px] overflow-auto p-4 md:p-10 custom-scrollbar">
          
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
               <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-slate-400 italic">Analyse des structures en cours...</p>
            </div>
          ) : view === 'avl' ? (
            /* Vue Arbre Dynamique : scroll horizontal si nécessaire */
            <div className="inline-block min-w-full min-h-full">
              <div className="flex justify-center pt-10">
                {treeData ? renderAVLNode(treeData) : (
                  <div className="text-slate-400 text-center mt-20">L'arbre est vide.</div>
                )}
              </div>
            </div>
          ) : (
            /* Vue Table : Les colonnes s'adaptent dynamiquement à la largeur de l'écran */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
              {hashData?.buckets.map((bucket, idx) => (
                <div key={idx} className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900/50 h-fit hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">Bucket {idx}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-full font-bold">
                      {bucket.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {bucket.length > 0 ? bucket.map((entry, eIdx) => (
                      <div key={eIdx} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-purple-50 dark:border-purple-900/20 text-sm shadow-sm">
                        <div className="font-bold arabic-font text-xl text-purple-700 dark:text-purple-300">{entry.key}</div>
                        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate opacity-70">{entry.value}</div>
                      </div>
                    )) : (
                      <div className="py-6 flex items-center justify-center text-[10px] text-slate-300 uppercase font-medium tracking-widest">
                        Vide
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
        </div>
      </div>

      {/* Petite légende footer */}
      <div className="flex items-center gap-6 px-4 text-[11px] font-medium text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span>Visualisation de l'Arbre (Auto-équilibré)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          <span>Distribution du Hachage</span>
        </div>
      </div>
    </div>
  );
};

export default VisualizerTab;