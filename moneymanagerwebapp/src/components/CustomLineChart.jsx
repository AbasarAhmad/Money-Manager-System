import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

import { addThousandsSeparator } from "../Util/util";

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
        <div className="bg-white shadow-xl rounded-lg p-3 text-sm border border-gray-200">
            <p className="font-semibold">{data.label}</p>

            <p>
                <strong>Total:</strong>{" "}
                <span className="text-purple-600">
                    ₹{addThousandsSeparator(data.totalAmount)}
                </span>
            </p>

            <p className="mt-1 font-medium">Details:</p>

            {data.items.map((item) => (
                <p key={item.id}>
                    {item.name}: ₹{addThousandsSeparator(item.amount)}
                </p>
            ))}
        </div>
    );
};

const CustomLineChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <defs>
                    <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6C5DD3" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#6C5DD3" stopOpacity={0.05} />
                    </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12 }}
                />

                <YAxis
                    tickFormatter={(val) => addThousandsSeparator(val)}
                    tick={{ fontSize: 12 }}
                />

                <Tooltip content={<CustomTooltip />} />

                <Line
                    type="monotone"
                    dataKey="totalAmount"
                    stroke="#6C5DD3"
                    strokeWidth={3}
                    dot={{ r: 5, stroke: "#6C5DD3", fill: "white", strokeWidth: 2 }}
                    activeDot={{ r: 7 }}
                    fill="url(#colorPurple)"
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default CustomLineChart;
