import React, { useState, useContext } from "react";
import Card from "@/components/ui/Card";
import CardSlider from "@/components/partials/widget/CardSlider";
import DynamicTable from "@/pages/table/react-tables/DynamicTable";
import HomeBredCurbs from "@/components/finance/FinanceBredCurbs";
import { AuthContext } from "@/App";

const paymentPage = ({ mainTitle, buttonSet }) => {
  const { userData } = useContext(AuthContext);
  
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
              className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${row?.cell?.value === "active"
                  ? "text-success-500 bg-success-500"
                  : ""
                } 
              ${row?.cell?.value === "inactive"
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

  return (
    <div className="space-y-5">
      <HomeBredCurbs title={mainTitle} setID={buttonSet} />
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-4 col-span-12 space-y-5">
          <Card title="My card">
            <div className="max-w-[90%] mx-auto mt-2">
              <CardSlider />
            </div>
          </Card>
        </div>
        <div className="lg:col-span-8 col-span-12">
          <div className="space-y-5 bank-table">
            {/* <DynamicTable
              COLUMNS={SERVICECOLUMNS}
              moduleType="service"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default paymentPage;
