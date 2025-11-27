
import React from 'react';
import { AppSettings, ThemeColor } from '../types';
import { Moon, Sun, Download, Lock, RefreshCcw, Check, User, ChevronRight } from 'lucide-react';
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
    <div className="space-y-8 pb-24 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h2>
      </div>

      {/* Profile Mockup (Visual Only) */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <User size={32} className="text-slate-400" />
             </div>
             <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">John Doe</h3>
                <p className="text-slate-500 text-sm">Pro Member • SmartExpense ID: #8492</p>
             </div>
          </div>
          <button className="text-sm font-bold text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              Edit
          </button>
      </div>

      {/* Financial Settings */}
      <section>
          <h3 className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Financial Preferences</h3>
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700">
            
            {/* Currency */}
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <label className="block font-bold text-slate-900 dark:text-white mb-1">Primary Currency</label>
                    <p className="text-sm text-slate-500">Used for all calculations</p>
                </div>
                <div className="relative min-w-[150px]">
                    <select 
                        value={settings.currency}
                        onChange={(e) => updateSettings({ currency: e.target.value })}
                        className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-blue-500 font-bold text-right appearance-none cursor-pointer"
                    >
                        {CURRENCIES.map((c) => (
                            <option key={c.code} value={c.symbol}>
                                {c.code} ({c.symbol})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Opening Balance */}
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <label className="block font-bold text-slate-900 dark:text-white mb-1">Opening Balance</label>
                    <p className="text-sm text-slate-500">Initial amount in your account</p>
                </div>
                <div className="relative w-full md:w-40">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{settings.currency}</span>
                    <input 
                        type="number"
                        value={settings.initialBalance}
                        onChange={(e) => updateSettings({ initialBalance: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-blue-500 font-bold text-right"
                        placeholder="0.00"
                    />
                </div>
            </div>
          </div>
      </section>

      {/* App Interface */}
      <section>
        <h3 className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Interface</h3>
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700">
            
            {/* Dark Mode */}
            <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors" onClick={() => updateSettings({ darkMode: !settings.darkMode })}>
                <div className="flex items-center gap-4">
                   <div className={`p-3 rounded-xl ${settings.darkMode ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'}`}>
                      {settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
                   </div>
                   <span className="font-bold text-slate-900 dark:text-white">Dark Mode</span>
                </div>
                <div className={`w-14 h-8 rounded-full transition-colors relative shadow-inner ${settings.darkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                   <div className={`w-6 h-6 rounded-full bg-white shadow-sm absolute top-1 transition-all duration-300 ${settings.darkMode ? 'left-7' : 'left-1'}`} />
                </div>
            </div>

            {/* Accent Color */}
            <div className="p-6">
                <p className="font-bold text-slate-900 dark:text-white mb-4">Accent Theme</p>
                <div className="flex gap-4">
                {(Object.keys(THEME_COLORS) as ThemeColor[]).map((color) => (
                    <button
                        key={color}
                        onClick={() => updateSettings({ themeColor: color })}
                        className={`group relative w-12 h-12 rounded-2xl ${THEME_COLORS[color]} transition-transform hover:scale-105 active:scale-95 shadow-sm`}
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
      </section>

      {/* Security & Data */}
      <section>
        <h3 className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Security & Data</h3>
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <button 
                onClick={onLock}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group text-left border-b border-slate-100 dark:border-slate-700"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl">
                        <Lock size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white">App Lock</p>
                        <p className="text-xs text-slate-500">Require passcode on entry</p>
                    </div>
                </div>
                <ChevronRight size={20} className="text-slate-300" />
            </button>

            <button 
                onClick={onExport}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group text-left border-b border-slate-100 dark:border-slate-700"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                        <Download size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white">Export Data</p>
                        <p className="text-xs text-slate-500">Download CSV file</p>
                    </div>
                </div>
                <ChevronRight size={20} className="text-slate-300" />
            </button>

            <button 
                onClick={onReset}
                className="w-full flex items-center justify-between p-6 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors group text-left"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl group-hover:bg-rose-100">
                        <RefreshCcw size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-rose-600">Reset Everything</p>
                        <p className="text-xs text-rose-400">Clear all data permanently</p>
                    </div>
                </div>
            </button>
        </div>
      </section>
      
      <div className="text-center pt-8">
        <p className="text-xs text-slate-400 font-medium">SmartExpense v2.2.0 • Build 2024</p>
      </div>
    </div>
  );
};
