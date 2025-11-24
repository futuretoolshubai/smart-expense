import React from 'react';
import { Transaction, AppSettings } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, TooltipProps } from 'recharts';

interface AnalyticsProps {
  transactions: Transaction[];
  settings: AppSettings;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#64748b'];

export const Analytics: React.FC<AnalyticsProps> = ({ transactions, settings }) => {
  // Process Data for Pie Chart (Expenses by Category)
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.keys(expensesByCategory).map(key => ({
    name: key,
    value: expensesByCategory[key],
  }));

  // Process Data for Bar Chart (Monthly Trends - Simplified to last 6 entries for demo)
  // In a real app, you'd aggregate by month
  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Group by date (simple implementation)
  const trendsData = sortedTransactions.slice(-7).map(t => ({
    date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    amount: t.type === 'expense' ? t.amount : 0, // only show expenses for trend
  }));

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700">
          <p className="font-semibold text-sm">{label}</p>
          <p className="text-sm text-blue-500">
            {settings.currency}{payload[0].value?.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <h2 className="text-2xl font-bold">Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-6">Expense Breakdown</h3>
          <div className="h-64 w-full">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No expense data yet
              </div>
            )}
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-slate-600 dark:text-slate-300 truncate">{entry.name}</span>
                <span className="ml-auto font-medium text-slate-900 dark:text-white">{settings.currency}{entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Trend */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-6">Recent Expenses</h3>
          <div className="h-64 w-full">
            {trendsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendsData}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#94a3b8' }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No data available
              </div>
            )}
          </div>
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
             <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
               Your spending trend helps visualize output volatility over the last few entries.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
