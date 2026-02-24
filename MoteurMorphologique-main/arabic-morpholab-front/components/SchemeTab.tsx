import React, { useState, useEffect } from 'react';
import { morphologyApi } from '../services/api';
import ArabicInput from './ArabicInput';
import ArabicKeyboard from './ArabicKeyboard';

const SchemeTab: React.FC = () => {
  const [schemeName, setSchemeName] = useState('');
  const [rule, setRule] = useState('');
  const [schemes, setSchemes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);

  // Gestion du clavier virtuel
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeField, setActiveField] = useState<'name' | 'rule' | null>(null);

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    try {
      const data = await morphologyApi.getSchemesDetails();
      setSchemes(data);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des schèmes");
    }
  };

  const handleKeyClick = (char: string) => {
    if (activeField === 'name') {
      setSchemeName((prev) => prev + char);
    } else if (activeField === 'rule') {
      setRule((prev) => prev + char);
    }
  };

  const handleBackspace = () => {
    if (activeField === 'name') {
      setSchemeName((prev) => prev.slice(0, -1));
    } else if (activeField === 'rule') {
      setRule((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmit = async () => {
    if (!schemeName.trim() || !rule.trim()) {
      setError("Le nom et la règle sont obligatoires");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      if (isEditing && editingName) {
        await morphologyApi.addScheme({ scheme: editingName, rule });
        setMessage("Schème mis à jour avec succès");
      } else {
        const msg = await morphologyApi.addScheme({ scheme: schemeName, rule });
        setMessage(msg || "Schème ajouté avec succès");
      }

      cancelEdit();
      await loadSchemes();
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'opération");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (name: string, currentRule: string) => {
    setSchemeName(name);
    setRule(currentRule);
    setIsEditing(true);
    setEditingName(name);
    setActiveField('rule');
    setShowKeyboard(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingName(null);
    setSchemeName('');
    setRule('');
    setShowKeyboard(false);
    setActiveField(null);
    setMessage(null);
    setError(null);
  };

  const handleDelete = async (name: string) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer le schème « ${name} » ?`)) return;

    try {
      await morphologyApi.deleteScheme(name);
      setMessage("Schème supprimé avec succès");
      await loadSchemes();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12" dir="ltr">
      
      {/* 1. Header avec Dégradé */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 p-10 rounded-[2.5rem] text-white shadow-2xl transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Gestion des Schèmes</h1>
            <p className="mt-3 text-lg text-indigo-100 font-medium">Contrôle des modèles et règles de dérivation morphologique</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl px-10 py-6 rounded-3xl border border-white/20 shadow-inner">
            <div className="text-5xl font-black text-emerald-400">{Object.keys(schemes).length}</div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold opacity-70 mt-2 text-center">Schèmes actifs</div>
          </div>
        </div>
      </div>

      {/* 2. Formulaire Pleine Largeur */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 sm:p-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-slate-800 dark:text-white flex items-center gap-4">
          <span className="w-1.5 h-10 bg-indigo-500 rounded-full"></span>
          {isEditing ? 'Modifier le schème actuel' : 'Ajouter un nouveau schème'}
        </h2>

        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Champ Nom du Schème */}
            <div className="space-y-3">
              <label className="block text-base font-bold text-slate-700 dark:text-slate-300 ml-2">
                اسم النمط (المفتاح)
              </label>
              <input
                dir="rtl"
                value={schemeName}
                onChange={(e) => setSchemeName(e.target.value)}
                onFocus={() => {
                  setActiveField('name');
                  setShowKeyboard(true);
                }}
                disabled={isEditing}
                placeholder="Ex: فاعل, مفعول..."
                className={`w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl text-right text-2xl arabic-font outline-none transition-all duration-300 dark:text-white 
                  ${activeField === 'name' ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg' : 'border-slate-100 dark:border-slate-700'} 
                  ${isEditing ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-200'}`}
              />
            </div>

            {/* Champ Règle الاشتقاقية */}
            <div className="space-y-3">
              <label className="block text-base font-bold text-slate-700 dark:text-slate-300 ml-2">
                القاعدة الاشتقاقية
              </label>
              <input
                dir="rtl"
                value={rule}
                onChange={(e) => setRule(e.target.value)}
                onFocus={() => {
                  setActiveField('rule');
                  setShowKeyboard(true);
                }}
                placeholder="{1}ا{2}{3}"
                className={`w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl text-right text-2xl arabic-font outline-none transition-all duration-300 dark:text-white
                  ${activeField === 'rule' ? 'border-emerald-500 ring-4 ring-emerald-500/10 shadow-lg' : 'border-slate-100 dark:border-slate-700'}`}
              />
            </div>
          </div>

          <p className="text-center text-slate-400 text-sm font-medium">
            Utilisez les jetons <span className="text-indigo-500 font-mono">{`{1} {2} {3}`}</span> pour représenter les lettres de la racine.
          </p>

          {/* Clavier Virtuel */}
          {showKeyboard && (
            <div className="py-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <ArabicKeyboard
                onKeyClick={handleKeyClick}
                onBackspace={handleBackspace}
                onClose={() => setShowKeyboard(false)}
              />
            </div>
          )}

          {/* Boutons d'Action */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 max-w-2xl mx-auto">
            <button
              onClick={handleSubmit}
              disabled={loading || !schemeName.trim() || !rule.trim()}
              className={`flex-[2] py-5 rounded-2xl font-black text-xl text-white shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-50 
                ${isEditing ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {loading ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Ajouter le schème'}
            </button>

            {isEditing && (
              <button
                onClick={cancelEdit}
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-500 py-5 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all"
              >
                Annuler
              </button>
            )}
          </div>

          {/* Alertes Messages */}
          {message && (
            <div className="p-5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-2xl text-center font-bold border border-emerald-100 animate-in zoom-in">
              {message}
            </div>
          )}
          {error && (
            <div className="p-5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-2xl text-center font-bold border border-red-100 animate-in zoom-in">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* 3. Liste des Schèmes */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-8 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h3 className="font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest text-sm">Liste des schèmes enregistrés</h3>
        </div>

        <div className="max-h-[800px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white dark:bg-slate-900 sticky top-0 z-10 border-b-2 border-slate-50">
              <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                <th className="p-6 text-center">Actions</th>
                <th className="p-6">Règle</th>
                <th className="p-6 text-right">Nom du Schème</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {Object.entries(schemes).map(([name, r]) => (
                <tr key={name} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors">
                  <td className="p-6">
                    <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button onClick={() => startEdit(name, rule)} className="p-3 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2.5 2.5 0 113.536 3.536L12 14.207l-4 1 1-4 9.414-9.414z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(name)} className="p-3 text-red-500 hover:bg-red-100 rounded-xl transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="p-6">
                    <code className="bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full text-sm font-mono border border-slate-200 dark:border-slate-700" dir="ltr">
                      {r}
                    </code>
                  </td>
                  <td className="p-6 text-right">
                    <span className="text-2xl arabic-font font-bold text-slate-800 dark:text-slate-100">{name}</span>
                  </td>
                </tr>
              ))}
              {Object.keys(schemes).length === 0 && (
                <tr>
                  <td colSpan={3} className="p-20 text-center text-slate-400 italic font-medium">Aucun schème enregistré pour le moment.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SchemeTab;