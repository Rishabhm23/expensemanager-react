import CustomPieChart from "./CustomPieChart";


const FinanceOverview = ({totalBalance, totalIncome, totalExpense}) => {
    const COLORS = ["#591688", "#d0090e", "#016630"];
    const balanceData1= [
        {
            name: "Total Balace", amount: totalBalance,
            name: "Total Income", amount: totalIncome,
            name: "Total Expenses", amount: totalExpense
        }
    ];

    const balanceData = [
    { name: "Total Balance", amount: Math.abs(totalBalance), actualAmount: totalBalance },
    { name: "Total Income", amount: totalIncome, actualAmount: totalIncome },
    { name: "Total Expenses", amount: totalExpense, actualAmount: totalExpense }
  ];

    return(
        <div className="card gap-6 bg-white p-6 rounded-2xl shadow-md shadow gray-100 border border-gray-200/50">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Financial Overview</h5>
            </div>
            <CustomPieChart 
                data={balanceData}
                label="Total Balance"
                totalAmount={totalBalance}
                colors={COLORS}
                showTextAnchor
            />
        </div>
    )
}

export default FinanceOverview;