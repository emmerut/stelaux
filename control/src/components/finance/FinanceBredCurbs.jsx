import React, { useState } from "react";
import BillingButton from '@/components/finance/BillingButtons';
import PaymentButtons from '@/components/user/PaymentButtons';
import PortalButtons from '@/components/portals/ButtonPortal';



const buttonSet = {
  'billingButton': BillingButton,
  'paymentsButton': PaymentButtons,
  'portalButtons': PortalButtons
};


const HomeBredCurbs = ({ title, subtitle, setID,  }) => { // Se agrega "subtitle" como prop
  const ActiveButtons = setID ? buttonSet[setID] : null;

  /* const [value, setValue] = useState({
      startDate: new Date(),
      endDate: new Date().setMonth(11),
    });
  
    const handleValueChange = (newValue) => {
      setValue(newValue);
    }; */

  return (
    <div className="flex justify-between flex-wrap items-center mb-6">
      <div> {/* Se envuelve el título y subtítulo en un div */}
        <h4 className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
          {title}
        </h4>
        {/* Se condiciona la renderización del subtítulo */}
        {subtitle && <p className="text-gray-500">{subtitle}</p>} 
      </div>
      {ActiveButtons && <ActiveButtons />}
    </div>
  );
};


export default HomeBredCurbs;
