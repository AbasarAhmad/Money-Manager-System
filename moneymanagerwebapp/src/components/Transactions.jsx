import React from "react";
import { ArrowRight } from "lucide-react";
import moment from "moment";
import TransactionInfoCard from "../components/TransactionInfoCard";

const Transactions = ({ transactions = [], onMore, type, title }) => {
  return (
    <div className="card">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>

        <button
          className="card-btn flex items-center gap-1"
          onClick={onMore}
        >
          More <ArrowRight size={15} />
        </button>
      </div>

      {/* LIST */}
      <div className="mt-6">
        {transactions.slice(0, 5).map((item) => (
          <TransactionInfoCard
            key={item.id}
            title={item.name}
            icon={item.icon}
            date={moment(item.date).format("DD MMM YYYY")}
            amount={item.amount}
            type={type}       // income | expense
            hideDeleteBtn
          />
        ))}

        {/* EMPTY STATE */}
        {transactions.length === 0 && (
          <p className="text-gray-500 text-sm">No transactions found</p>
        )}
      </div>
    </div>
  );
};

export default Transactions;
