import React, { useEffect, useState } from 'react';
import { Transaction, AppSettings, AiTip } from '../types';
import { ArrowUpCircle, ArrowDownCircle, Wallet, Sparkles, Loader2, Edit2, X, ChevronRight, Video } from 'lucide-react';
import { getFinancialAdvice } from '../services/geminiService';
import { RewardedAd } from './AdMob';
import { ADMOB_IDS } from '../constants';

interface DashboardProps {
  transactions: Transaction[];
  settings: AppSettings;
  onUpdateInitialBalance: (val: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, settings, onUpdateInitialBalance }) => {
  const [tips, setTips] = useState<AiTip[]>([]);
  const [loadingTips, setLoadingTips] = useState(false);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [tempBalance, setTempBalance] = useState(settings.initialBalance.toString());
  const [filteredBillTransactions, setFilteredBillTransactions] = useState<Transaction[] | null>(null);
  const [greeting, setGreeting] = useState('Good Morning');
  
  // Ad State
  const [showRewarded, setShowRewarded] = useState(false);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = settings.initialBalance + totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (( (totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : '0';

  useEffect(() => {
    // Dynamic Greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    fetchTips();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions.length]);

  const fetchTips = async () => {
    setLoadingTips(true);
    const advice = await getFinancialAdvice(transactions);
    setTips(advice);
    setLoadingTips(false);
  };

  const handleRefreshClick = () => {
    // Trigger Rewarded Ad before refreshing
    setShowRewarded(true);
  };

  const handleRewardedClose = (earnedReward: boolean) => {
    setShowRewarded(false);
    if (earnedReward) {
        fetchTips();
    }
  };

  const handleTipClick = (tip: AiTip) => {
    if (tip.title.toLowerCase().includes('recurring') || tip.title.toLowerCase().includes('subscription') || tip.title.toLowerCase().includes('bill')) {
       const bills = transactions.filter(t => t.category === 'Bills' || t.category === 'Entertainment');
       setFilteredBillTransactions(bills);
    }
  };

  const saveInitialBalance = () => {
      onUpdateInitialBalance(parseFloat(tempBalance) || 0);
      setIsBalanceModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Rewarded Ad Component */}
      <RewardedAd 
        isOpen={showRewarded} 
        onClose={handleRewardedClose} 
        unitId={ADMOB_IDS.REWARDED} 
      />

      {/* Welcome & Balance Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
           <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">{greeting}, User</p>
           <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Financial Overview</h1>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
           <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Updated just now</span>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance Card */}
        <div className="relative group col-span-1 md:col-span-1">
            <div className={`h-full relative overflow-hidden rounded-[2rem] p-8 text-white bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl shadow-blue-500/20`}>
                <div className="absolute top-0 right-0 p-6 opacity-10">
                   <Wallet size={120} />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                                <Wallet className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-medium text-white/80">Total Balance</span>
                        </div>
                        <h3 className="text-4xl font-bold tracking-tight mb-1">
                            {settings.currency}{balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                        </h3>
                        <p className="text-blue-100 text-sm opacity-80">Available funds</p>
                    </div>
                    
                    <button 
                        onClick={() => { setTempBalance(settings.initialBalance.toString()); setIsBalanceModalOpen(true); }}
                        className="mt-6 flex items-center gap-2 text-sm font-semibold bg-white/10 hover:bg-white/20 w-fit px-4 py-2 rounded-xl transition-all backdrop-blur-sm"
                    >
                        Adjust Opening Balance <Edit2 size={12} />
                    </button>
                </div>
            </div>
        </div>

        {/* Income & Expense Stack */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between group hover:border-emerald-200 dark:hover:border-emerald-900 transition-colors">
                 <div className="flex justify-between items-start mb-4">
                     <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-600">
                        <ArrowUpCircle size={24} />
                     </div>
                     <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase">Income</span>
                 </div>
                 <div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Earned</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {settings.currency}{totalIncome.toLocaleString()}
                    </h3>
                 </div>
             </div>

             <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between group hover:border-rose-200 dark:hover:border-rose-900 transition-colors">
                 <div className="flex justify-between items-start mb-4">
                     <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-2xl text-rose-600">
                        <ArrowDownCircle size={24} />
                     </div>
                     <span className="bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 px-3 py-1 rounded-full text-xs font-bold uppercase">Spent</span>
                 </div>
                 <div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Spent</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {settings.currency}{totalExpense.toLocaleString()}
                    </h3>
                 </div>
             </div>
        </div>
      </div>

      {/* Savings Progress - "Widget" Style */}
      <div className="bg-slate-900 dark:bg-black text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Monthly Savings Goal</h3>
                <p className="text-slate-400 mb-6 max-w-md">You're currently saving <span className="text-white font-bold">{savingsRate}%</span> of your income. Aim for at least 20% to build a healthy financial cushion.</p>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ${Number(savingsRate) > 20 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-blue-400 to-indigo-500'}`}
                        style={{ width: `${Math.max(0, Math.min(Number(savingsRate), 100))}%` }}
                    ></div>
                </div>
            </div>
            <div className="flex-shrink-0 text-center bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl min-w-[140px]">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Saved</p>
                <p className="text-2xl font-bold text-white">
                     {settings.currency}{(totalIncome - totalExpense).toLocaleString()}
                </p>
            </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Smart Insights</h2>
          </div>
          <button 
            onClick={handleRefreshClick} 
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg"
          >
            <Video size={14} /> Refresh (Ad)
          </button>
        </div>
        
        {loadingTips ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700">
             <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" /> 
             <p className="text-slate-400 font-medium">Analyzing transaction patterns...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tips.map((tip, idx) => (
              <button 
                key={idx} 
                onClick={() => handleTipClick(tip)}
                className="text-left bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 dark:border-slate-700 group h-full flex flex-col relative overflow-hidden"
              >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-xl shadow-inner transition-transform group-hover:scale-110 ${
                    tip.icon === 'alert' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20' : 
                    tip.icon === 'check' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 
                    'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20'
                  }`}>
                    {tip.icon === 'alert' ? '⚠️' : tip.icon === 'check' ? '🎉' : '💡'}
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2 leading-tight">{tip.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">{tip.description}</p>
                  
                  {(tip.title.includes("Review") || tip.title.includes("Recurring")) && (
                        <div className="mt-5 pt-4 border-t border-slate-50 dark:border-slate-700 w-full flex items-center text-xs font-bold text-blue-600 uppercase tracking-wide group-hover:gap-2 transition-all">
                            Review Now <ChevronRight size={14} />
                        </div>
                  )}
              </button>
            ))}
          </div>
        )}
      </div>

        {/* Modal for Initial Balance */}
        {isBalanceModalOpen && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 border border-white/20">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold dark:text-white">Opening Balance</h3>
                        <button onClick={() => setIsBalanceModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 transition-colors"><X size={20}/></button>
                    </div>
                    <p className="text-sm text-slate-500 mb-2">Adjust the starting amount in your main account.</p>
                    <div className="relative mb-8">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">{settings.currency}</span>
                        <input
                            type="number"
                            value={tempBalance}
                            onChange={(e) => setTempBalance(e.target.value)}
                            className="w-full pl-10 pr-4 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 focus:outline-none focus:border-blue-500 text-2xl font-bold dark:text-white transition-colors"
                            autoFocus
                        />
                    </div>
                    <button onClick={saveInitialBalance} className="w-full py-4 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white rounded-2xl font-bold transition-all active:scale-95">
                        Update Balance
                    </button>
                </div>
            </div>
        )}

        {/* Modal for Recurring Bills Review */}
        {filteredBillTransactions && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-8 shadow-2xl max-h-[80vh] flex flex-col animate-in slide-in-from-bottom-10 border border-white/20">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-2xl font-bold dark:text-white">Recurring Bills</h3>
                            <p className="text-sm text-slate-500">Review your subscriptions</p>
                        </div>
                        <button onClick={() => setFilteredBillTransactions(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600"><X size={20}/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {filteredBillTransactions.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-slate-400 font-medium">No bills or subscriptions found.</p>
                            </div>
                        ) : (
                            filteredBillTransactions.map(t => (
                                <div key={t.id} className="flex justify-between items-center p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                            🧾
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-white text-lg">{t.description}</p>
                                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{new Date(t.date).toLocaleDateString()} • {t.category}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-rose-500 text-lg">-{settings.currency}{t.amount}</span>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="mt-6 pt-2">
                        <button onClick={() => setFilteredBillTransactions(null)} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95">
                            Done Reviewing
                        </button>
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};