import React from "react";
import { colors } from "@/constant/data";
import Chart from "react-apexcharts";

const columnCharthome = {
    series: [
        {
            name: "Retiros",
            data: [40, 70, 45, 100, 75, 40, 80, 90],
        },
    ],
    options: {
        chart: {
            toolbar: {
                show: false,
            },
            offsetX: 0,
            offsetY: 0,
            zoom: {
                enabled: false,
            },
            sparkline: {
                enabled: true,
            },
        },
        plotOptions: {
            bar: {
                columnWidth: "60px",
                barHeight: "100%",
            },
        },
        legend: {
            show: false,
        },

        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },

        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return "$ " + val + "k";
                },
            },
        },
        yaxis: {
            show: false,
        },
        xaxis: {
            show: false,
            labels: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        colors: colors.info,
        grid: {
            show: false,
        },
    },
};
const columnCharthome3 = {
    series: [
        {
            name: "Balance",
            data: [40, 70, 45, 100, 75, 40, 80, 90],
        },
    ],
    options: {
        chart: {
            toolbar: {
                show: false,
            },
            offsetX: 0,
            offsetY: 0,
            zoom: {
                enabled: false,
            },
            sparkline: {
                enabled: true,
            },
        },
        plotOptions: {
            bar: {
                columnWidth: "60px",
                barHeight: "100%",
            },
        },
        legend: {
            show: false,
        },

        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },

        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return "$ " + val + "k";
                },
            },
        },
        yaxis: {
            show: false,
        },
        xaxis: {
            show: false,
            labels: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        colors: colors.success,
        grid: {
            show: false,
        },
    },
};
const columnCharthome4 = {
    series: [
        {
            name: "Pendiente",
            data: [40, 70, 45, 100, 75, 40, 80, 90],
        },
    ],
    options: {
        chart: {
            toolbar: {
                show: false,
            },
            offsetX: 0,
            offsetY: 0,
            zoom: {
                enabled: false,
            },
            sparkline: {
                enabled: true,
            },
        },
        plotOptions: {
            bar: {
                columnWidth: "60px",
                barHeight: "100%",
            },
        },
        legend: {
            show: false,
        },

        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },

        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return "$ " + val + "k";
                },
            },
        },
        yaxis: {
            show: false,
        },
        xaxis: {
            show: false,
            labels: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        colors: colors.warning,
        grid: {
            show: false,
        },
    },
};

const statistics = [
    {
        name: columnCharthome3,
        title: "Balance Disponible",
        count: "$34,564",
        bg: "bg-[#E5F9FF] dark:bg-slate-900	",
        text: "text-info-500",
        icon: "heroicons:shopping-cart",
    },
    {
        name: columnCharthome4,
        title: "Pendiente por Cobrar",
        count: "$3,564",
        bg: "bg-[#E5F9FF] dark:bg-slate-900	",
        text: "text-warning-500",
        icon: "heroicons:cube",
    },
    {
        name: columnCharthome,
        title: "Retiros",
        count: "$3,564",
        bg: "bg-[#E5F9FF] dark:bg-slate-900	",
        text: "text-warning-500",
        icon: "heroicons:cube",
    },
];
const FinanceChartHome = () => {
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
