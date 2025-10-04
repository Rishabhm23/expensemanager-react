import { Plus } from "lucide-react";
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
        if(loading) return;
        setLoading(true);

        try{
            const response  = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
            if(response.status === 200){
                setCategoryData(response.data);
            }
        }catch(error){
            console.error("Something went wrong, please try again", error.message);
            toast.error(error.response?.data?.message || "Failed to fetch category details");

        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategoryDetails();
    },[]);

    const handleAddCategory = async (category) => {

        const {name, type, icon} = category;
        if(!name.trim()){
            toast.error("Category name is required");
            console.error("Category name is required",error);
            return;
        }

        try{
           const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORIES, {name, type, icon});
           if(response.status === 201 ){
            toast.success("Category Added Successfully");
            setOepnAddCategoryModal(false);
            fetchCategoryDetails();
           }
        }catch(error){
            console.error("Error adding category", error);
            toast.error(error.response?.data?.message || "Failed to add category");
        }
    }

    const handleEditCategory = async (categoryToEdit) => {
        setSelectedCategory(categoryToEdit);
        setOepnEditCategoryModal(true);
        console.log("Editing the category",categoryToEdit);
    }

    const handleUpdateCategory = async (updatedCategory) => {
        
        const {id, name, type, icon} = updatedCategory;
        if(!name.trim()){
             toast.error("Category name is required");
            console.error("Category name is required",error);
            return;
        }

        if(!id) {
            toast.error("Category ID is missing for execution");
            console.error("Category ID is missing for execution");
            return;
        }

        try{
           const response = await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id), {name, type, icon});
           if(response.status === 201 ){
            toast.success("Category Updated Successfully");
            setOepnEditCategoryModal(false);
            setSelectedCategory(null);
            fetchCategoryDetails();
           }
        }catch(error){
            toast.error("Error updating category", error.response?.data?.message || error.message);
            console.error("Error updating category", error);
        }


    }

    return(
        <Dashboard activeMenu="Category">
                <div className="my-5 mx-auto">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-2xl font-semibold">
                            All categories
                        </h2>
                        <button 
                            onClick={() => setOepnAddCategoryModal(true)}
                            className="flex items-center gap-1 bg-purple-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                            <Plus size={15}/>
                            Add Category
                        </button>
                    </div>
                    <CategoryList categories={categoryData} onEditCategory={handleEditCategory}/>
                    <Modal
                        isOpen={openAddCategoryModal}
                        onClose={() => setOepnAddCategoryModal(false)}
                        title = "Category Form"
                        >
                        <AddCategoryForm onAddCategory = {handleAddCategory}/>
                    </Modal>

                    <Modal
                        
                        onClose={() => {
                            setOepnEditCategoryModal(false)
                            setSelectedCategory(null)

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
    )
}

export default Category;