import React, { useState } from 'react';
import { Transaction, Category, AppSettings, TransactionType } from '../types';
import { CATEGORIES } from '../constants';
import { Trash2, Plus, Search, X, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onAdd: (t: Omit<Transaction, 'id'>) => void;
  onDelete: (id: string) => void;
  settings: AppSettings;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onAdd, onDelete, settings }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Others');
  const [type, setType] = useState<TransactionType>('expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    onAdd({
      amount: parseFloat(amount),
      description,
      category,
      type,
      date: new Date().toISOString(),
    });

    // Reset and close
    setAmount('');
    setDescription('');
    setCategory('Others');
    setIsModalOpen(false);
  };

  const filteredTransactions = transactions
    .filter(t => filterType === 'all' || t.type === filterType)
    .filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group transactions by Date
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Simple check for Today/Yesterday ignoring time
    if (date.toDateString() === today.toDateString()) {
      dateKey = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = 'Yesterday';
    }

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  // Sort keys to ensure Today comes first
  const sortedDateKeys = Object.keys(groupedTransactions).sort((a, b) => {
     if (a === 'Today') return -1;
     if (b === 'Today') return 1;
     if (a === 'Yesterday') return -1;
     if (b === 'Yesterday') return 1;
     
     // For other dates, assume keys are effectively sorted because input was sorted, 
     // but to be safe we can check the date of the first item in the group
     const dateA = groupedTransactions[a][0]?.date;
     const dateB = groupedTransactions[b][0]?.date;
     if (dateA && dateB) {
         return new Date(dateB).getTime() - new Date(dateA).getTime();
     }
     return 0;
  });

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Transactions</h2>
           <p className="text-slate-500 text-sm">Manage your financial history</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all"
                />
             </div>
             <button
                onClick={() => setIsModalOpen(true)}
                className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all active:scale-95 bg-slate-900 dark:bg-blue-600 text-sm"
            >
                <Plus size={18} /> New
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
          {(['all', 'expense', 'income'] as const).map((ft) => (
            <button
              key={ft}
              onClick={() => setFilterType(ft)}
              className={`px-5 py-2 rounded-full text-sm font-bold capitalize transition-all border ${
                filterType === ft
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                  : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {ft}
            </button>
          ))}
      </div>

      {/* Grouped List */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pr-2">
        {sortedDateKeys.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-3xl">
                🍃
            </div>
            <p className="font-medium text-lg">No transactions found</p>
            <p className="text-sm">Try adding a new one or adjusting filters.</p>
          </div>
        ) : (
            sortedDateKeys.map(dateKey => (
                <div key={dateKey} className="animate-in slide-in-from-bottom-2 duration-500">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2 flex items-center gap-2">
                        <Calendar size={12} /> {dateKey}
                    </h3>
                    <div className="space-y-3">
                        {groupedTransactions[dateKey].map((t) => (
                            <div
                            key={t.id}
                            className="group flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all duration-200"
                            >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                                t.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-500' : 'bg-slate-50 dark:bg-slate-700/50 text-slate-500'
                                }`}>
                                {t.type === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                </div>
                                <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100">{t.description}</h3>
                                <p className="text-xs font-medium text-slate-500">{t.category}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`text-base font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-200'}`}>
                                {t.type === 'income' ? '+' : '-'}{settings.currency}{t.amount.toLocaleString()}
                                </span>
                                <button
                                onClick={() => onDelete(t.id)}
                                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                <Trash2 size={16} />
                                </button>
                            </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))
        )}
      </div>

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-28 right-6 w-14 h-14 bg-slate-900 dark:bg-blue-600 text-white rounded-full shadow-xl shadow-slate-900/30 flex items-center justify-center z-50 hover:scale-110 transition-transform"
      >
        <Plus size={28} />
      </button>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-white/20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">New Transaction</h3>
                    <p className="text-sm text-slate-500">Enter details below</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-700">
                    <X size={24} />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Toggle */}
              <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl flex gap-1">
                {(['expense', 'income'] as const).map(option => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => setType(option)}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                            type === option 
                             ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' 
                             : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {option === 'expense' ? <ArrowUpRight size={16}/> : <ArrowDownLeft size={16}/>}
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                ))}
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Amount</label>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl group-focus-within:text-blue-500 transition-colors">{settings.currency}</span>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 focus:outline-none focus:border-slate-900 dark:focus:border-blue-500 transition-all text-xl font-bold text-slate-800 dark:text-white"
                    placeholder="0.00"
                    autoFocus
                  />
                </div>
              </div>

              {/* Description & Category */}
              <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Description</label>
                    <input
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 focus:outline-none focus:border-slate-900 dark:focus:border-blue-500 transition-all font-medium"
                    placeholder="e.g., Grocery Shopping"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Category</label>
                    <div className="relative">
                        <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 focus:outline-none focus:border-slate-900 dark:focus:border-blue-500 transition-all font-medium appearance-none bg-transparent"
                        >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                    </div>
                  </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 transition-all active:scale-95 bg-slate-900 dark:bg-blue-600`}
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};