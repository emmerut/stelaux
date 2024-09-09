import React from "react";
import Icon from "@/components/ui/Icon";

const Step = ({ steps, currentStep }) => {
  return (
    <div>
      <div className="mx-auto flex z-[5] items-center relative justify-center">
        {steps.map((step, i) => (
          <div
            className="relative z-[1] items-center item flex flex-start flex-1 last:flex-none"
            key={step.id}
          >
            <div
              className={`   ${
                currentStep >= i
                  ? "bg-indigo-900 text-white ring-indigo-500 ring-offset-2"
                  : "bg-white ring-indigo-500 ring-opacity-70  text-indigo-500 text-opacity-70"
              }  icon-box h-12 w-12 rounded-full flex flex-col items-center justify-center relative z-[66] ring-1 text-lg font-medium`}
            >
              {currentStep <= i ? (
                <span> {i + 1}</span>
              ) : (
                <span className="text-3xl">
                  <Icon icon="bx:check-double" />
                </span>
              )}
            </div>

            <div
              className={`${
                currentStep >= i ? "bg-primary-500" : "bg-[#E0EAFF]"
              } absolute top-1/2 h-[2px] w-full`}
            ></div>

            <div className="text-sm mt-[10px] leading-[16px] font-medium capitalize text-slate-500-500 text-center">
              {/* Puedes agregar aquí el nombre del paso si lo necesitas: {step.name} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step;
