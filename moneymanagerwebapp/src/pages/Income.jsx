import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import useUser from "../hooks/useUser";
import axiosConfig from "../Util/axiosConfig";
import { API_ENDPOINTS } from "../Util/apiEndpoints";
import { toast } from "react-toastify";
import IncomeList from "../components/IncomeList";
import Modal from "../components/Modal";
import { Plus } from "lucide-react";
import AddIncomeForm from "../components/AddIncomeForm";
import DeleteAlert from "../components/DeleteAlert";
import IncomeOverview from "../components/IncomeOverview";

const Income = () => {
  useUser();

  const [incomeData, setIncomeData] = useState([]);
  const [categories, setCategories] = useState([]);  // ✔ REQUIRED STATE
  const [loading, setLoading] = useState(false);
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  // Fetch income details
  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);
      if (response.status === 200) {
        setIncomeData(response.data || []);
      }
    } catch (error) {
      console.log("Failed to fetch income details", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch income details"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for income
  const fetchIncomeCategories = async () => {
    try {
      const response = await axiosConfig.get(
        API_ENDPOINTS.CATEGORY_BY_TYPE("income")
      );

      if (response.status === 200) {
        setCategories(response.data);
      }

    } catch (error) {
      console.log("Failed to fetch income categories: ", error);
      toast.error(
        error.response?.data?.message ||
        "Failed to fetch income for this category"
      );
    }
  };

  //Save the categories for income
  const handleAddIncome = async (income) => {
    const { name, amount, date, icon, categoryId } = income;

    //validation
    if (!name.trim()) {
      toast.error("Please enter a name");
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0");
      return;
    }
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    if (date > today) {
      toast.error('Date cannot be in the future');
      return;
    }
    if (!categoryId) {
      toast.error("Please select a category ");
      return;
    }
    try {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, {
        name,
        amount: Number(amount),
        date,
        icon,
        categoryId,
      })
      if (response.status === 201) {
        setOpenAddIncomeModal(false);
        toast.success("Income added successfully");
        fetchIncomeDetails();
        fetchIncomeCategories();
      }
    }
    catch (error) {
      console.log('Error adding income,', error);
      toast.error(error.response?.data?.message || "Failed to adding income")
    }
  }

  useEffect(() => {
    fetchIncomeDetails();
    fetchIncomeCategories();
  }, []);

    // delete income details
    const deleteIncome= async (id) =>{
      try{
        await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));
        setOpenDeleteAlert({show:false, data: null})
        toast.success("Income  deleted successfully");
        fetchIncomeDetails();
      }
      catch(error){
        console.log('Error deleting income', error);
        toast.error(error.response?.data?.message || "Failed to delete income");
      }
      
    }




  return (
    <Dashboard activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">

          <div>
            <button
              onClick={() => setOpenAddIncomeModal(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
            >
              <Plus size={18} />
              Add Income
            </button>

            <IncomeOverview transactions={incomeData}/>
          </div>

          <IncomeList
            transactions={incomeData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
          />

          {/* Add Income Modal */}
          <Modal
            isOpen={openAddIncomeModal}
            onClose={() => setOpenAddIncomeModal(false)}
            title="Add Income"
          >
            <AddIncomeForm
              onAddIncome={(income) => handleAddIncome(income)}
              categories={categories}
            />
          </Modal>

          {/* Delete Income Modal */}
          <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
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
  );
};

export default Income;


