import React, { useState, useEffect, useRef } from 'react';

interface Props {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}

const SearchableSelect: React.FC<Props> = ({ label, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filtrer les options
  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fermer si clic extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2 relative" ref={wrapperRef}>
      <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">
        {label}
      </label>

      <div className="relative">
        <input
          type="text"
          className="w-full p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 transition-all arabic-font text-2xl text-right"
          placeholder={placeholder}
          value={isOpen ? searchTerm : value}
          onFocus={() => {
            setIsOpen(true);
            setSearchTerm(''); // Réinitialise pour tout voir
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 top-[105%] left-0 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto animate-in fade-in zoom-in duration-150">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => (
              <div
                key={idx}
                className="p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer border-b dark:border-slate-800 last:border-0 text-right arabic-font text-2xl transition-colors"
                onMouseDown={() => {
                  onChange(opt);
                  setIsOpen(false);
                  setSearchTerm(opt);
                }}
              >
                {opt}
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-slate-400 italic">Aucun résultat trouvé</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;