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
  const [actionLoading, setActionLoading] = useState(false);
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });

  // Fetch expenses
  const fetchExpenseDetails = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES);
      if (response.status === 200) setExpenseData(response.data || []);
    } catch {
      toast.error("Failed to fetch expenses");
    }
  };

  // Fetch categories
  const fetchExpenseCategories = async () => {
    try {
      const resp = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("expense"));
      setCategories(resp.data);
    } catch {
      toast.error("Failed to fetch categories");
    }
  };

  // Add expense
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

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));
      toast.success("Expense deleted");
      fetchExpenseDetails();
    } catch {
      toast.error("Failed to delete expense");
    }
  };

  // DOWNLOAD
  const handleDownloadExpenseDetails = async () => {
    try {
      setActionLoading(true);

      const res = await axiosConfig.get(API_ENDPOINTS.EXPENSE_EXCEL_DOWNLOAD, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Expense details downloaded successfully");
    } catch {
      toast.error("Failed to download expense details");
    } finally {
      setActionLoading(false);
    }
  };

  // EMAIL
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
              onDelete={async () => {
                await deleteExpense(openDeleteAlert.data);
                setOpenDeleteAlert({ show: false, data: null }); // ✔ FINAL FIX
              }}
            />
          </Modal>

        </div>
      </div>
    </Dashboard>
  );
};

export default Expense;
