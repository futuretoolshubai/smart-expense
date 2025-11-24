import React from 'react';
import { AppSettings, ThemeColor } from '../types';
import { Moon, Sun, Download, Lock, RefreshCcw, CreditCard, Check } from 'lucide-react';
import { THEME_COLORS, CURRENCIES } from '../constants';

interface SettingsProps {
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
  onExport: () => void;
  onReset: () => void;
  onLock: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, updateSettings, onExport, onReset, onLock }) => {
  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
        Settings
      </h2>

      {/* Financial Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm">
           <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-white">
             <CreditCard className="w-5 h-5 text-blue-500" />
             Financial Preferences
           </h3>
        </div>
        <div className="p-5 space-y-5">
           <div>
             <label className="block text-sm font-semibold text-slate-500 mb-2">Currency</label>
             <div className="relative">
               <select 
                 value={settings.currency}
                 onChange={(e) => updateSettings({ currency: e.target.value })}
                 className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 appearance-none focus:ring-2 focus:ring-blue-500 outline-none font-medium text-lg"
               >
                 {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.symbol}>
                        {c.code} - {c.name} ({c.symbol})
                    </option>
                 ))}
               </select>
               <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
               </div>
             </div>
           </div>

           <div>
             <label className="block text-sm font-semibold text-slate-500 mb-2">Initial Balance</label>
             <div className="relative">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">{settings.currency}</span>
               <input 
                 type="number"
                 value={settings.initialBalance}
                 onChange={(e) => updateSettings({ initialBalance: parseFloat(e.target.value) || 0 })}
                 className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-lg"
                 placeholder="0.00"
               />
             </div>
             <p className="text-xs text-slate-400 mt-2 ml-1">Starting amount in your account.</p>
           </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="font-bold text-slate-800 dark:text-white">Appearance</h3>
        </div>
        <div className="p-5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${settings.darkMode ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'}`}>
                {settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <span className="font-medium">Dark Mode</span>
            </div>
            <button
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className={`w-14 h-8 rounded-full transition-colors relative shadow-inner ${settings.darkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <div className={`w-6 h-6 rounded-full bg-white shadow-sm absolute top-1 transition-all duration-300 ${settings.darkMode ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div>
             <p className="text-sm font-semibold text-slate-500 mb-4">App Theme</p>
             <div className="flex gap-4">
               {(Object.keys(THEME_COLORS) as ThemeColor[]).map((color) => (
                 <button
                    key={color}
                    onClick={() => updateSettings({ themeColor: color })}
                    className={`group relative w-12 h-12 rounded-2xl ${THEME_COLORS[color]} transition-transform hover:scale-105 active:scale-95`}
                 >
                    {settings.themeColor === color && (
                        <div className="absolute inset-0 flex items-center justify-center text-white">
                            <Check size={20} strokeWidth={3} />
                        </div>
                    )}
                 </button>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="font-bold text-slate-800 dark:text-white">Data Control</h3>
        </div>
        <div className="p-2 space-y-1">
          <button 
            onClick={onExport}
            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left group"
          >
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
              <Download size={20} />
            </div>
            <div>
              <p className="font-semibold">Export Data</p>
              <p className="text-xs text-slate-500">Download CSV report</p>
            </div>
          </button>

          <button 
             onClick={onLock}
             className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left group"
          >
             <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
               <Lock size={20} />
             </div>
             <div>
               <p className="font-semibold">App Lock</p>
               <p className="text-xs text-slate-500">Secure with passcode</p>
             </div>
          </button>

          <button 
            onClick={onReset}
            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors text-left group"
          >
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl group-hover:scale-110 transition-transform">
              <RefreshCcw size={20} />
            </div>
            <div>
              <p className="font-semibold text-rose-600">Reset All Data</p>
              <p className="text-xs text-rose-400">Cannot be undone</p>
            </div>
          </button>
        </div>
      </div>
      
      <div className="text-center py-4">
        <p className="text-xs text-slate-400 font-medium">SmartExpense v2.0</p>
      </div>
    </div>
  );
};