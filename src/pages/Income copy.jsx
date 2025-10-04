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
import toast from "react-hot-toast";

const Income = () => {
    useUser();

    const [incomeData, setIncomeData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openAddIncomeModal, setOepnAddIncomeModal] = useState(false)
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });
    const fetchIncomeDetails = async () => {
        if(loading) return;
        setLoading(true);
        

        try{
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);
            if(response.status === 200) {
                setIncomeData(response.data);
            }
        }catch(error){
            toast.error("Failed to fetch income details");
        }finally{
            setLoading(false);
        }
    }

    const fetchIncomeCategories = async () => {
        try{
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("income"));
           if(response.status === 200) {
                console.log("Income categories", response.data);
                setCategories(response.data);
            }
        }catch(error){
            console.error("Failed to fetch income categories", error);
            toast.error("Failed to fetch income categories");
        }
    }


    const handleAddIncome = async (income) => {
        console.log("Income to be added: ", income);
        
        const {name, amount, date, icon, categoryId} = income;
        if(!name.trim()){
            toast.error("Provide a name");
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
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOMES,{
                name,
                amount: Number(amount),
                date,
                icon,
                categoryId
            })

            if (response.status === 201){
                console.log("Income added successfully", response.data);
                setOepnAddIncomeModal(false);
                fetchIncomeDetails();
                fetchIncomeCategories();
                toast.success("Income added successfully");
                
            }
        }

        catch(error){
            console.log("Error adding income", error);
            toast.error("Error adding income");
        }


    }

    const deleteIncome = async (id) => {
        try{
            axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));
            setOpenDeleteAlert({show: false, data: null});
            toast.success("Deleted successfully");
            fetchIncomeDetails();
        }catch(error){
            console.log("Error deleting income", error);
            toast.error("Error deleting income");
        }
    }

    const handleDownloadIncomeDetails = async () => {
        
        try{
            const response = await axiosConfig.get(API_ENDPOINTS.INCOME_EXCEL_DOWNLOAD, {responseType: "blob"});
            let filename = "income_details.xlsx";
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link)
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Downladed income details");
        }catch(error){
            console.log("Error in download income", error);
            toast.error(error.response?.data?.message || "Error in downloading income");
        }

    }

    const handleEmailIncomeDetails = async () => {
        
        try{

            const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_INCOME, {responseType: "blob"});
            if(response.status === 200){
                
                toast.success("Income details emailed");
            }
        }catch(error){
            console.log("Error in email income", error);
            toast.error(error.response?.data?.message || "Error in email income");
        }
    }

    useEffect(() => {
        fetchIncomeDetails();
        fetchIncomeCategories()
    }, []);



    return(
        <Dashboard activeMenu="Income">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <IncomeOverview transactions={incomeData} onAddIncome = {() => setOepnAddIncomeModal(true)}/>
                    </div>
                    <IncomeList 
                        transactions={incomeData} 
                        onDelete={(id) => setOpenDeleteAlert({show: true, data: id})}
                        onDownload={handleDownloadIncomeDetails}
                        onEmail={handleEmailIncomeDetails}
                    />
                    <Modal
                        isOpen={openAddIncomeModal}
                        onClose={() => setOepnAddIncomeModal(false)}
                        title="Add Income"
                        >
                        <AddIncomeForm 
                            onAddIncome={(income) => handleAddIncome(income)}
                            categories={categories}
                        />
                    </Modal>
                    <Modal
                        isOpen = {openDeleteAlert.show}
                        onClose={() => setOpenDeleteAlert({show: false, data: null})}
                        title="Delete Income"
                    >
                        <DeleteAlert
                            content="Are you sure want to delete this income details?"
                            onDelete={() => deleteIncome(openDeleteAlert.data)}
                        />
                    </Modal>
                </div>
            </div>
        </Dashboard>
    )
}

export default Income;