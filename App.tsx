import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { Transaction, AppSettings } from './types';
import { INITIAL_TRANSACTIONS, THEME_COLORS } from './constants';
import { LayoutDashboard, PieChart, List, Settings as SettingsIcon, LogIn } from 'lucide-react';

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
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetData = () => {
    if (window.confirm('This will delete all data. Are you sure?')) {
      setTransactions([]);
    }
  };

  // --- Lock Screen ---
  if (isLocked) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-slate-800 p-8 rounded-3xl shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-900/50">
             <LogIn size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">SmartExpense</h1>
          <p className="text-slate-400">Enter passcode to unlock</p>
          <input
            type="password"
            value={lockInput}
            onChange={(e) => setLockInput(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-center text-white text-xl tracking-widest focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="••••"
            maxLength={4}
          />
          <button
            onClick={() => {
              if (lockInput === settings.passcode) {
                setIsLocked(false);
                setLockInput('');
              } else {
                alert('Incorrect passcode (Try 1234)');
              }
            }}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors"
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  // --- Main App Layout ---
  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${settings.darkMode ? 'dark' : ''}`}>
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${THEME_COLORS[settings.themeColor]}`}></div>
          <h1 className="font-bold text-xl tracking-tight">SmartExpense</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavButton 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
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
          <NavButton 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
            icon={<SettingsIcon size={20} />} 
            label="Settings" 
            color={settings.themeColor}
          />
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
           <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">JD</div>
             <div className="text-xs">
               <p className="font-semibold">John Doe</p>
               <p className="text-slate-500">Free Plan</p>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden relative">
        <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800">
           <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-md ${THEME_COLORS[settings.themeColor]}`}></div>
            <h1 className="font-bold text-lg">SmartExpense</h1>
           </div>
           <button onClick={() => setIsLocked(true)} className="p-2 text-slate-500">
             <SettingsIcon size={20} />
           </button>
        </header>

        <div className="p-4 md:p-8 max-w-5xl mx-auto min-h-[calc(100vh-80px)]">
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
      </main>

      {/* Bottom Nav (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 flex justify-around z-20 pb-safe">
          <MobileNavBtn active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={24} />} color={settings.themeColor} />
          <MobileNavBtn active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} icon={<List size={24} />} color={settings.themeColor} />
          <MobileNavBtn active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<PieChart size={24} />} color={settings.themeColor} />
          <MobileNavBtn active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<SettingsIcon size={24} />} color={settings.themeColor} />
      </nav>
    </div>
  );
}

// --- Helper Components ---

const NavButton = ({ active, onClick, icon, label, color }: any) => {
  const activeClass = `bg-slate-100 dark:bg-slate-800 text-${color === 'orange' ? 'orange' : color === 'green' ? 'emerald' : color === 'purple' ? 'violet' : 'blue'}-600`;
  const inactiveClass = "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50";
  
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium ${active ? activeClass : inactiveClass}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

const MobileNavBtn = ({ active, onClick, icon, color }: any) => {
   const activeColorClass = color === 'orange' ? 'text-orange-600' : color === 'green' ? 'text-emerald-600' : color === 'purple' ? 'text-violet-600' : 'text-blue-600';
   return (
     <button onClick={onClick} className={`p-2 rounded-xl transition-colors ${active ? activeColorClass : 'text-slate-400'}`}>
       {icon}
     </button>
   );
}