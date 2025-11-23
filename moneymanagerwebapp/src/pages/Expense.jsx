import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import useUser from "../hooks/useUser";
import axiosConfig from "../Util/axiosConfig";
import { API_ENDPOINTS } from "../Util/apiEndpoints";
import { toast } from "react-toastify";

import ExpenseList from "../components/ExpenseList";
import Modal from "../components/Modal";
import AddExpenseForm from "../components/AddExpenseForm";
import DeleteAlert from "../components/DeleteAlert";
import ExpenseOverview from "../components/ExpenseOverview";

const Expense = () => {
  useUser();

  const [expenseData, setExpenseData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });

  const fetchExpenseDetails = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES);
      if (response.status === 200) setExpenseData(response.data || []);
    } catch {
      toast.error("Failed to fetch expenses");
    }
  };

  const fetchExpenseCategories = async () => {
    try {
      const response = await axiosConfig.get(
        API_ENDPOINTS.CATEGORY_BY_TYPE("expense")
      );
      setCategories(response.data);
    } catch {
      toast.error("Failed to fetch categories");
    }
  };

  const handleAddExpense = async (expense) => {
    try {
      const resp = await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, expense);
      if (resp.status === 201) {
        toast.success("Expense added successfully");
        setOpenAddExpenseModal(false);
        fetchExpenseDetails();
        fetchExpenseCategories();
      }
    } catch {
      toast.error("Failed to add expense");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));
      toast.success("Expense deleted");
      fetchExpenseDetails();
    } catch {
      toast.error("Failed to delete expense");
    }
  };

  // DOWNLOAD EXPENSE
  const handleDownloadExpenseDetails = async () => {
    try {
      setActionLoading(true);

      const response = await axiosConfig.get(API_ENDPOINTS.EXPENSE_EXCEL_DOWNLOAD, {
        responseType: "blob",
      });

      const filename = "expense_details.xlsx";

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", filename);
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Expense details downloaded successfully");
    } catch (err) {
      toast.error("Failed to download expense file");
    } finally {
      setActionLoading(false);
    }
  };

  // EMAIL EXPENSE
  const handleEmailExpenseDetails = async () => {
    try {
      setActionLoading(true);
      const res = await axiosConfig.get(API_ENDPOINTS.EMAIL_EXPENSE);
      if (res.status === 200) toast.success("Expense details emailed successfully");
    } catch {
      toast.error("Failed to email expense details");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
    fetchExpenseCategories();
  }, []);

  return (
    <Dashboard activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">

          <ExpenseOverview
            transactions={expenseData}
            onAddExpense={() => setOpenAddExpenseModal(true)}
          />

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadExpenseDetails}
            onEmail={handleEmailExpenseDetails}
            loading={actionLoading}
          />

          <Modal
            isOpen={openAddExpenseModal}
            onClose={() => setOpenAddExpenseModal(false)}
            title="Add Expense"
          >
            <AddExpenseForm onAddExpense={handleAddExpense} categories={categories} />
          </Modal>

          <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
            title="Delete Expense"
          >
            <DeleteAlert
              content="Are you sure want to delete this expense?"
              onDelete={() => deleteExpense(openDeleteAlert.data)}
            />
          </Modal>

        </div>
      </div>
    </Dashboard>
  );
};

export default Expense;
