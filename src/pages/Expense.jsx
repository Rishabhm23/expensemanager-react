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
import toast from "react-hot-toast";

const Expense = () => {
    useUser();

    const [expenseData, setExpenseData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openAddExpenseModal, setOepnAddExpenseModal] = useState(false)
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });
    const fetchExpenseDetails = async () => {
        if(loading) return;
        setLoading(true);
        

        try{
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES);
            if(response.status === 200) {
                setExpenseData(response.data);
            }
        }catch(error){
            console.error("Failed to fetch expense details", error);
            toast.error(error.response?.data?.message || "Failed to fetch expense details");
        }finally{
            setLoading(false);
        }
    }

    const fetchExpenseCategories = async () => {
        try{
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("expense"));
           if(response.status === 200) {
                console.log("Expense categories", response.data);
                setCategories(response.data);
            }
        }catch(error){
            console.error("Failed to fetch expense categories", error);
            toast.error(error.response?.data?.message || "Failed to fetch expense categories");
            
        }
    }


    const handleAddExpense = async (expense) => {
        
        const {name, amount, date, icon, categoryId} = expense;
        if(!name.trim()){
            toast.error("Name not present");
            return;
        }

        if(!amount || isNaN(amount) || Number(amount)<= 0){
            toast.error("Amount should be valid number greater than 0");
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        if(date>today){
            toast.error("Date cannot be a future date");
            return;
        }

        if(!categoryId){
            toast.error("Please select a category");
            return;
        }

        try{
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSES,{
                name,
                amount: Number(amount),
                date,
                icon,
                categoryId
            })

            if (response.status === 201){
                toast.success("Expense added successfully");
                setOepnAddExpenseModal(false);
                fetchExpenseDetails();
                fetchExpenseCategories();
                
            }
        }

        catch(error){
            console.log("Error adding expense", error);
            toast.error(error.response?.data?.message || "Error adding expense");
        }


    }

    const deleteExpense = async (id) => {
        try{
            axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));
            setOpenDeleteAlert({show: false, data: null});
            toast.success("Deleted successfully");
            fetchExpenseDetails();
        }catch(error){
            toast.error(error.response?.data?.message || "Error deleting expense");
        }
    }

    const handleDownloadExpenseDetails = async () => {
        
        try{
            const response = await axiosConfig.get(API_ENDPOINTS.EXPENSE_EXCEL_DOWNLOAD, {responseType: "blob"});
            let filename = "expense_details.xlsx";
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link)
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Downladed expense details successfully");


        }catch(error){
            toast.error(error.response?.data?.message || "Error in download expense");
        }

    }

    const handleEmailExpenseDetails = async () => {
        
        try{

            const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_EXPENSE, {responseType: "blob"});
            if(response.status === 200){
                toast.success("Expense details emailed successfully")
            }
        }catch(error){
            toast.error(error.response?.data?.message || "Error in sending mail");
            console.error("Error in email expense", error);
        }
    }

    useEffect(() => {
        fetchExpenseDetails();
        fetchExpenseCategories()
    }, []);



    return(
        <Dashboard activeMenu="Expense">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <ExpenseOverview transactions={expenseData} onAddExpense = {() => setOepnAddExpenseModal(true)}/>
                    </div>
                    <ExpenseList 
                        transactions={expenseData} 
                        onDelete={(id) => setOpenDeleteAlert({show: true, data: id})}
                        onDownload={handleDownloadExpenseDetails}
                        onEmail={handleEmailExpenseDetails}
                    />

                    <Modal
                        isOpen={openAddExpenseModal}
                        onClose={() => setOepnAddExpenseModal(false)}
                        title="Add Expense"
                        >
                        <AddExpenseForm 
                            onAddExpense={(expense) => handleAddExpense(expense)}
                            categories={categories}
                        />

                    </Modal>

                    {}
                    <Modal
                        isOpen = {openDeleteAlert.show}
                        onClose={() => setOpenDeleteAlert({show: false, data: null})}
                        title="Delete Expense"
                    >
                        <DeleteAlert
                            content="Are you sure want to delete this expense details?"
                            onDelete={() => deleteExpense(openDeleteAlert.data)}
                        />
                    </Modal>
                    

                </div>
            </div>
        </Dashboard>
    )
}

export default Expense;