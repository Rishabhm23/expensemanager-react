import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Prepare income data grouped by month
export const prepareIncomeLineChartData = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return [];
  }

  // Group by date
  const dailyIncome = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const dateKey = transaction.date; // Use the date string directly (YYYY-MM-DD)
    const dateLabel = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });

    if (!dailyIncome[dateKey]) {
      dailyIncome[dateKey] = {
        date: dateLabel,
        shortDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: 0,
        count: 0
      };
    }

    dailyIncome[dateKey].amount += parseFloat(transaction.amount);
    dailyIncome[dateKey].count += 1;
  });

  // Convert to array and sort by date
  const chartData = Object.entries(dailyIncome)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([_, data]) => ({
      date: data.shortDate,
      fullDate: data.date,
      income: data.amount,
      transactions: data.count
    }));

  return chartData;
};