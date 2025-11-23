import { Download, Mail } from "lucide-react";
import React from "react";
import moment from "moment";
import TransactionInfoCard from "../components/TransactionInfoCard";

const ExpenseList = ({ transactions, onDelete }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expenses</h5>

        <div className="flex items-center gap-2">
          <button className="card-btn flex items-center gap-1">
            <Mail size={15} /> Email
          </button>

          <button className="card-btn flex items-center gap-1">
            <Download size={15} /> Download
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {transactions?.map((expense) => (
          <TransactionInfoCard
            key={expense.id}
            title={expense.name}
            icon={expense.icon}
            date={moment(expense.date).format("DD MMM YYYY")}
            amount={expense.amount}
            type="expense"
            onDelete={() => onDelete(expense.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
