import React from "react";
import { ArrowRight } from "lucide-react";
import moment from "moment";
import TransactionInfoCard from "../components/TransactionInfoCard";

const RecentTransaction = ({ transactions, onMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h4 className="text-lg">Recent Transactions</h4>

        <button className="card-btn flex items-center gap-1" onClick={onMore}>
          More <ArrowRight size={15} />
        </button>
      </div>

      <div className="mt-6">
        {transactions?.slice(0, 5)?.map((item) => (
          <TransactionInfoCard
            key={item.id}
            title={item.name}
            icon={item.icon}
            date={moment(item.date).format("DD MMM YYYY")}
            amount={item.amount}

            // type MUST be income or expense (Fix applied)
            type={item.type}

            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default RecentTransaction;
