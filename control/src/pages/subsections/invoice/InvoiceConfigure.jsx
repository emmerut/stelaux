import React from "react";
import Card from "@/components/ui/Card";
import InvoiceForm from "@/components/form/Billing/InvoiceForm";
import userDarkMode from "@/hooks/useDarkMode";

// import images
import MainLogo from "@/assets/images/logo/logo.svg";
import LogoWhite from "@/assets/images/logo/logo-white.svg";

const InvoiceConfigurePage = () => {
    const printPage = () => {
        window.print();
    };
    const [isDark] = userDarkMode();

    return (
        <div className="flex justify-between flex-col md:flex-row space-y-4 px-6 pt-6 pb-6 rounded-t-md">
          <div className="w-full md:w-1/2 md:pr-4 pr-0">
            <Card bodyClass="p-4 rounded-md w-full">
              {/* state render de facturación */}
              <div className="flex justify-center">
                <img src={isDark ? LogoWhite : MainLogo} alt="" />
              </div>
              <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 mt-4 text-sm">
                {/* Campos de facturación en tiempo real */}
                
              </div>
            </Card>
          </div>
          <div className="w-full md:w-1/2 md:pl-4 pl-0">
            <Card bodyClass="p-4 rounded-md w-full">
              {/* Formulario de carga */}
              <div className="max-h-[500px] overflow-y-scroll p-4 invoice-form">
                <InvoiceForm />
              </div>
            </Card>
          </div>
        </div>
      );
};

export default InvoiceConfigurePage;
