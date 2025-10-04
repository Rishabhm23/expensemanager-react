import { useEffect, useState } from "react";

import { Plus } from "lucide-react";
import { prepareIncomeLineChartData } from '../util/prepareIncomeLineChartData';
import CustomLineChart from './CustomLineChart'

const IncomeOverview = ({transactions, onAddIncome}) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareIncomeLineChartData(transactions);
        setChartData(result);
        console.log("result",result);
        return () => {};
    }, [transactions]);


    return(
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h5 className="text-lg">
                        Income Overview
                    </h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Track your earnings over time and analyze your income trends.
                    </p>
                </div>
                    <button className="flex items-center gap-1 bg-purple-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium" onClick={onAddIncome}>
                        <Plus size={15} className="text-lg"/>Add Income
                    </button>
            </div>
            <div className="mt-6">
                <CustomLineChart data ={chartData} type="income"/>
            </div>
        </div>
    )
}

export default IncomeOverview;