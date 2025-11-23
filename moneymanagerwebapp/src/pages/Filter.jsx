import React, { useState } from 'react';
import Dashboard from '../components/Dashboard';
import useUser from '../hooks/useUser';
import { Search } from 'lucide-react';
import axiosConfig from '../Util/axiosConfig';
import { API_ENDPOINTS } from '../Util/apiEndpoints';
import moment from "moment";
import { toast } from 'react-toastify';
import TransactionInfoCard from '../components/TransactionInfoCard';

const Filter = () => {
  useUser();

  const [type, setType] = useState("income");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.APPLY_FILTERS, {
        type,
        startDate,
        endDate,
        keyword,
        sortField,
        sortOrder
      });

      setTransactions(response.data);
    }
    catch (error) {
      console.error("Failed to fetch transactions:", error);
      toast.error(error.message || "Failed to fetch transactions");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard activeMenu="Filters">

      <div className="my-5 mx-auto card p-4 mb-4">

        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 sm:grid-cols-5 md:grid-cols-6 gap-3"
        >

          {/* TYPE */}
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* START DATE */}
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* END DATE */}
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* SORT FIELD */}
          <div>
            <label className="block text-sm font-medium mb-1">Sort Field</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
            </select>
          </div>

          {/* SORT ORDER */}
          <div>
            <label className="block text-sm font-medium mb-1">Sort Order</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {/* KEYWORD */}
          <div className="sm:col-span-3 md:col-span-4 mt-2">
            <label className="block text-sm font-medium mb-1">Search Keyword</label>
            <input
              type="text"
              placeholder="Search by keyword..."
              className="w-full border rounded px-3 py-2"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          {/* SEARCH BUTTON */}
          <div className="sm:col-span-1 md:col-span-1 flex items-end mt-2">
            <button
              type="submit"
              className="w-full h-[42px] p-2 bg-purple-800 hover:bg-purple-700 text-white rounded flex items-center justify-center"
              disabled={loading}
            >
              {loading ? "Searching..." : <>Search <Search size={20} className="ml-2" /></>}
            </button>
          </div>

        </form>
      </div>

      {/* OUTPUT */}
      <div className="card p-4">
        <h5 className="text-lg font-semibold mb-4">Transactions</h5>

        {transactions.length === 0 && !loading && (
          <p className="text-gray-500">Select filters and click Search</p>
        )}

        {loading && (
          <p className="text-gray-500">Loading Transactions...</p>
        )}

        {transactions.map((transaction) => (
          <TransactionInfoCard
            key={transaction.id}
            title={transaction.name}
            icon={transaction.icon}
            date={moment(transaction.date).format('DD MMM YYYY')}
            amount={transaction.amount}
            type={transaction.type}    // ← CORRECT FIX
            hideDeleteBtn
          />
        ))}
      </div>

    </Dashboard>
  );
};

export default Filter;
