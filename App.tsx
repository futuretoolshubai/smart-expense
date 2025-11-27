import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { Transaction, AppSettings } from './types';
import { INITIAL_TRANSACTIONS, THEME_COLORS, ADMOB_IDS } from './constants';
import { LayoutDashboard, PieChart, List, Settings as SettingsIcon, ShieldCheck } from 'lucide-react';
import { Logo } from './components/Logo';
import { BannerAd, InterstitialAd } from './components/AdMob';

// Helper for safe color classes
const TEXT_COLORS: Record<string, string> = {
  blue: 'text-blue-600',
  green: 'text-emerald-600',
  purple: 'text-violet-600',
  orange: 'text-orange-600',
};

const BG_COLORS: Record<string, string> = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  purple: 'bg-violet-500',
  orange: 'bg-orange-500',
};

export default function App() {
  // --- State ---
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'analytics' | 'settings'>('dashboard');
  
  const [settings, setSettings] = useState<AppSettings>({
    currency: '$',
    themeColor: 'blue',
    darkMode: false,
    passcode: '1234',
    initialBalance: 0,
  });

  const [isLocked, setIsLocked] = useState(false);
  const [lockInput, setLockInput] = useState('');

  // Ad State
  const [showInterstitial, setShowInterstitial] = useState(false);

  // --- Effects ---
  useEffect(() => {
    // Apply Dark Mode
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // --- Handlers ---
  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...t,
      id: crypto.randomUUID(),
    };
    setTransactions([newTransaction, ...transactions]);
    
    // Trigger Interstitial Ad after adding transaction
    setTimeout(() => {
        setShowInterstitial(true);
    }, 800);
  };

  const deleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const exportData = () => {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
    const rows = transactions.map(t => [
      t.date,
      t.type,
      t.category,
      t.description,
      t.amount
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "SmartExpense_Export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetData = () => {
    if (window.confirm('This will delete all data permanently. Are you sure?')) {
      setTransactions([]);
    }
  };

  // --- Lock Screen ---
  if (isLocked) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 transition-colors duration-500">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-black/50 text-center space-y-8 animate-in zoom-in-95 duration-300">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/30">
               <ShieldCheck size={48} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
            <p className="text-slate-500 dark:text-slate-400">Please enter your passcode to access your finances.</p>
          </div>
          
          <div className="space-y-4">
            <input
                type="password"
                value={lockInput}
                onChange={(e) => setLockInput(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-center text-slate-900 dark:text-white text-3xl tracking-[0.5em] font-bold focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="••••"
                maxLength={4}
                autoFocus
            />
            <button
                onClick={() => {
                if (lockInput === settings.passcode) {
                    setIsLocked(false);
                    setLockInput('');
                } else {
                    alert('Incorrect passcode. Default is 1234.');
                }
                }}
                className="w-full bg-slate-900 dark:bg-blue-600 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all active:scale-[0.98]"
            >
                Unlock App
            </button>
          </div>
          <div className="pt-4">
             <p className="text-xs text-slate-400">Secured by Smart Expenses Tracker</p>
          </div>
        </div>
      </div>
    );
  }

  // --- Main App Layout ---
  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans selection:bg-blue-500/30 ${settings.darkMode ? 'dark' : ''}`}>
      
      {/* Interstitial Ad Layer */}
      <InterstitialAd 
        isOpen={showInterstitial} 
        onClose={() => setShowInterstitial(false)} 
        unitId={ADMOB_IDS.INTERSTITIAL} 
      />

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 h-screen sticky top-0 z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 flex-shrink-0">
             <Logo />
          </div>
          <h1 className="font-bold text-lg leading-tight tracking-tight text-slate-900 dark:text-white">Smart Expenses Tracker</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-2">
          <NavButton 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={<LayoutDashboard size={20} />} 
            label="Overview" 
            color={settings.themeColor}
          />
          <NavButton 
            active={activeTab === 'transactions'} 
            onClick={() => setActiveTab('transactions')} 
            icon={<List size={20} />} 
            label="Transactions" 
            color={settings.themeColor}
          />
          <NavButton 
            active={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')} 
            icon={<PieChart size={20} />} 
            label="Analytics" 
            color={settings.themeColor}
          />
          
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">System</h3>
            <NavButton 
                active={activeTab === 'settings'} 
                onClick={() => setActiveTab('settings')} 
                icon={<SettingsIcon size={20} />} 
                label="Settings" 
                color={settings.themeColor}
            />
          </div>
        </nav>

        <div className="p-6">
           <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                ME
             </div>
             <div className="flex-1 min-w-0">
               <p className="font-bold text-sm text-slate-900 dark:text-white truncate">My Profile</p>
               <p className="text-xs text-slate-500 truncate">Pro Account</p>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden relative bg-slate-50/50 dark:bg-black/20 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200/50 dark:border-slate-800">
           <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex-shrink-0">
                <Logo />
            </div>
            <h1 className="font-bold text-base leading-tight text-slate-900 dark:text-white">Smart Expenses Tracker</h1>
           </div>
           <button onClick={() => setIsLocked(true)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
             <ShieldCheck size={22} />
           </button>
        </header>

        <div className="flex-1 p-4 md:p-10 max-w-6xl mx-auto w-full min-h-[calc(100vh-140px)]">
          {activeTab === 'dashboard' && (
            <Dashboard 
              transactions={transactions} 
              settings={settings} 
              onUpdateInitialBalance={(val) => setSettings({...settings, initialBalance: val})}
            />
          )}
          {activeTab === 'transactions' && <TransactionList transactions={transactions} onAdd={addTransaction} onDelete={deleteTransaction} settings={settings} />}
          {activeTab === 'analytics' && <Analytics transactions={transactions} settings={settings} />}
          {activeTab === 'settings' && (
            <Settings 
              settings={settings} 
              updateSettings={(s) => setSettings({...settings, ...s})} 
              onExport={exportData}
              onReset={resetData}
              onLock={() => setIsLocked(true)}
            />
          )}
        </div>

        {/* AdMob Banner (Sticky at Bottom of Content, above Mobile Nav) */}
        <div className="sticky bottom-0 z-30 md:static md:z-0 pb-[80px] md:pb-0">
           <BannerAd unitId={ADMOB_IDS.BANNER} />
        </div>
      </main>

      {/* Bottom Nav (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe pt-2 px-6 flex justify-between z-40 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] dark:shadow-none h-[80px]">
          <MobileNavBtn active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={24} />} label="Home" color={settings.themeColor} />
          <MobileNavBtn active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} icon={<List size={24} />} label="Activity" color={settings.themeColor} />
          <MobileNavBtn active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<PieChart size={24} />} label="Charts" color={settings.themeColor} />
          <MobileNavBtn active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<SettingsIcon size={24} />} label="Menu" color={settings.themeColor} />
      </nav>
    </div>
  );
}

// --- Helper Components ---

const NavButton = ({ active, onClick, icon, label, color }: any) => {
  const activeClass = `bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white font-bold shadow-sm`;
  const inactiveClass = "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200";
  
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? activeClass : inactiveClass}`}
    >
      <div className={`${active ? TEXT_COLORS[color] || 'text-blue-600' : ''}`}>
        {icon}
      </div>
      <span className="text-sm">{label}</span>
      {active && <div className={`ml-auto w-1.5 h-1.5 rounded-full ${BG_COLORS[color] || 'bg-blue-500'}`}></div>}
    </button>
  );
};

const MobileNavBtn = ({ active, onClick, icon, label, color }: any) => {
   return (
     <button onClick={onClick} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${active ? TEXT_COLORS[color] || 'text-blue-600' : 'text-slate-400'}`}>
       {icon}
       <span className="text-[10px] font-medium">{label}</span>
     </button>
   );
}