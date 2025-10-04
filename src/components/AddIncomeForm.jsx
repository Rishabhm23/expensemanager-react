import { useEffect, useState } from "react";
import EmojiPickerPopup from "./EmojiPickerPopup";
import Input from "./input";
import { LoaderCircle } from "lucide-react";

const AddIncomeForm = ({onAddIncome, categories}) => {
    const [income, setIncome] = useState({
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
        setIncome({...income, [key]:value});
    }

    const handleAddIncome = async () => {
        setLoading(true);
        try{
            await onAddIncome(income);
        }finally{
            setLoading(false);
        }
    }


    useEffect(() => {
        if(categories.length > 0 && !income.categoryId){
            setIncome((prev) => ({...prev, categoryId: categories[0].id}))
        }
    }, [categories, income.categoryId]);

    return(
        <div>
            <EmojiPickerPopup 
                icon={income.icon}
                onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
            />
            <Input 
                value={income.name}
                onChange={({target}) => handleChange('name', target.value)}
                label="income Source"
                placeholder="e.g., Salary, Freelance, Bonus"
                type="text"
            />

            <Input 
                label="Category"
                value={income.categoryId}
                onChange={({target}) => handleChange('categoryId', target.value)}
                isSelect={true}
                options={categoryOptions}
            />

            <Input 
                label="Amount"
                value={income.amount}
                onChange={({target}) => handleChange('amount', target.value)}
                placeholder="e.g., 500.00"
                type="number"
            />

            <Input 
                label="Date"
                value={income.date}
                onChange={({target}) => handleChange('date', target.value)}
                placeholder=""
                type="date"
            />

            <div className="flex justify-end mt-4">
                <button 
                    onClick={handleAddIncome}
                    className="flex items-center gap-1 bg-purple-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                    {loading ? (
                        <>
                            <LoaderCircle className="w-4 h-4 animate-spin"/>
                            Adding...
                        </>
                    ) : (
                        <>
                            Add Income
                        </>
                    )}
                </button>
            </div>
            

        </div>
    )
}

export default AddIncomeForm;