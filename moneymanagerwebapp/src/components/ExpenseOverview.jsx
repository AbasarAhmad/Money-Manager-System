import React, { useEffect, useState } from "react";
import { prepareIncomeLineChartData } from "../Util/util.js";
import CustomLineChart from "./CustomLineChart.jsx";
import { Plus } from "lucide-react";

const ExpenseOverview = ({ transactions, onAddExpense }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareIncomeLineChartData(transactions || []);
        setChartData(result);
    }, [transactions]);

    return (
        <div className="card p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h5 className="font-semibold text-lg">Expense Overview</h5>
                    <p className="text-xs text-gray-500">
                        Track daily expenses and analyze your spending pattern.
                    </p>
                </div>

                <button
                    onClick={onAddExpense}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
                >
                    <Plus size={18} />
                    Add Expense
                </button>
            </div>

            <div className="mt-8">
                <CustomLineChart data={chartData} />
            </div>

        </div>
    );
};

export default ExpenseOverview;
