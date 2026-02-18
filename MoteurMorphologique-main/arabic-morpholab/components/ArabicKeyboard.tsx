import React from 'react';

interface ArabicKeyboardProps {
  onKeyClick: (char: string) => void;
  onBackspace: () => void;
  onClose: () => void;
}

const ArabicKeyboard: React.FC<ArabicKeyboardProps> = ({ onKeyClick, onBackspace, onClose }) => {
  const rows = [
    ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
    ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
    ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ'],
    ['{1}', '{2}', '{3}'], // Raccourcis racines
  ];

  return (
    <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-300 dark:border-slate-600 mt-4 animate-in slide-in-from-bottom-3 duration-300 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
          لوحة المفاتيح العربية
        </span>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors text-sm font-medium flex items-center gap-1"
        >
          إغلاق ✕
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((row, i) => (
          <div key={i} className="flex flex-row-reverse justify-center gap-2 sm:gap-3">
            {row.map((char) => (
              <button
                key={char}
                onClick={() => onKeyClick(char)}
                className={`min-w-[50px] sm:min-w-[60px] h-12 sm:h-14 ${
                  char.length > 1 ? 'px-4 sm:px-5' : ''
                } bg-white dark:bg-slate-700 hover:bg-indigo-600 hover:text-white text-slate-900 dark:text-white rounded-xl shadow-md border border-slate-300 dark:border-slate-600 transition-all active:scale-95 font-arabic text-xl sm:text-2xl font-medium`}
              >
                {char}
              </button>
            ))}

            {i === 2 && (
              <button
                onClick={onBackspace}
                className="min-w-[60px] sm:min-w-[80px] h-12 sm:h-14 px-5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white rounded-xl shadow-md border border-red-200 dark:border-red-700 transition-all active:scale-95 flex items-center justify-center text-xl sm:text-2xl"
              >
                ⌫
              </button>
            )}
          </div>
        ))}

        {/* Barre d'espace plus large */}
        <div className="flex justify-center mt-3">
          <button
            onClick={() => onKeyClick(' ')}
            className="h-12 sm:h-14 w-64 sm:w-96 bg-white dark:bg-slate-700 hover:bg-indigo-600 hover:text-white rounded-xl border border-slate-300 dark:border-slate-600 shadow-md transition-all active:scale-95 text-xl sm:text-2xl font-medium"
          >
            مسافة
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArabicKeyboard;