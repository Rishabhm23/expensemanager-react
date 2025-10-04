import { useEffect, useState } from "react";
import EmojiPickerPopup from "./EmojiPickerPopup";
import Input from "./input";
import { LoaderCircle } from "lucide-react";

const AddExpenseForm = ({onAddExpense, categories}) => {
    const [expense, setExpense] = useState({
        name: '',
        amount: '',
        date: '',
        icon: "",
        categoryId: ''
    })

    const [loading, setLoading] = useState(false);

    const categoryOptions = categories.map(category => ({
        value:category.id,
        label:category.name
    }))


    const handleChange = (key, value) => {
        setExpense({...expense, [key]:value});
    }

    const handleAddExpense = async () => {
        setLoading(true);
        try{
            await onAddExpense(expense);
        }finally{
            setLoading(false);
        }
    }


    useEffect(() => {
        if(categories.length > 0 && !expense.categoryId){
            setExpense((prev) => ({...prev, categoryId: categories[0].id}))
        }
    }, [categories, expense.categoryId]);

    return(
        <div>
            <EmojiPickerPopup 
                icon={expense.icon}
                onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
            />
            <Input 
                value={expense.name}
                onChange={({target}) => handleChange('name', target.value)}
                label="expense Source"
                placeholder="e.g., Salary, Freelance, Bonus"
                type="text"
            />

            <Input 
                label="Category"
                value={expense.categoryId}
                onChange={({target}) => handleChange('categoryId', target.value)}
                isSelect={true}
                options={categoryOptions}
            />

            <Input 
                label="Amount"
                value={expense.amount}
                onChange={({target}) => handleChange('amount', target.value)}
                placeholder="e.g., 500.00"
                type="number"
            />

            <Input 
                label="Date"
                value={expense.date}
                onChange={({target}) => handleChange('date', target.value)}
                placeholder=""
                type="date"
            />

            <div className="flex justify-end mt-4">
                <button 
                    onClick={handleAddExpense}
                    className="flex items-center gap-1 bg-purple-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                    {loading ? (
                        <>
                            <LoaderCircle className="w-4 h-4 animate-spin"/>
                            Adding...
                        </>
                    ) : (
                        <>
                            Add Expense
                        </>
                    )}
                </button>
            </div>
            

        </div>
    )
}

export default AddExpenseForm;