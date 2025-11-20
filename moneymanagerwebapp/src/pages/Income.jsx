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
        console.log('income categories', response.data);
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

  useEffect(() => {
    fetchIncomeDetails();
    fetchIncomeCategories();
  }, []);

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
          </div>

          <IncomeList
            transactions={incomeData}
            onDelete={(id) => console.log("Deleting income:", id)}
          />

          <Modal
            isOpen={openAddIncomeModal}
            onClose={() => setOpenAddIncomeModal(false)}
            title="Add Income"
          >
            <AddIncomeForm 
            onAddIncome={(income)=>console.log('Add Income', income)}
            categories={categories}
            />
          </Modal>

        </div>
      </div>
    </Dashboard>
  );
};

export default Income;
