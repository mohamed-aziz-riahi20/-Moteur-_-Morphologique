
import React, { useState, useEffect } from 'react';
import { TabType } from './types';
import GenerateTab from './components/GenerateTab';
import ValidateTab from './components/ValidateTab';
import SchemeTab from './components/SchemeTab';
import DerivativesTab from './components/DerivativesTab';
import VisualizerTab from './components/VisualizerTab';
import TransformationsTab from './components/TransformationsTab';
import Statistics from './components/Statistics';
import { morphologyApi } from './services/api';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('generate');
  const [darkMode, setDarkMode] = useState(false);

    /* ===== AJOUT STATISTIQUES ===== */
  const [roots, setRoots] = useState<any[]>([]);
  const [patterns, setPatterns] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRoots: 0,
    totalPatterns: 0,
    totalDerivatives: 0,
    density: '0.0',
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

    /* ===== AJOUT STATISTIQUES ===== */
  useEffect(() => {
    if (activeTab === 'statistics') {
      const fetchStatistics = async () => {
        try {
          const data = await morphologyApi.getStatistics();

          setRoots(Object.values(data.roots || {}));
          setPatterns(new Array(data.totalPatterns).fill({}));

          setStats({
            totalRoots: data.totalRoots,
            totalPatterns: data.totalPatterns,
            totalDerivatives: data.totalDerivatives,
            density: data.density.toFixed(1),
          });
        } catch (e) {
          console.error('Erreur chargement statistiques', e);
        }
      };

      fetchStatistics();
    }
  }, [activeTab]);


  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'generate', 
      label: 'Génération', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> 
    },
    { 
      id: 'validate', 
      label: 'Validation', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
    },
    { 
      id: 'schemes', 
      label: 'Schèmes', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg> 
    },
    { 
      id: 'derivatives', 
      label: 'Historique', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
    },
    { 
      id: 'visualize', 
      label: 'Visualisation', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> 
    },
    
    {
      id: 'transformations',
      label: 'Transformations',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
    },
       {
      id: 'statistics',
      label: 'Statistiques',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'generate': return <GenerateTab />;
      case 'validate': return <ValidateTab />;
      case 'schemes': return <SchemeTab />;
      case 'derivatives': return <DerivativesTab />;
      case 'visualize': return <VisualizerTab />;
      case 'transformations': return <TransformationsTab />;
      case 'statistics':
        return (
          <Statistics
            roots={roots}
            patterns={patterns}
            stats={stats}
          />);
      default: return <GenerateTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-emerald-100 dark:selection:bg-emerald-900/50 selection:text-emerald-900 dark:selection:text-emerald-100 transition-theme">
      {/* Sidebar - Desktop */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col z-20 shadow-sm transition-theme">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5a18.022 18.022 0 01-3.827-5.802m3.383 0a18.064 18.064 0 011.583 5.15m6.202 5.24c-2.364.524-4.742.781-7.12.772a23.333 23.333 0 01-4.592-.452L3 20l3-3h.01M21 16a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">MorphoLab</h1>
          </div>

          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-900/40' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-6">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Thème</span>
            <button 
              onClick={toggleDarkMode}
              className="p-2 bg-white dark:bg-slate-700 text-amber-500 dark:text-indigo-400 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 hover:scale-110 transition-transform"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-slate-400 text-center">
            Arabic Morphological Lab v1.1
            <br />
            Built with Spring & React
          </p>
        </div>
      </aside>

      {/* Mobile Nav - Top */}
      <nav className="lg:hidden fixed top-0 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-30 px-6 py-4 flex items-center justify-between transition-theme">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 text-white p-1.5 rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5a18.022 18.022 0 01-3.827-5.802m3.383 0a18.064 18.064 0 011.583 5.15m6.202 5.24c-2.364.524-4.742.781-7.12.772a23.333 23.333 0 01-4.592-.452L3 20l3-3h.01M21 16a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
          </div>
          <h1 className="text-lg font-bold dark:text-slate-100">MorphoLab</h1>
        </div>
        <button onClick={toggleDarkMode} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
           {darkMode ? '☀️' : '🌙'}
        </button>
      </nav>

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 lg:pt-0 min-h-screen transition-theme">
        <div className="max-w-4xl mx-auto p-6 lg:p-12">
          <header className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Système intelligent d'analyse et de génération de la morphologie arabe.
            </p>
          </header>

          <div className="relative pb-24 lg:pb-0">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Mobile Tab Bar - Bottom */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-30 px-2 py-3 flex items-center justify-around shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-theme">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-200 px-3 ${
              activeTab === tab.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
            }`}
          >
            {tab.icon}
            <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
