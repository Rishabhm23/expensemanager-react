import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import axios from "axios";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import ExpenseList from "../components/ExpenseList";
import Modal from "../components/Modal";
import AddExpenseForm from "../components/AddExpenseForm";
import DeleteAlert from "../components/DeleteAlert";
import ExpenseOverview from "../components/ExpenseOverview";
import { TrendingDown, Plus, CreditCard, Calendar, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const Expense = () => {
    useUser();

    const [expenseData, setExpenseData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openAddExpenseModal, setOepnAddExpenseModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    const fetchExpenseDetails = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES);
            if (response.status === 200) {
                setExpenseData(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch expense details", error);
            toast.error(error.response?.data?.message || "Failed to fetch expense details");
        } finally {
            setLoading(false);
        }
    };

    const fetchExpenseCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("expense"));
            if (response.status === 200) {
                console.log("Expense categories", response.data);
                setCategories(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch expense categories", error);
            toast.error(error.response?.data?.message || "Failed to fetch expense categories");
        }
    };

    const handleAddExpense = async (expense) => {
        const { name, amount, date, icon, categoryId } = expense;
        if (!name.trim()) {
            toast.error("Name not present");
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
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSES, {
                name,
                amount: Number(amount),
                date,
                icon,
                categoryId
            });

            if (response.status === 201) {
                toast.success("Expense added successfully");
                setOepnAddExpenseModal(false);
                fetchExpenseDetails();
                fetchExpenseCategories();
            }
        } catch (error) {
            console.log("Error adding expense", error);
            toast.error(error.response?.data?.message || "Error adding expense");
        }
    };

    const deleteExpense = async (id) => {
        try {
            axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));
            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Deleted successfully");
            fetchExpenseDetails();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting expense");
        }
    };

    const handleDownloadExpenseDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.EXPENSE_EXCEL_DOWNLOAD, { responseType: "blob" });
            let filename = "expense_details.xlsx";
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Downloaded expense details successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error in download expense");
        }
    };

    const handleEmailExpenseDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_EXPENSE, { responseType: "blob" });
            if (response.status === 200) {
                toast.success("Expense details emailed successfully");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error in sending mail");
            console.error("Error in email expense", error);
        }
    };

    const handleRefresh = () => {
        fetchExpenseDetails();
        fetchExpenseCategories();
    };

    useEffect(() => {
        fetchExpenseDetails();
        fetchExpenseCategories();
    }, []);

    // Calculate statistics
    const totalExpense = expenseData.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    const expenseCount = expenseData.length;
    const thisMonthExpense = expenseData.filter(expense => {
        const expenseDate = new Date(expense.date);
        const now = new Date();
        return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
    }).reduce((sum, expense) => sum + (expense.amount || 0), 0);

    return (
        <Dashboard activeMenu="Expense">
            <div className="space-y-6">
                {/* Loading Bar */}
                {loading && (
                    <div className="fixed top-0 left-0 right-0 z-50">
                        <div className="h-1 bg-red-600 animate-pulse"></div>
                    </div>
                )}

                {/* Header Section */}
                <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 text-white shadow-lg">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <TrendingDown className="w-6 h-6 bg-red-700 rounded" />
                                </div>
                                Expense Management
                            </h1>
                            <p className="text-red-100">
                                Monitor and control your spending habits
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleRefresh}
                                disabled={loading}
                                className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-red-600 px-4 py-2.5 rounded-xl font-medium backdrop-blur-sm transition-all duration-200"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                <span className="hidden sm:inline">Refresh</span>
                            </button>
                            <button
                                onClick={() => setOepnAddExpenseModal(true)}
                                className="flex items-center gap-2 bg-white text-red-600 hover:bg-red-50 px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <Plus size={20} />
                                <span>Add Expense</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-700 bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-red-800 text-sm">Total Expenses</p>
                                    <p className="text-xl text-red-800 font-bold">₹{totalExpense.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-700 bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-red-800 text-sm">This Month</p>
                                    <p className="text-xl text-red-800 font-bold">₹{thisMonthExpense.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-700 bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <TrendingDown className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-red-800 text-sm">Total Entries</p>
                                    <p className="text-xl text-red-800 font-bold">{expenseCount}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expense Overview Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <ExpenseOverview
                        transactions={expenseData}
                        onAddExpense={() => setOepnAddExpenseModal(true)}
                    />
                </div>

                {/* Expense List Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <ExpenseList
                        transactions={expenseData}
                        onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
                        onDownload={handleDownloadExpenseDetails}
                        onEmail={handleEmailExpenseDetails}
                    />
                </div>

                {/* Add Expense Modal */}
                <Modal
                    isOpen={openAddExpenseModal}
                    onClose={() => setOepnAddExpenseModal(false)}
                    title="Add New Expense"
                >
                    <AddExpenseForm
                        onAddExpense={(expense) => handleAddExpense(expense)}
                        categories={categories}
                    />
                </Modal>

                {/* Delete Alert Modal */}
                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    title="Delete Expense"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this expense entry? This action cannot be undone."
                        onDelete={() => deleteExpense(openDeleteAlert.data)}
                    />
                </Modal>
            </div>
        </Dashboard>
    );
};

export default Expense;