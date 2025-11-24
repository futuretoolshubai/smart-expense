import React from 'react';
import { AppSettings, ThemeColor } from '../types';
import { Moon, Sun, Download, Lock, RefreshCcw, CreditCard } from 'lucide-react';
import { THEME_COLORS } from '../constants';

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
      <h2 className="text-2xl font-bold">Settings</h2>

      {/* Financial Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
           <h3 className="font-semibold flex items-center gap-2">
             <CreditCard className="w-4 h-4 text-slate-500" />
             Financial
           </h3>
        </div>
        <div className="p-4 space-y-4">
           <div>
             <label className="block text-sm text-slate-500 mb-2">Currency Symbol</label>
             <select 
               value={settings.currency}
               onChange={(e) => updateSettings({ currency: e.target.value })}
               className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900"
             >
               <option value="$">USD ($)</option>
               <option value="€">EUR (€)</option>
               <option value="£">GBP (£)</option>
               <option value="₹">INR (₹)</option>
               <option value="¥">JPY (¥)</option>
               <option value="A$">AUD (A$)</option>
               <option value="C$">CAD (C$)</option>
               <option value="Fr">CHF (Fr)</option>
               <option value="¥">CNY (¥)</option>
               <option value="kr">SEK (kr)</option>
               <option value="NZ$">NZD (NZ$)</option>
               <option value="$">MXN ($)</option>
               <option value="S$">SGD (S$)</option>
               <option value="HK$">HKD (HK$)</option>
               <option value="kr">NOK (kr)</option>
               <option value="₩">KRW (₩)</option>
               <option value="₺">TRY (₺)</option>
               <option value="₽">RUB (₽)</option>
               <option value="R$">BRL (R$)</option>
               <option value="R">ZAR (R)</option>
               <option value="د.إ">AED (د.إ)</option>
               <option value="SAR">SAR (SAR)</option>
               <option value="₦">NGN (₦)</option>
             </select>
           </div>

           <div>
             <label className="block text-sm text-slate-500 mb-2">Initial Balance / Opening Balance</label>
             <div className="relative">
               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{settings.currency}</span>
               <input 
                 type="number"
                 value={settings.initialBalance}
                 onChange={(e) => updateSettings({ initialBalance: parseFloat(e.target.value) || 0 })}
                 className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900"
                 placeholder="0.00"
               />
             </div>
             <p className="text-xs text-slate-400 mt-1">This amount is added to your calculated total.</p>
           </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-semibold">Appearance</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.darkMode ? <Moon size={20} className="text-indigo-400" /> : <Sun size={20} className="text-amber-500" />}
              <span>Dark Mode</span>
            </div>
            <button
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.darkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.darkMode ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div>
             <p className="text-sm text-slate-500 mb-3">Accent Color</p>
             <div className="flex gap-3">
               {(Object.keys(THEME_COLORS) as ThemeColor[]).map((color) => (
                 <button
                    key={color}
                    onClick={() => updateSettings({ themeColor: color })}
                    className={`w-10 h-10 rounded-full ${THEME_COLORS[color]} ${settings.themeColor === color ? 'ring-4 ring-offset-2 ring-slate-200 dark:ring-slate-700' : ''}`}
                 />
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-semibold">Data & Privacy</h3>
        </div>
        <div className="p-4 space-y-3">
          <button 
            onClick={onExport}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
          >
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Download size={18} />
            </div>
            <div>
              <p className="font-medium">Export Data</p>
              <p className="text-xs text-slate-500">Download as CSV</p>
            </div>
          </button>

          <button 
             onClick={onLock}
             className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
          >
             <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
               <Lock size={18} />
             </div>
             <div>
               <p className="font-medium">App Lock</p>
               <p className="text-xs text-slate-500">Lock the app now</p>
             </div>
          </button>

          <button 
            onClick={onReset}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left group"
          >
            <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-100">
              <RefreshCcw size={18} />
            </div>
            <div>
              <p className="font-medium text-red-600">Reset Data</p>
              <p className="text-xs text-red-400">Clear all transactions</p>
            </div>
          </button>
        </div>
      </div>
      
      <div className="text-center text-xs text-slate-400">
        SmartExpense Tracker v1.1.0
      </div>
    </div>
  );
};