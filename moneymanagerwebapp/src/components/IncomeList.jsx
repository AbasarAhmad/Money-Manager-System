import { Download, Mail } from "lucide-react";
import React from "react";
import moment from "moment";
import TransactionInfoCard from "../components/TransactionInfoCard";

const IncomeList = ({ transactions, onDelete }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income Source</h5>

        <div className="flex items-center justify-end gap-2">
          <button className="card-btn flex items-center gap-1">
            <Mail size={15} /> Email
          </button>

          <button className="card-btn flex items-center gap-1">
            <Download size={15} /> Download
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {transactions?.map((income) => {
          console.log("Mapping Income:", income);

          return (
            <TransactionInfoCard
              key={income.id}
              title={income.name}
              icon={income.icon}
              date={moment(income.date).format("DD MMM YYYY")}
              amount={income.amount}
              type="income"
              onDelete={() => onDelete(income.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default IncomeList;
