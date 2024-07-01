import React, { useState, useEffect, useCallback } from "react";
import Card from "@/components/ui/Card";
import { colors } from "@/constant/data";
import Textinput from "@/components/ui/Textinput";
import FinanceChartHome from "@/components/partials/widget/chart/FinanceChartHome";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import HistoryChart from "@/components/partials/widget/chart/history-chart";
import AccountReceivable from "@/components/partials/widget/chart/account-receivable";
import AccountPayable from "@/components/partials/widget/chart/account-payable";
import CardSlider from "@/components/partials/widget/CardSlider";
import TransactionsTable from "@/components/partials/Table/transactions";
import SelectMonth from "@/components/partials/SelectMonth";
import HomeBredCurbs from "@/components/finance/FinanceBredCurbs";
import NavBredCurbs from "@/components/ui/Breadcrumbs";

import { financeData } from '@/constant/sessionData'

const users = [
  {
    name: "Ab",
  },
  {
    name: "Bc",
  },
  {
    name: "Cd",
  },
  {
    name: "Df",
  },
  {
    name: "Ab",
  },
  {
    name: "Sd",
  },
  {
    name: "Sg",
  },
];

const BankingPage = ({ mainTitle, buttonSet }) => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [lastBalances, setLastBalances] = useState([]);
  const [lastWithdrawals, setLastWithdrawals] = useState([]);
  const [lastPending, setLastPending] = useState([]);

  useEffect(() => {
    const fetchData = async () => { 
      try {
        const res = await financeData(); 
        setTotalBalance(res.available_balance);
        setTotalPending(res.pending_balance);
        setTotalWithdrawals(res.total_withdrawals);
        setLastBalances(res.last_cash_balances);
        setLastWithdrawals(res.last_withdrawals);
        setLastPending(res.pending_deposits);
        // You can do more with the data, like:
        // - Display the withdrawals list (res.withdrawals_list)
        // - Process cash balances list (res.cash_balances_list)
        // - Handle the "has_withdrawals" flag
      } catch (error) {
        console.error('Error fetching data:', error); 
      }
    };
    fetchData(); // Call the async function
  }, []); 

  const [activeIndex, setActiveIndex] = useState(0);

  const columnCharthome = {
    series: [
        {
            name: "Retiros",
            data: lastWithdrawals,
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
            data: lastBalances,
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
            data: lastPending,
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
    count: `$${totalBalance}`, // Correctly use template literals to embed variables
    bg: "bg-[#E5F9FF] dark:bg-slate-900	",
    text: "text-info-500",
    icon: "heroicons:shopping-cart",
  },
  {
    name: columnCharthome4,
    title: "Pendiente por Cobrar",
    count: `$${totalPending}`,
    bg: "bg-[#E5F9FF] dark:bg-slate-900	",
    text: "text-warning-500",
    icon: "heroicons:cube",
  },
  {
    name: columnCharthome,
    title: "Retiros",
    count: `$${totalWithdrawals}`,
    bg: "bg-[#E5F9FF] dark:bg-slate-900	",
    text: "text-warning-500",
    icon: "heroicons:cube",
  },
];
  /* const [dataFetched, setDataFetched] = useState(false);
const [dataLoaded, setDataLoaded] = useState(false);
const [dataProductTable, setDataProductTable] = useState([]);
const [dataServiceTable, setDataServiceTable] = useState([]);
const [service, setService] = useState([]);
const [product, setProduct] = useState([]);
const [productVariant, setProductVariant] = useState([]);
const [serviceVariant, setServiceVariant] = useState([]);
const [dataProductVariantTable, setProductVariantDataTable] = useState([]);
const [dataServiceVariantTable, setDataServiceVariantTable] = useState([]);
const [filterMap, setFilterMap] = useState("usa");

const updateTableData = (data, setDataFunction) => {
 
  const table = [];
  data.forEach(item => {
    // Define the object structure based on the tableType
    let tableRow;
    if (tableType === 'services') {
      tableRow = {
        id: item.id,
        service: item.title,
        image: item.image,
        profit: item.profit,
        status: item.status,
        action: null,
      };
    } else if (tableType === 'products') {
      tableRow = {
        id: item.id,
        product: item.title,
        image: item.image,
        stock: item.total_stock,
        status: item.status,
        action: null,
      };
    } else if (tableType === 'products') {
      tableRow = {
        id: item.id,
        sku: item.sku,
        variant: item.parent,
        color: item.render_color,
        size: item.size,
        image: item.image,
        stock: item.stock,
        price: item.price,
        status: item.status,
        action: null,
      };
    } else if (tableType === 'services') {
      tableRow = {
        id: item.id,
        parent: item.parent,
        variantService: item.title,
        image: item.image,
        price: item.price,
        status: item.status,
        action: null,
      };
    }
    table.push(tableRow);
  });
  setDataFunction(table);
};

const updateTableChildData = (data, setDataFunction) => {
  const table = [];
  data.forEach(item => {
    // Define the object structure based on the tableType
    let tableRow;
    if (tableType === 'products') {
      tableRow = {
        id: item.id,
        sku: item.sku,
        variant: item.parent,
        color: item.render_color,
        size: item.size,
        image: item.image,
        stock: item.stock,
        price: item.price,
        status: item.status,
        action: null,
      };
    } else if (tableType === 'services') {
      tableRow = {
        id: item.id,
        parent: item.parent,
        variantService: item.title,
        image: item.image,
        price: item.price,
        status: item.status,
        action: null,
      };
    }
    table.push(tableRow);
  });
  setDataFunction(table);
};

const fetchData = useCallback(async () => {
  if (tableType === 'services') {
    try {
      const res = await serviceData();
      if (res.services && res.variants) { 
        setService(res.services);
        setServiceVariant(res.variants);
        updateTableData(res.services, setDataServiceTable); 
        updateTableChildData(res.variants, setDataServiceVariantTable);
        
        setDataFetched(true);
      } else {
        // Handle case where either services or variants is null or undefined
        console.warn("Missing data in serviceData response. Services:", res.services, "Variants:", res.variants);
        setDataFetched(true);
      }
    } catch (error) {
      setDataFetched(true);
    }
  } else if (tableType === 'products') {
    try {
      const res = await productData();
      if (res.products && res.variants) { // Check if both products and variants exist
        setProduct(res.products);
        setProductVariant(res.variants);
        updateTableData(res.products, setDataProductTable); 
        updateTableChildData(res.variants, setProductVariantDataTable);
        setDataFetched(true);
      } else {
        // Handle case where either products or variants is null or undefined
        console.warn("Missing data in productData response. Products:", res.products, "Variants:", res.variants);
        setDataFetched(true);
      }
    } catch (error) {
      setDataFetched(true);
    }
  }
}, [tableType]);
 
useEffect(() => {
  fetchData(); 
}, [fetchData, tableType]);

useEffect(() => {
  setDataLoaded(true);
}, [service, product, productVariant, serviceVariant]);

const SERVICECOLUMNS = [
  {
    Header: "Id",
    accessor: "id",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "servicio",
    accessor: "service",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "imagen",
    accessor: "image",
    Cell: (row) => {
      return (
        <div>
          <span className="inline-flex items-center">
            <span className="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none bg-slate-600">
              <img
                src={row?.cell?.value}
                alt=""
                className="object-cover w-full h-full rounded-full"
              />
            </span>
          </span>
        </div>
      );
    },
  },
  {
    Header: "profit",
    accessor: "profit",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "status",
    accessor: "status",
    Cell: (row) => {
      return (
        <span className="block w-full">
          <span
            className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
              row?.cell?.value === "active"
                ? "text-success-500 bg-success-500"
                : ""
            } 
            ${
              row?.cell?.value === "inactive"
                ? "text-warning-500 bg-warning-500"
                : ""
            }
            
             `}
          >
            {row?.cell?.value}
          </span>
        </span>
      );
    },
  },
];

const PRODUCTCOLUMNS = [
  {
    Header: "Id",
    accessor: "id",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "producto",
    accessor: "product",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "imagen",
    accessor: "image",
    Cell: (row) => {
      return (
        <div>
          <span className="inline-flex items-center">
            <span className="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none bg-slate-600">
              <img
                src={row?.cell?.value}
                alt=""
                className="object-cover w-full h-full rounded-full"
              />
            </span>
          </span>
        </div>
      );
    },
  },
  {
    Header: "stock",
    accessor: "stock",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "status",
    accessor: "status",
    Cell: (row) => {
      return (
        <span className="block w-full">
          <span
            className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
              row?.cell?.value === "active"
                ? "text-success-500 bg-success-500"
                : ""
            } 
            ${
              row?.cell?.value === "inactive"
                ? "text-warning-500 bg-warning-500"
                : ""
            }
            
             `}
          >
            {row?.cell?.value}
          </span>
        </span>
      );
    },
  },
];

const VARIANTPRODUCTCOLUMNS = [
  {
    Header: "Id",
    accessor: "id",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "sku",
    accessor: "sku",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "variante",
    accessor: "variant",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "color",
    accessor: "color",
    Cell: (row) => {
      const colorClass = row?.cell?.value ? `${row?.cell?.value}` : "";
      return (
        <div className={`rounded w-6 h-6 ${colorClass}`}>

        </div>
      );
    },
  },
  {
    Header: "tamaño",
    accessor: "size",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "imagen",
    accessor: "image",
    Cell: (row) => {
      return (
        <div>
          <span className="inline-flex items-center">
            <span className="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none bg-slate-600">
              <img
                src={row?.cell?.value}
                alt=""
                className="object-cover w-full h-full rounded-full"
              />
            </span>
          </span>
        </div>
      );
    },
  },
  {
    Header: "stock",
    accessor: "stock",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "status",
    accessor: "status",
    Cell: (row) => {
      return (
        <span className="block w-full">
          <span
            className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
              row?.cell?.value === "active"
                ? "text-success-500 bg-success-500"
                : ""
            } 
            ${
              row?.cell?.value === "inactive"
                ? "text-warning-500 bg-warning-500"
                : ""
            }
            
             `}
          >
            {row?.cell?.value}
          </span>
        </span>
      );
    },
  },
  {
    Header: "precio",
    accessor: "price",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
];

const VARIANTSERVICECOLUMNS = [
  {
    Header: "Id",
    accessor: "id",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "parent",
    accessor: "parent",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "Variante",
    accessor: "variantService",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "image",
    accessor: "image",
    Cell: (row) => {
      return (
        <div>
          <span className="inline-flex items-center">
            <span className="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none bg-slate-600">
              <img
                src={row?.cell?.value}
                alt=""
                className="object-cover w-full h-full rounded-full"
              />
            </span>
          </span>
        </div>
      );
    },
  },
  {
    Header: "status",
    accessor: "status",
    Cell: (row) => {
      return (
        <span className="block w-full">
          <span
            className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
              row?.cell?.value === "active"
                ? "text-success-500 bg-success-500"
                : ""
            } 
            ${
              row?.cell?.value === "inactive"
                ? "text-warning-500 bg-warning-500"
                : ""
            }
            
             `}
          >
            {row?.cell?.value}
          </span>
        </span>
      );
    },
  },
  {
    Header: "price",
    accessor: "price",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
]; */

  return (

    <div className="space-y-5">
      <HomeBredCurbs title={mainTitle} setID={buttonSet} />
      <Card>
        <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 place-content-center">
          <FinanceChartHome statistics={statistics} />
        </div>
      </Card>
      <Card>
        <div className="space-y-5 bank-table">
          <TransactionsTable />
        </div>
      </Card>
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-4 col-span-12 space-y-5">
          <Card title="Solicitud de Retiro">
            <div className="space-y-6">

              <div className="bg-slate-100 dark:bg-slate-900 rounded-md p-4">
                <span
                  className="text-xs text-slate-500 dark:text-slate-400 block mb-1 cursor-pointer font-normal"
                  htmlFor="cdp"
                >
                  Amount
                </span>
                <Textinput
                  placeholder="$6547"
                  id="cdp"
                  className="bg-transparent border-none focus:ring-0 focus:border-none p-0 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 placeholder:font-medium  h-auto font-medium"
                />
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 rounded-md p-4">
                <label
                  className="text-xs text-slate-500 dark:text-slate-400 block cursor-pointer mb-1"
                  htmlFor="cd"
                >
                  Recipient account number
                </label>

                <Textinput
                  placeholder="3458-3548-6548-3244"
                  isMask
                  id="cd"
                  className="bg-transparent border-none focus:ring-0 focus:border-none p-0 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 h-auto placeholder:font-medium font-medium"
                />
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 rounded-md p-4">
                <label
                  className="text-xs text-slate-500 dark:text-slate-400 block cursor-pointer mb-1"
                  htmlFor="cd"
                >
                  Recipient account number
                </label>

                <Textinput
                  placeholder="3458-3548-6548-3244"
                  isMask
                  id="cd"
                  className="bg-transparent border-none focus:ring-0 focus:border-none p-0 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 h-auto placeholder:font-medium font-medium"
                />
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                    Total amount
                  </span>
                  <span className="text-lg font-medium text-slate-900 dark:text-white block">
                    $6547
                  </span>
                </div>
                <div>
                  <button type="button" className="btn btn-dark">
                    Realizar Retiro
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-8 col-span-12">
          <div className="space-y-5 bank-table">
            <TransactionsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankingPage;
