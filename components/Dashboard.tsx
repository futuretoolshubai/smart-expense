import React, { useEffect, useState } from 'react';
import { Transaction, AppSettings, AiTip } from '../types';
import { ArrowUpCircle, ArrowDownCircle, Wallet, Sparkles, Loader2, Edit2, X } from 'lucide-react';
import { getFinancialAdvice } from '../services/geminiService';

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

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = settings.initialBalance + totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (( (totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : '0';

  useEffect(() => {
    const fetchTips = async () => {
      setLoadingTips(true);
      const advice = await getFinancialAdvice(transactions);
      setTips(advice);
      setLoadingTips(false);
    };
    fetchTips();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions.length]);

  const handleTipClick = (tip: AiTip) => {
    if (tip.title.toLowerCase().includes('recurring') || tip.title.toLowerCase().includes('subscription') || tip.title.toLowerCase().includes('bill')) {
       // "Review Recurring Bills" action
       const bills = transactions.filter(t => t.category === 'Bills' || t.category === 'Entertainment');
       setFilteredBillTransactions(bills);
    }
  };

  const saveInitialBalance = () => {
      onUpdateInitialBalance(parseFloat(tempBalance) || 0);
      setIsBalanceModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none text-white">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet size={120} />
        </div>
        <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Hello there! 👋</h1>
            <p className="text-slate-300 max-w-lg">
            "Do not save what is left after spending, but spend what is left after saving."
            </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative group">
            <SummaryCard
                title="Total Balance"
                amount={balance}
                icon={<Wallet className="w-6 h-6 text-white" />}
                gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
                currency={settings.currency}
            />
            <button 
                onClick={() => { setTempBalance(settings.initialBalance.toString()); setIsBalanceModalOpen(true); }}
                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-black/20 hover:bg-black/30 backdrop-blur-md rounded-full transition-all"
                title="Edit Initial Balance"
            >
                <Edit2 size={14} />
            </button>
        </div>
        <SummaryCard
          title="Total Income"
          amount={totalIncome}
          icon={<ArrowUpCircle className="w-6 h-6 text-white" />}
          gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
          currency={settings.currency}
        />
        <SummaryCard
          title="Total Expenses"
          amount={totalExpense}
          icon={<ArrowDownCircle className="w-6 h-6 text-white" />}
          gradient="bg-gradient-to-br from-rose-500 to-pink-600"
          currency={settings.currency}
        />
      </div>

      {/* Savings Progress */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg shadow-slate-100 dark:shadow-none border border-slate-100 dark:border-slate-700">
        <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Savings Goal</h3>
              <p className="text-sm text-slate-500">Keep your savings rate above 20%</p>
            </div>
            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                {Number(savingsRate) < 0 ? 0 : savingsRate}%
            </div>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
        <div 
            className={`h-4 rounded-full transition-all duration-1000 bg-gradient-to-r ${Number(savingsRate) > 20 ? 'from-emerald-400 to-teal-500' : 'from-blue-400 to-indigo-500'}`}
            style={{ width: `${Math.max(0, Math.min(Number(savingsRate), 100))}%` }}
        ></div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Smart Insights</h2>
        </div>
        
        {loadingTips ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-400">
             <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" /> 
             <p>Analyzing your finances...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tips.map((tip, idx) => (
              <button 
                key={idx} 
                onClick={() => handleTipClick(tip)}
                className="text-left bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-100 dark:border-slate-700 group h-full flex flex-col"
              >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 text-xl shadow-inner ${
                    tip.icon === 'alert' ? 'bg-amber-100 text-amber-600' : 
                    tip.icon === 'check' ? 'bg-emerald-100 text-emerald-600' : 
                    'bg-indigo-100 text-indigo-600'
                  }`}>
                    {tip.icon === 'alert' ? '⚠️' : tip.icon === 'check' ? '🎉' : '💡'}
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-blue-600 transition-colors">{tip.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">{tip.description}</p>
                  {(tip.title.includes("Review") || tip.title.includes("Recurring")) && (
                        <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-700 w-full flex items-center text-xs font-bold text-blue-500">
                            Review Bills <span className="ml-auto">→</span>
                        </div>
                  )}
              </button>
            ))}
          </div>
        )}
      </div>

        {/* Modal for Initial Balance */}
        {isBalanceModalOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Set Initial Balance</h3>
                        <button onClick={() => setIsBalanceModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600"><X size={20}/></button>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">Enter the starting amount currently in your bank.</p>
                    <div className="relative mb-8">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">{settings.currency}</span>
                        <input
                            type="number"
                            value={tempBalance}
                            onChange={(e) => setTempBalance(e.target.value)}
                            className="w-full pl-10 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 text-xl font-bold"
                            autoFocus
                        />
                    </div>
                    <button onClick={saveInitialBalance} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95">
                        Update Balance
                    </button>
                </div>
            </div>
        )}

        {/* Modal for Recurring Bills Review */}
        {filteredBillTransactions && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl max-h-[80vh] flex flex-col animate-in slide-in-from-bottom-10">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-xl font-bold">Recurring Bills</h3>
                            <p className="text-xs text-slate-400">Review subscriptions & bills</p>
                        </div>
                        <button onClick={() => setFilteredBillTransactions(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600"><X size={20}/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {filteredBillTransactions.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                <p className="text-slate-400">No bills or subscriptions found.</p>
                            </div>
                        ) : (
                            filteredBillTransactions.map(t => (
                                <div key={t.id} className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-500">
                                            🧾
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-white">{t.description}</p>
                                            <p className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString()} • {t.category}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-rose-600">-{settings.currency}{t.amount}</span>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="mt-6 pt-2">
                        <button onClick={() => setFilteredBillTransactions(null)} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:shadow-lg transition-all">
                            Done Reviewing
                        </button>
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};

const SummaryCard: React.FC<{ title: string; amount: number; icon: React.ReactNode; gradient: string; currency: string }> = ({
  title,
  amount,
  icon,
  gradient,
  currency,
}) => (
  <div className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-lg ${gradient}`}>
    <div className="absolute top-0 right-0 p-3 opacity-20 transform translate-x-2 -translate-y-2">
       {/* Decorative large icon background */}
       <div className="scale-150">{icon}</div>
    </div>
    
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
            {icon}
        </div>
        <p className="font-medium text-white/80 text-sm">{title}</p>
      </div>
      <h3 className="text-3xl font-bold tracking-tight">
        {currency} {amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
      </h3>
    </div>
  </div>
);