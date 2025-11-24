import { addThousandsSeparator } from "../Util/util";
import CustomPieChart from "../components/CustomPieChart";

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
  
  const COLORS = ["#59168B", "#a0090e", "#016630"];

  const balanceData = [
    { name: "Total Balance", amount: totalBalance },
    { name: "Total Expenses", amount: totalExpense },
    { name: "Total Income", amount: totalIncome },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-lg">Financial Overview</h5>
      </div>

      <CustomPieChart
        data={balanceData}
        label="Total Balance"
        totalAmount={`₹ ${addThousandsSeparator(totalBalance)}`}
        colors={COLORS}
      />

      {/* 🔥 Legend Section (3 colors clearly shown) */}
      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: COLORS[0] }}></span>
          <span className="text-sm">Total Balance</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: COLORS[1] }}></span>
          <span className="text-sm">Total Expenses</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: COLORS[2] }}></span>
          <span className="text-sm">Total Income</span>
        </div>
      </div>
    </div>
  );
};

export default FinanceOverview;
