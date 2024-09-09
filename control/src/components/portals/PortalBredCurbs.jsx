import React, { useState } from "react";
import BillingButton from '@/components/finance/BillingButtons';
import PaymentButtons from '@/components/user/PaymentButtons';
import PortalButtons from '@/components/portals/ButtonPortal';

const buttonSet = {
  'portalButtons': PortalButtons
};


const HomeBredCurbs = ({ title, subtitle, setID,  }) => { 
  const ActiveButtons = setID ? buttonSet[setID] : null;
 
  /* const [value, setValue] = useState({
      startDate: new Date(),
      endDate: new Date().setMonth(11),
    });
  
    const handleValueChange = (newValue) => {
      setValue(newValue);
    }; */

  return (
    <div className="flex flex-col items-start mb-6 sm:flex-row sm:justify-between sm:items-center"> 
      <div> 
        <h4 className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
          {title}
        </h4>
        {subtitle && <p className="text-gray-500 mb-4">{subtitle}</p>} 
      </div>
      {ActiveButtons && <div>{/* Envolvemos el componente de botones en un div */}
         <ActiveButtons /> 
      </div>} 
    </div>
  );
};


export default HomeBredCurbs;

