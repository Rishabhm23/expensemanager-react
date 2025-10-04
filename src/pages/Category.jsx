import { Plus, Folder, Layers, TrendingUp, ShoppingCart } from "lucide-react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import CategoryList from "../components/CatagoryList";
import Modal from "../components/Modal.jsx";
import AddCategoryForm from "../components/AddCategoryForm.jsx";
import toast from "react-hot-toast";

const Category = () => {
    useUser();
    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [openAddCategoryModal, setOepnAddCategoryModal] = useState(false);
    const [openEditCategoryModal, setOepnEditCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchCategoryDetails = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
            if (response.status === 200) {
                setCategoryData(response.data);
            }
        } catch (error) {
            console.error("Something went wrong, please try again", error.message);
            toast.error(error.response?.data?.message || "Failed to fetch category details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryDetails();
    }, []);

    const handleAddCategory = async (category) => {
        const { name, type, icon } = category;
        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORIES, { name, type, icon });
            if (response.status === 201) {
                toast.success("Category Added Successfully");
                setOepnAddCategoryModal(false);
                fetchCategoryDetails();
            }
        } catch (error) {
            console.error("Error adding category", error);
            toast.error(error.response?.data?.message || "Failed to add category");
        }
    };

    const handleEditCategory = async (categoryToEdit) => {
        setSelectedCategory(categoryToEdit);
        setOepnEditCategoryModal(true);
        console.log("Editing the category", categoryToEdit);
    };

    const handleUpdateCategory = async (updatedCategory) => {
        const { id, name, type, icon } = updatedCategory;
        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }

        if (!id) {
            toast.error("Category ID is missing for execution");
            console.error("Category ID is missing for execution");
            return;
        }

        try {
            const response = await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id), { name, type, icon });
            if (response.status === 201) {
                toast.success("Category Updated Successfully");
                setOepnEditCategoryModal(false);
                setSelectedCategory(null);
                fetchCategoryDetails();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating category");
            console.error("Error updating category", error);
        }
    };

    // Calculate category statistics
    const expenseCategories = categoryData.filter(cat => cat.type === 'expense').length;
    const incomeCategories = categoryData.filter(cat => cat.type === 'income').length;
    const totalCategories = categoryData.length;

    return (
        <Dashboard activeMenu="Category">
            <div className="space-y-6">
                {/* Loading Bar */}
                {loading && (
                    <div className="fixed top-0 left-0 right-0 z-50">
                        <div className="h-1 bg-purple-600 animate-pulse"></div>
                    </div>
                )}

                {/* Header Section */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-lg">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <Folder className="w-6 h-6 text-red-800"  />
                                </div>
                                Manage Categories
                            </h1>
                            <p className="text-purple-100">
                                Organize your expenses and income with custom categories
                            </p>
                        </div>
                        <button
                            onClick={() => setOepnAddCategoryModal(true)}
                            className="flex items-center gap-2 bg-white text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <Plus size={20} />
                            <span>Add Category</span>
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <Layers className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-purple-700 text-sm">Total Categories</p>
                                    <p className="text-xl font-bold text-purple-500">{totalCategories}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-500 bg-opacity-30 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-purple-700 text-sm">Income Categories</p>
                                    <p className="text-xl font-bold text-purple-500">{incomeCategories}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-500 bg-opacity-30 rounded-lg flex items-center justify-center">
                                    <ShoppingCart className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-purple-700 text-sm">Expense Categories</p>
                                    <p className="text-xl font-bold text-purple-500">{expenseCategories}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category List Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-1">All Categories</h2>
                        <p className="text-gray-500 text-sm">
                            {totalCategories === 0 
                                ? "No categories yet. Create your first category to get started!" 
                                : `You have ${totalCategories} categor${totalCategories === 1 ? 'y' : 'ies'} in total`}
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                            <p>Loading categories...</p>
                        </div>
                    ) : categoryData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                                <Folder className="w-10 h-10 text-purple-300" />
                            </div>
                            <p className="text-lg font-medium text-gray-600 mb-2">No categories found</p>
                            <p className="text-sm text-gray-500 mb-6">Start by creating your first category</p>
                            <button
                                onClick={() => setOepnAddCategoryModal(true)}
                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                            >
                                <Plus size={18} />
                                Create Category
                            </button>
                        </div>
                    ) : (
                        <CategoryList categories={categoryData} onEditCategory={handleEditCategory} />
                    )}
                </div>

                {/* Add Category Modal */}
                <Modal
                    isOpen={openAddCategoryModal}
                    onClose={() => setOepnAddCategoryModal(false)}
                    title="Add New Category"
                >
                    <AddCategoryForm onAddCategory={handleAddCategory} />
                </Modal>

                {/* Edit Category Modal */}
                <Modal
                    onClose={() => {
                        setOepnEditCategoryModal(false);
                        setSelectedCategory(null);
                    }}
                    isOpen={openEditCategoryModal}
                    title="Update Category"
                >
                    <AddCategoryForm
                        initialCategoryData={selectedCategory}
                        onAddCategory={handleUpdateCategory}
                        isEditing={true}
                    />
                </Modal>
            </div>
        </Dashboard>
    );
};

export default Category;