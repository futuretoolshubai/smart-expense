import React, { useState } from 'react';
import { Transaction, Category, AppSettings, TransactionType } from '../types';
import { CATEGORIES, GRADIENTS } from '../constants';
import { Trash2, Plus, Filter, Search, X, Check, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

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

  return (
    <div className="space-y-6 h-full flex flex-col pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            Transactions
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all active:scale-95 bg-gradient-to-r ${GRADIENTS[settings.themeColor]}`}
        >
          <Plus size={20} /> Add New
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
          {(['all', 'expense', 'income'] as const).map((ft) => (
            <button
              key={ft}
              onClick={() => setFilterType(ft)}
              className={`flex-1 px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                filterType === ft
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              {ft}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-2xl">
                📝
            </div>
            <p className="font-medium">No transactions found.</p>
          </div>
        ) : (
          filteredTransactions.map((t) => (
            <div
              key={t.id}
              className="group flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 hover:shadow-lg hover:border-blue-100 dark:hover:border-slate-600 transition-all duration-300"
            >
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${
                  t.type === 'income' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
                }`}>
                  {t.type === 'income' ? <ArrowDownLeft /> : <ArrowUpRight />}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1">{t.description}</h3>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg">{t.category}</span>
                    <span>• {new Date(t.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className={`text-lg font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {t.type === 'income' ? '+' : '-'}{settings.currency}{t.amount.toLocaleString()}
                </span>
                <button
                  onClick={() => onDelete(t.id)}
                  className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">New Transaction</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-700">
                    <X size={24} />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Toggle */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                    type === 'expense' 
                      ? 'bg-rose-50 border-rose-500 text-rose-600 dark:bg-rose-900/20' 
                      : 'border-slate-100 bg-slate-50 text-slate-400 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800'
                  }`}
                >
                  <ArrowUpRight size={28} />
                  <span className="font-bold">Expense</span>
                  {type === 'expense' && <div className="absolute top-2 right-2 text-rose-500"><Check size={16} strokeWidth={3}/></div>}
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                    type === 'income' 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-900/20' 
                      : 'border-slate-100 bg-slate-50 text-slate-400 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800'
                  }`}
                >
                  <ArrowDownLeft size={28} />
                  <span className="font-bold">Income</span>
                  {type === 'income' && <div className="absolute top-2 right-2 text-emerald-500"><Check size={16} strokeWidth={3}/></div>}
                </button>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Amount</label>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl group-focus-within:text-blue-500 transition-colors">{settings.currency}</span>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xl font-bold text-slate-800 dark:text-white"
                    placeholder="0.00"
                    autoFocus
                  />
                </div>
              </div>

              {/* Description & Category */}
              <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Details</label>
                    <input
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    placeholder="What is this for?"
                    />
                  </div>
                  
                  <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none"
                  >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all active:scale-95 bg-gradient-to-r ${GRADIENTS[settings.themeColor]}`}
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