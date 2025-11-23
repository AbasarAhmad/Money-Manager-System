import { UtensilsCrossed, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import React, { useState } from "react";
import { addThousandsSeparator } from '../Util/util';

const TransactionInfoCard = ({
  icon,
  title,
  date,
  amount,
  type,
  hideDeleteBtn,
  onDelete,
}) => {

  const [imgError, setImgError] = useState(false);

  const showFallback =
    imgError ||
    !icon ||
    typeof icon !== "string" ||
    icon.trim() === "";

  // ❇ Dynamic styling based on type
  const getAmountStyle = () =>
    type === "income"
      ? "bg-green-50 text-green-800"
      : "bg-red-50 text-red-800";

  return (
    <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60 shadow-sm">

      {/* ICON */}
      <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
        {showFallback ? (
          <UtensilsCrossed className="text-purple-900 w-6 h-6" />
        ) : (
          <img
            src={icon}
            alt={title}
            className="w-6 h-6"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* TITLE + DATE */}
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-500">{date}</p>
      </div>

      {/* AMOUNT BOX (ONLY ONCE) */}
      <div className={`ml-auto px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${getAmountStyle()}`}>
        <span>
          {type === "income" ? "+" : "-"}₹{addThousandsSeparator(amount)}
        </span>

        {type === "income" ? (
          <TrendingUp size={15} />
        ) : (
          <TrendingDown size={15} />
        )}
      </div>

      {/* DELETE BUTTON */}
      {!hideDeleteBtn && (
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <Trash2 size={18} className=" text-red-500 hover:text-red-700" />
        </button>
      )}

    </div>
  );
};

export default TransactionInfoCard;
