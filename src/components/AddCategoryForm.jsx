import { useEffect, useState } from "react";
import { Label } from "recharts";
import Input from "./input";
import EmojiPickerPopup from "./EmojiPickerPopup";
import { LoaderCircle } from "lucide-react";

const AddCategoryForm = ({onAddCategory, initialCategoryData, isEditing}) => {
    const [category, setCategory] = useState({
        name: "",
        type: "income",
        icon: ""
    })

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(isEditing && initialCategoryData) {
            setCategory(initialCategoryData);
        }else{
            setCategory({name: "",type: "income", icon: ""})
        }
    }, [isEditing, initialCategoryData])

    const categoryTypeOptions = [
        {value:"income", label:"Income"},
        {value:"expense", label:"Expense"}
    ]
    
    const handleChange= (key, value) => {
        setCategory({...category, [key]:value})
    }


    const handleSubmit = async () => {
        setLoading(true);
        try{
            await onAddCategory(category);
        }
        finally{
            setLoading(false);

        }
    }
    return(
        <div className="p-4">

            <EmojiPickerPopup 
                icon={category.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={category.name}
                onChange={({target}) => handleChange("name", target.value)}
                label="Category Name"
                placeholder="e.g., Freelance, Salary, Groceries"
                type="text"
            />

            <Input
                label="Category Type"
                value={category.type}
                onChange={({target}) => handleChange("type", target.value)}
                isSelect={true}
                options={categoryTypeOptions}
            />

            <div className="flex justify-end">
                <button 
                
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
                    {loading ? (
                        <>
                            <LoaderCircle className="w-4 h-4 animate-spin"/>
                            {isEditing ? "Updating..." : "Adding..."}
                        </>
                    ) : (
                        <>
                            {isEditing ? "Update Category" : "Add Category"}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default AddCategoryForm;