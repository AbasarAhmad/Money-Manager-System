import { Coins, Wallet, WalletCards } from "lucide-react";
import { addThousandsSeparator } from "../Util/util";
import useUser from "../hooks/useUser";
import Dashboard from "../components/Dashboard";
import InfoCard from "../components/InfoCard";
import RecentTransaction from "../components/RecentTransaction";
import Transactions from "../components/Transactions";
import axiosConfig from "../Util/axiosConfig";
import { API_ENDPOINTS } from "../Util/apiEndpoints";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import FinanceOverview from "../components/FinanceOverview";

const Home = () => {
  useUser();

  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetcher
  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_DASHBOARD);

      if (response.status === 200) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <Dashboard activeMenu="Dashboard">
      <div className="my-5 mx-auto space-y-8">

        {/* ⭐ TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<Wallet />}
            label="Total Balance"
            value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
            color="bg-purple-800"
          />

          <InfoCard
            icon={<WalletCards />}
            label="Total Income"
            value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
            color="bg-green-800"
          />

          <InfoCard
            icon={<Coins />}
            label="Total Expense"
            value={addThousandsSeparator(dashboardData?.totalExpense || 0)}
            color="bg-red-800"
          />
        </div>

        {/* ⭐ MIDDLE ROW — Recent Transactions + Finance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentTransaction
            transactions={dashboardData?.recentTransactions || []}
            onMore={() => navigate("/expense")}
          />

          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpense || 0}
          />
        </div>

        {/* ⭐ BOTTOM ROW — Recent Expenses (LEFT) & Recent Incomes (RIGHT) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Transactions
            title="Recent Expenses"
            transactions={dashboardData?.recent5Expenses || []}
            type="expense"
            onMore={() => navigate("/expense")}
          />

          <Transactions
            title="Recent Incomes"
            transactions={dashboardData?.recent5Incomes || []}
            type="income"
            onMore={() => navigate("/income")}
          />

        </div>

      </div>
    </Dashboard>
  );
};

export default Home;
