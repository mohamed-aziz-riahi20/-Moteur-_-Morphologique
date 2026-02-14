
import React, { useState, useEffect } from 'react';
import { morphologyApi } from '../services/api';
import { AVLNode, HashTableStructure, HashEntry } from '../types';

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
      // Le backend envoie directement le tableau de buckets [[], [], ...]
      // On l'enveloppe dans un objet pour correspondre à l'interface HashTableStructure
      if (Array.isArray(data)) {
        setHashData({ buckets: data }); 
      }
    }
  } catch (e) {
    console.error("Erreur de chargement des structures", e);
    setHashData({ buckets: [] }); // Éviter que ce soit undefined
  } finally {
    setLoading(false);
  }
};

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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 w-fit">
        <button 
          onClick={() => setView('avl')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${view === 'avl' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          Arbre AVL (Racines)
        </button>
        <button 
          onClick={() => setView('hash')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${view === 'hash' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          Table de Hachage (Schèmes)
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 min-h-[500px] overflow-auto">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-400 italic">Chargement de la structure...</div>
        ) : view === 'avl' ? (
          <div className="flex justify-center pt-10">
            {treeData ? renderAVLNode(treeData) : <p className="text-slate-400">Arbre vide.</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {hashData?.buckets.map((bucket, idx) => (
              <div key={idx} className="border border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400">INDEX {idx}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded">
                    {bucket.length} items
                  </span>
                </div>
                <div className="space-y-2">
                  {bucket.length > 0 ? bucket.map((entry, eIdx) => (
                    <div key={eIdx} className="bg-white dark:bg-slate-800 p-2 rounded border border-purple-100 dark:border-purple-900/40 text-sm shadow-sm">
                      <div className="font-bold arabic-font text-lg text-purple-700 dark:text-purple-300">{entry.key}</div>
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">{entry.value}</div>
                    </div>
                  )) : (
                    <div className="h-10 border border-dashed border-slate-200 dark:border-slate-800 rounded flex items-center justify-center text-[10px] text-slate-300">Empty</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizerTab;
