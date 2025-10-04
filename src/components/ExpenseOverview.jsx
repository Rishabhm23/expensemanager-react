import { useEffect, useState } from "react";

import { Plus } from "lucide-react";
import { prepareExpenseLineChartData } from '../util/prepareExpenseLineChartData';
import CustomLineChart from './CustomLineChart'


const ExpenseOverview = ({transactions, onAddExpense}) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
            const result = prepareExpenseLineChartData(transactions);
            setChartData(result);
            console.log("result",result);
            return () => {};
        }, [transactions]);

    return(
        <div className="card">
            <div className="flex items-center justify-between">
                <div>
                    <h5 className="text-lg">
                        Expense Overview
                    </h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Track your earnings over time and analyze your expense trends.
                    </p>
                </div>
                    <button className="flex items-center gap-1 bg-purple-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium" onClick={onAddExpense}>
                        <Plus size={15} className="text-lg"/>Add Expense
                    </button>
            </div>
            <div className="mt-6">
                <CustomLineChart data ={chartData} type="expense"/>
            </div>
        </div>
    )
}

export default ExpenseOverview;