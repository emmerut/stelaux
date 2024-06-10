import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import ImageBlock2 from "@/components/partials/widget/block/image-block-2";
import GroupChart2 from "@/components/partials/widget/chart/group-chart-2";
import RevenueBarChart from "@/components/partials/widget/chart/revenue-bar-chart";
import ProfitChart from "../../components/partials/widget/chart/profit-chart";
import OrderChart from "../../components/partials/widget/chart/order-chart";
import EarningChart from "../../components/partials/widget/chart/earning-chart";
import SelectMonth from "@/components/partials/SelectMonth";
import Customer from "../../components/partials/widget/customer";
import RecentOrderTable from "../../components/partials/Table/recentOrder-table";
import BasicArea from "../../pages/chart/appex-chart/BasicArea";
import VisitorRadar from "../../components/partials/widget/chart/visitor-radar";
import MostSales2 from "../../components/partials/widget/most-sales2";
import Products from "../../components/partials/widget/products";
import Dropdown from "@/components/ui/Dropdown";
import ProductTable from "@/pages/table/react-tables/ProductTable";
import ServiceTable from "@/pages/table/react-tables/ServiceTable";
import ServiceVariantTable from "@/pages/table/react-tables/ServiceVariantTable";
import ProductVariantTable from "@/pages/table/react-tables/ProductVariantTable";


import HomeBredCurbs from "@/components/inventory/InventoryBredCurbs";

const Ecommerce = ({ mainTitle, buttonSet, tableType }) => {
  const [filterMap, setFilterMap] = useState("usa");

  const tableComponent = tableType === 'services'
    ? (
      <>
        <ServiceTable />
        <br />
        <ServiceVariantTable />
      </>
    )
    : tableType === 'products'
      ? (
        <>
          <ProductTable />
          <br />
          <ProductVariantTable />
        </>
      )
      : null;
  return (
    <div>
      <HomeBredCurbs title={mainTitle} setID={buttonSet} />
      {tableComponent}
    </div>
  );
};

export default Ecommerce;
