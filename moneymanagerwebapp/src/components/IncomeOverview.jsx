import React, { useEffect, useState } from 'react'
import { prepareIncomeLineChartData } from '../Util/util.js'
import CustomLineChart from './CustomLineChart.jsx'

const IncomeOverview = ({ transactions }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareIncomeLineChartData(transactions);
        console.log("Line chart processed data:", result);
        setChartData(result);
    }, [transactions]);

    return (
        <div className="card p-4">
            <p className="text-xs text-gray-400">
                Track your earnings over time and analyze income trends.
            </p>

            <div className="mt-8">
                <CustomLineChart data={chartData} />
            </div>
        </div>
    );
};

export default IncomeOverview;
