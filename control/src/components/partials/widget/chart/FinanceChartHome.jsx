import React from "react";
import Chart from "react-apexcharts";

const FinanceChartHome = ({statistics}) => {
    return (
        <>
            {statistics.map((item, i) => (
                <div className="bg-slate-50 dark:bg-slate-900 rounded p-4" key={i}>
                    <div className="text-slate-600 dark:text-slate-400 text-sm mb-1 font-medium">
                        {item.title}
                    </div>
                    <div className="text-slate-900 dark:text-white text-lg font-medium">
                        {item.count}
                    </div>
                    <Chart
                        options={item.name.options}
                        series={item.name.series}
                        type="bar"
                        height="48"
                        width="100%"
                    />
                </div>
            ))}
        </>
    );
};

export default FinanceChartHome;
