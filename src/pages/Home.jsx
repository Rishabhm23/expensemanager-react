import { Coins, Wallet, WalletCards, TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import Dashboard from "../components/Dashboard";
import InfoCard from "../components/InfoCard";
import { useUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import RecentTransactions from "../components/RecentTransactions";
import Transactions from "../components/Transactions";
import FinanceOverview from "../components/FinanceOverview";
import toast from "react-hot-toast";

const Home = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDashboardData = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.DASHBOARD_DATA);
            if (response.status === 200) {
                setDashboardData(response.data);
            }
        } catch (error) {
            console.log("Some error occured in dashboard");
            //toast.error(error.response?.data?.message || "Some error occured in dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        return () => {};
    }, []);

    // Get current time greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div>
            <Dashboard activeMenu="Dashboard">
                {/* Header Section with Greeting */}
                <div className="mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-1">
                                {getGreeting()}{user?.fullname ? `, ${user.fullname.split(' ')[0]}` : ''}! 👋
                            </h1>
                            <p className="text-gray-500">
                                Here's what's happening with your finances today
                            </p>
                        </div>
                        <button
                            onClick={fetchDashboardData}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards with Enhanced Design */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Wallet className="w-6 h-6 text-purple-500" />
                            </div>
                            <div className="bg-white text-gray-500 bg-opacity-20 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm">
                                Current
                            </div>
                        </div>
                        <p className="text-purple-100 text-sm mb-1">Total Balance</p>
                        <h3 className="text-3xl font-bold mb-2">
                            ₹{(dashboardData?.totalBalance || 0).toLocaleString('en-IN')}
                        </h3>
                        <div className="flex items-center gap-1 text-purple-100 text-sm">
                            <TrendingUp className="w-4 h-4 text-purple-500" />
                            <span>Updated just now</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Coins className="w-6 h-6 text-green-500" />
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-full p-2 backdrop-blur-sm">
                                <ArrowUpRight className="w-4 h-4 text-green-500" />
                            </div>
                        </div>
                        <p className="text-green-100 text-sm mb-1">Total Income</p>
                        <h3 className="text-3xl font-bold mb-2">
                            ₹{(dashboardData?.totalIncome || 0).toLocaleString('en-IN')}
                        </h3>
                        <div className="flex items-center gap-1 text-green-100 text-sm">
                            <span>All time earnings</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <WalletCards className="w-6 h-6 text-red-500" />
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-full p-2 backdrop-blur-sm">
                                <ArrowDownRight className="w-4 h-4 text-red-500" />
                            </div>
                        </div>
                        <p className="text-red-100 text-sm mb-1">Total Expenses</p>
                        <h3 className="text-3xl font-bold mb-2">
                            ₹{(dashboardData?.totalExpense || 0).toLocaleString('en-IN')}
                        </h3>
                        <div className="flex items-center gap-1 text-red-100 text-sm">
                            <span>All time spending</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid with Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Transactions Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                        <RecentTransactions
                            transactions={dashboardData?.recentTransactions}
                            onMore={() => navigate("/expense")}
                        />
                    </div>

                    {/* Finance Overview Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                        <FinanceOverview
                            totalBalance={dashboardData?.totalBalance || 0}
                            totalIncome={dashboardData?.totalIncome || 0}
                            totalExpense={dashboardData?.totalExpense || 0}
                        />
                    </div>

                    {/* Recent Expenses Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                        <Transactions
                            transactions={dashboardData?.recent5Expenses || []}
                            onMore={() => navigate("/expense")}
                            type="expense"
                            title="Recent Expenses"
                        />
                    </div>

                    {/* Recent Incomes Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                        <Transactions
                            transactions={dashboardData?.recent5Incomes || []}
                            onMore={() => navigate("/income")}
                            type="income"
                            title="Recent Incomes"
                        />
                    </div>
                </div>

                {/* Loading Indicator - Subtle top bar */}
                {loading && (
                    <div className="fixed top-0 left-0 right-0 z-50">
                        <div className="h-1 bg-purple-600 animate-pulse"></div>
                    </div>
                )}
            </Dashboard>
        </div>
    );
};

export default Home;