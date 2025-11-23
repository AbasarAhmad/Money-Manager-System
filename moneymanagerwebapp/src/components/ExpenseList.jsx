import { Download, LoaderCircle, Mail } from "lucide-react";
import moment from "moment";
import TransactionInfoCard from "../components/TransactionInfoCard";

const ExpenseList = ({ transactions, onDelete, onDownload, onEmail, loading }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expenses</h5>

        <div className="flex items-center gap-2">

          {/* EMAIL BUTTON */}
          <button
            disabled={loading}
            className="card-btn flex items-center gap-1"
            onClick={onEmail}
          >
            {loading ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                Emailing...
              </>
            ) : (
              <>
                <Mail size={15} /> Email
              </>
            )}
          </button>

          {/* DOWNLOAD BUTTON */}
          <button
            disabled={loading}
            className="card-btn flex items-center gap-1"
            onClick={onDownload}
          >
            {loading ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download size={15} /> Download
              </>
            )}
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
