import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import useUser from "../hooks/useUser";
import axiosConfig from "../Util/axiosConfig";
import { API_ENDPOINTS } from "../Util/apiEndpoints";
import { toast } from "react-toastify";
import IncomeList from "../components/IncomeList";

const Income = () => {
  useUser();

  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);
      console.log("API RAW RESPONSE:", response.data);
      if (response.status === 200) {
        setIncomeData(response.data || []); // CORRECT
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

  useEffect(() => {
    fetchIncomeDetails();
  }, []);

  console.log("FINAL incomeData STATE:", incomeData);

  return (
    <Dashboard activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <IncomeList
            transactions={incomeData}
            onDelete={(id) => console.log("Deleting income:", id)}
          />
        </div>
      </div>
    </Dashboard>
  );
};

export default Income;
