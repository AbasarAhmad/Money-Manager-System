import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const CustomPieChart = ({ data, label, totalAmount, colors }) => {
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={3}
          >
            {data.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={colors[idx]} // <-- 3 COLORS WILL SHOW CORRECTLY
              />
            ))}
          </Pie>

          {/* 🟣 Center label and amount */}
          <text
            x="50%"
            y="45%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm font-semibold"
          >
            {label}
          </text>

          <text
            x="50%"
            y="58%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-lg font-bold"
          >
            {totalAmount}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPieChart;
