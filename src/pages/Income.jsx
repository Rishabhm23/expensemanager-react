import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import axios from "axios";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import IncomeList from "../components/IncomeList";
import Modal from "../components/Modal";
import AddIncomeForm from "../components/AddIncomeForm";
import DeleteAlert from "../components/DeleteAlert";
import IncomeOverview from "../components/IncomeOverview";
import { TrendingUp, Plus, DollarSign, Calendar, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const Income = () => {
    useUser();

    const [incomeData, setIncomeData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openAddIncomeModal, setOepnAddIncomeModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    const fetchIncomeDetails = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);
            if (response.status === 200) {
                setIncomeData(response.data);
            }
        } catch (error) {
            toast.error("Failed to fetch income details");
        } finally {
            setLoading(false);
        }
    };

    const fetchIncomeCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("income"));
            if (response.status === 200) {
                console.log("Income categories", response.data);
                setCategories(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch income categories", error);
            toast.error("Failed to fetch income categories");
        }
    };

    const handleAddIncome = async (income) => {
        console.log("Income to be added: ", income);

        const { name, amount, date, icon, categoryId } = income;
        if (!name.trim()) {
            toast.error("Provide a name");
            return;
        }

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Amount should be valid number greater than 0");
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        if (date > today) {
            toast.error("Date cannot be a future date");
            return;
        }

        if (!categoryId) {
            toast.error("Please select a category");
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOMES, {
                name,
                amount: Number(amount),
                date,
                icon,
                categoryId
            });

            if (response.status === 201) {
                console.log("Income added successfully", response.data);
                setOepnAddIncomeModal(false);
                fetchIncomeDetails();
                fetchIncomeCategories();
                toast.success("Income added successfully");
            }
        } catch (error) {
            console.log("Error adding income", error);
            toast.error("Error adding income");
        }
    };

    const deleteIncome = async (id) => {
        try {
            axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));
            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Deleted successfully");
            fetchIncomeDetails();
        } catch (error) {
            console.log("Error deleting income", error);
            toast.error("Error deleting income");
        }
    };

    const handleDownloadIncomeDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.INCOME_EXCEL_DOWNLOAD, { responseType: "blob" });
            let filename = "income_details.xlsx";
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Downloaded income details");
        } catch (error) {
            console.log("Error in download income", error);
            toast.error(error.response?.data?.message || "Error in downloading income");
        }
    };

    const handleEmailIncomeDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_INCOME, { responseType: "blob" });
            if (response.status === 200) {
                toast.success("Income details emailed");
            }
        } catch (error) {
            console.log("Error in email income", error);
            toast.error(error.response?.data?.message || "Error in email income");
        }
    };

    const handleRefresh = () => {
        fetchIncomeDetails();
        fetchIncomeCategories();
    };

    useEffect(() => {
        fetchIncomeDetails();
        fetchIncomeCategories();
    }, []);

    // Calculate statistics
    const totalIncome = incomeData.reduce((sum, income) => sum + (income.amount || 0), 0);
    const incomeCount = incomeData.length;
    const thisMonthIncome = incomeData.filter(income => {
        const incomeDate = new Date(income.date);
        const now = new Date();
        return incomeDate.getMonth() === now.getMonth() && incomeDate.getFullYear() === now.getFullYear();
    }).reduce((sum, income) => sum + (income.amount || 0), 0);

    return (
        <Dashboard activeMenu="Income">
            <div className="space-y-6">
                {/* Loading Bar */}
                {loading && (
                    <div className="fixed top-0 left-0 right-0 z-50">
                        <div className="h-1 bg-green-600 animate-pulse"></div>
                    </div>
                )}

                {/* Header Section */}
                <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 text-white shadow-lg">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <TrendingUp className="w-6 h-6 bg-green-700 rounded" />
                                </div>
                                Income Management
                            </h1>
                            <p className="text-green-100">
                                Track and manage all your income sources
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleRefresh}
                                disabled={loading}
                                className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-green-600 px-4 py-2.5 rounded-xl font-medium backdrop-blur-sm transition-all duration-200"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                <span className="hidden sm:inline">Refresh</span>
                            </button>
                            <button
                                onClick={() => setOepnAddIncomeModal(true)}
                                className="flex items-center gap-2 bg-white text-green-600 hover:bg-green-50 px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <Plus size={20} />
                                <span>Add Income</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-700 bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-green-700 text-sm">Total Income</p>
                                    <p className="text-xl text-green-700 font-bold">₹{totalIncome.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-700 bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-green-700 text-sm">This Month</p>
                                    <p className="text-xl text-green-700 font-bold">₹{thisMonthIncome.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-700 bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-green-700 text-sm">Total Entries</p>
                                    <p className="text-xl text-green-700 font-bold">{incomeCount}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Income Overview Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <IncomeOverview 
                        transactions={incomeData} 
                        onAddIncome={() => setOepnAddIncomeModal(true)}
                    />
                </div>

                {/* Income List Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <IncomeList
                        transactions={incomeData}
                        onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
                        onDownload={handleDownloadIncomeDetails}
                        onEmail={handleEmailIncomeDetails}
                    />
                </div>

                {/* Add Income Modal */}
                <Modal
                    isOpen={openAddIncomeModal}
                    onClose={() => setOepnAddIncomeModal(false)}
                    title="Add New Income"
                >
                    <AddIncomeForm
                        onAddIncome={(income) => handleAddIncome(income)}
                        categories={categories}
                    />
                </Modal>

                {/* Delete Alert Modal */}
                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    title="Delete Income"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this income entry? This action cannot be undone."
                        onDelete={() => deleteIncome(openDeleteAlert.data)}
                    />
                </Modal>
            </div>
        </Dashboard>
    );
};

export default Income;