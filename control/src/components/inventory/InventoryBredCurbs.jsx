import React, { useState } from "react";
import ProductButtons from '@/components/inventory/ProductsButtons'
import ServiceButtons from '@/components/inventory/ServiceButtons'

const buttonSet = {
  'serviceButtons': ServiceButtons,
  'productButtons': ProductButtons,
};

const HomeBredCurbs = ({ title, setID, refreshData }) => {
  const ActiveButtons = buttonSet[setID];
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  });

  const handleValueChange = (newValue) => {
    setValue(newValue);
  };
  return (
    <div className="flex justify-between flex-wrap items-center mb-6">
      <h4 className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
        {title}
      </h4>
      {ActiveButtons && <ActiveButtons refreshData={refreshData} />}
    </div>
  );
};

export default HomeBredCurbs;
