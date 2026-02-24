import React, { useState, useEffect, useMemo } from 'react';
import { morphologyApi } from '../services/api';
import type { TransformationGroup, TransformationRule } from '../types';

/**
 * Palette de couleurs par catégorie pour une identification rapide
 */
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  mithal: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  ajwaf: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  naqis: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  lafif: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  exception: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  default: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' }
};

const TransformationsTab: React.FC = () => {
  const [groups, setGroups] = useState<TransformationGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<TransformationGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await morphologyApi.getAllTransformations();
      setGroups(data);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filtrage et tri intelligent des groupes
   */
  const filteredGroups = useMemo(() => {
    return groups
      .filter(g => g.key.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   g.comment?.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [groups, searchQuery]);

  const getCategory = (key: string) => {
    const prefix = key.split('_')[0].toLowerCase();
    return CATEGORY_COLORS[prefix] || CATEGORY_COLORS.default;
  };

  // Actions (identiques à votre logique, mais avec une UI propre)
  const handleDelete = async (key: string) => {
    if (!window.confirm(`Supprimer définitivement le groupe "${key}" ?`)) return;
    try {
      await morphologyApi.deleteTransformationGroup(key);
      loadData();
    } catch (err: any) { alert(err.message); }
  };

  const saveEdit = async () => {
    if (!editing?.key.trim()) return;
    try {
      await morphologyApi.saveTransformationGroup(editing);
      setEditing(null);
      loadData();
    } catch (err: any) { alert(err.message); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Statistiques */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">Expertise Morphologique</h2>
          <p className="text-slate-500 mt-1">Configuration avancée des métamorphoses et exceptions.</p>
        </div>
        <div className="flex gap-3">
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-500 uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {groups.length} Groupes Actifs
          </div>
          <button
            onClick={() => setEditing({ key: '', rules: [], comment: '' })}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-emerald-200 dark:shadow-none hover:scale-105 active:scale-95"
          >
            + Nouvelle Règle
          </button>
        </div>
      </div>

      {/* Barre de Recherche */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input 
          type="text"
          placeholder="Rechercher par racine, type ou commentaire..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl outline-none focus:border-emerald-500 focus:ring-4 ring-emerald-500/5 transition-all shadow-sm"
        />
      </div>

      {/* Liste des Groupes */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
           <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
           <span className="text-slate-400 font-medium">Analyse du moteur de règles...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGroups.map(g => {
            const colors = getCategory(g.key);
            return (
              <div key={g.key} className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col">
                {/* Accent de couleur latéral */}
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${colors.bg.replace('bg-', 'bg-opacity-100 bg-')}`} />
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded-lg border ${colors.border} ${colors.text} ${colors.bg}`}>
                        {g.key.split('_')[0]}
                      </span>
                      <h3 className="text-xl font-bold mt-2 font-mono text-slate-700 dark:text-slate-200">
                        {g.key.split('_').slice(1).join('_') || g.key}
                      </h3>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditing(g)} className="p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(g.key)} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>

                  {g.comment && (
                    <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs text-slate-500 leading-relaxed italic whitespace-pre-line">
                      {g.comment.replace(/#/g, '').trim()}
                    </div>
                  )}

                  <div className="space-y-3">
                    {g.rules.map((r, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-50 dark:border-slate-700 shadow-sm group/rule">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-[10px] font-black ${r.type === 'replace_final' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {r.type === 'replace_final' ? 'FIN' : 'ALL'}
                        </div>
                        
                        <div className="flex-1 flex items-center justify-end gap-3 text-right">
                          {r.type === 'replace' && (
                            <>
                              <span className="arabic-font text-xl text-slate-400 line-through decoration-red-300">{r.from}</span>
                              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </>
                          )}
                          <span className="arabic-font text-2xl font-bold text-emerald-600">{r.to}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal d'édition ultra-moderne */}
      {editing && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-2xl shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">Configuration Morphologique</h3>
                <button onClick={() => setEditing(null)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors">✕</button>
              </div>

              <div className="space-y-8">
                <div className="relative">
                  <label className="text-[10px] font-black uppercase text-emerald-600 mb-2 block tracking-widest ml-4">Identifiant de la Règle</label>
                  <input
                    type="text"
                    value={editing.key}
                    onChange={e => setEditing({ ...editing, key: e.target.value })}
                    className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl outline-none focus:ring-4 ring-emerald-500/5 border-2 border-transparent focus:border-emerald-500 transition-all font-mono"
                    placeholder="ex: naqis_فاعل"
                  />
                </div>

                <div className="relative">
                  <label className="text-[10px] font-black uppercase text-emerald-600 mb-2 block tracking-widest ml-4">Notes Linguistiques</label>
                  <textarea
                    value={editing.comment || ''}
                    onChange={e => setEditing({ ...editing, comment: e.target.value })}
                    className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl outline-none border-2 border-transparent focus:border-emerald-500 transition-all min-h-[120px]"
                    placeholder="Décrivez le phénomène (ex: Idgham du Waw...)"
                  />
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-center px-4">
                     <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Séquence de Transformation</span>
                     <button 
                      onClick={() => setEditing({ ...editing, rules: [...editing.rules, { type: 'replace', from: '', to: '', order: editing.rules.length }] })}
                      className="text-emerald-600 font-bold text-sm hover:underline"
                    >
                      + Ajouter une étape
                    </button>
                   </div>
                   
                   <div className="max-h-60 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                     {editing.rules.map((rule, idx) => (
                       <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex flex-wrap md:flex-nowrap gap-4 items-end relative group/edit">
                          <button 
                            onClick={() => setEditing({ ...editing, rules: editing.rules.filter((_, i) => i !== idx) })}
                            className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs opacity-0 group-hover/edit:opacity-100 transition-opacity shadow-lg shadow-red-200"
                          >✕</button>
                          
                          <div className="w-full md:w-1/4">
                            <label className="text-[9px] font-bold text-slate-400 block mb-1">CIBLE</label>
                            <select
                              value={rule.type}
                              onChange={e => {
                                const newRules = [...editing.rules];
                                newRules[idx].type = e.target.value as any;
                                setEditing({ ...editing, rules: newRules });
                              }}
                              className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl text-xs border border-slate-100 dark:border-slate-700 outline-none"
                            >
                              <option value="replace">Global</option>
                              <option value="replace_final">Final</option>
                            </select>
                          </div>

                          <div className="flex-1">
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Original</label>
                            <input
                              type="text"
                              disabled={rule.type === 'replace_final'}
                              value={rule.from || ''}
                              onChange={e => {
                                const newRules = [...editing.rules];
                                newRules[idx].from = e.target.value;
                                setEditing({ ...editing, rules: newRules });
                              }}
                              className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl arabic-font text-xl border border-slate-100 dark:border-slate-700 outline-none text-right disabled:opacity-30"
                            />
                          </div>

                          <div className="flex-1">
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Transformé</label>
                            <input
                              type="text"
                              value={rule.to}
                              onChange={e => {
                                const newRules = [...editing.rules];
                                newRules[idx].to = e.target.value;
                                setEditing({ ...editing, rules: newRules });
                              }}
                              className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl arabic-font text-xl border border-slate-100 dark:border-slate-700 outline-none text-right"
                            />
                          </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <button 
                  onClick={() => setEditing(null)}
                  className="flex-1 py-4 rounded-3xl font-bold text-slate-400 hover:bg-slate-50 transition-all"
                >
                  Annuler
                </button>
                <button 
                  onClick={saveEdit}
                  className="flex-[2] py-4 bg-emerald-600 text-white rounded-3xl font-bold hover:bg-emerald-700 shadow-2xl shadow-emerald-200 dark:shadow-none transition-all"
                >
                  Sauvegarder les changements
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransformationsTab;