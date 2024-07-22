import { AuthContext } from '@/App';
import React, { useState, useContext } from "react";
import Button from "@/components/ui/Button";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import { triggerNewcomerPlan } from "@/constant/apiData"
import { useNavigate } from "react-router-dom";

// import images
import img1 from "@/assets/images/all-img/big-shap1.png";
import img2 from "@/assets/images/all-img/big-shap2.png";
import img3 from "@/assets/images/all-img/big-shap3.png";

const plans = [
  {
    title: "Starter",
    price_Yearly: "6.99",
    price_Monthly: "9.99",
    button: "prueba gratuita/15 días",
    bg: "bg-white",
    img: img1,
    addons: [
      "Manejo de Dominios",
      "Templates Store Landing Page",
      "Web Editor",
      "Inventario (Servicios)",
      "Finanzas (Solo con Zenith)",
      "Pedidos (Solo con Zenith)",
      "Usuarios (Solo con Zenith)",
      "Post Pro",
      "Stela IA"
    ],
    excludes: ["Whatsapp Manager", "Finyx Sistema Contable", "Smart Marketing", "Kairos Scout"]
  },
  {
    title: "Ecommerce",
    price_Yearly: "10.99",
    price_Monthly: "17.99",
    button: "prueba gratuita/15 días",
    bg: "bg-indigo-900",
    img: img2,
    ribon: "Alta Demanda",
    addons: [
      "Manejo de Dominios",
      "Templates Store Ecommerce",
      "Web Editor",
      "Inventario (Servicios y Productos)",
      "Finanzas (Sitio Web o Zenith)",
      "Pedidos (Sitio Web o Zenith)",
      "Usuarios (Sitio Web o Zenith)",
      "Post Pro",
      "Stela IA",
      "Whatsapp Manager"
    ],
    excludes: ["Finyx Sistema Contable", "Smart Marketing", "Kairos Scout"]
  },
  {
    title: "Ultimate",
    price_Yearly: "17.99",
    price_Monthly: "28.99",
    button: "prueba gratuita/15 días",
    bg: "bg-white",
    img: img3,
    addons: [
      "Manejo de Dominios",
      "Templates Store Advanced",
      "Web Editor",
      "Inventario (Servicios y Productos)",
      "Finanzas (Sitio Web o Zenith)",
      "Pedidos (Sitio Web o Zenith)",
      "Usuarios (Sitio Web o Zenith)",
      "Post Pro",
      "Stela IA",
      "Whatsapp Manager",
      "Finyx Sistema Contable",
      "Smart Marketing",
      "Kairos Scout"
    ],
    excludes: []
  },
];



const PricingPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setCheckoutSignal } = useContext(AuthContext);
  const navigate = useNavigate();
  const [check, setCheck] = useState(true);
  const toggle = () => {
    setCheck(!check);
  };

  const triggerCheckout = async (title, price, check) => {
    setIsLoading(true);
    const res = await triggerNewcomerPlan(title, price, check)
    if (res.ok) {
      setIsLoading(false);
      setCheckoutSignal(true);
      navigate('/checkout');
    } else {
      // Display an error message to the user
      alert('Error triggering checkout. Please try again later.');
    }
  }
  
  return (
    <div className="container max-w-screen-lg mx-auto">
      <div className="z-10 relative mx-auto">
        <div className="text-center mb-10 flex justify-center pt-5">
          <img src="https://stelacdn.s3.amazonaws.com/static/img/stela/stela-light.png" alt="Logo" className="w-44" />
        </div>
        <div className="space-y-5 text-center">
          <h4 className="font-medium lg:text-1xl text-xl text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
            Bienvenido al Sistema StelaUX.
          </h4>
          <p>Por favor selecione la solución de su preferencia para continuar.</p>
          <div className="flex justify-between mb-6">
            <h1 className="text-slate-900 text-xl font-medium">Pricing Set</h1>
            <label className="inline-flex text-sm cursor-pointer">
              <input type="checkbox" onChange={toggle} hidden />
              <span
                className={` ${check
                  ? "bg-indigo-900 text-white"
                  : "text-slate-800"
                  } 
                px-[18px] py-1 transition duration-100 rounded`}
              >
                Anual
              </span>
              <span
                className={`
              ${!check
                    ? "bg-indigo-900 text-white"
                    : "text-slate-800"
                  }
                px-[18px] py-1 transition duration-100 rounded
                `}
              >
                Mensual
              </span>
            </label>
          </div>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
            {plans.map((item, i) => (
              <div
                className={`${item.bg} 
            
            mb-6 price-table rounded-[6px] shadow-deep dark:bg-slate-800 p-6 text-slate-900 dark:text-white relative overflow-hidden z-[1]
            `}
                key={i}
              >
                <div className="overlay absolute right-0 top-0 w-full h-full z-[-1]">
                  <img src={item.img} alt="" className="ml-auto block" />
                </div>
                {item.ribon && (
                  <div className="text-sm font-medium bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-300 py-2 text-center absolute ltr:-right-[43px] rtl:-left-[43px] top-6 px-10 transform ltr:rotate-[45deg] rtl:-rotate-45">
                    {item.ribon}
                  </div>
                )}
                <header className="mb-6">
                  <h4
                    className={` 
             ${item.bg === "bg-indigo-900"
                        ? "text-slate-100"
                        : "text-slate-900 dark:text-slate-300"
                      }
             text-xl mb-5 `}
                  >
                    {item.title}
                  </h4>
                  <div
                    className={`
             ${item.bg === "bg-indigo-900"
                        ? "text-slate-100"
                        : "text-slate-900 dark:text-slate-300"
                      }
                space-x-4 relative flex items-center mb-5 rtl:space-x-reverse`}
                  >
                    {check ? (
                      <span className="text-[32px] leading-10 font-medium">
                        ${item.price_Yearly}{" "}
                      </span>
                    ) : (
                      <span className="text-[32px] leading-10 font-medium">
                        ${item.price_Monthly}
                      </span>
                    )}
                    {check ? (
                      <span className="text-xs bg-warning-50 text-success-500 font-medium px-2 py-1 rounded-full inline-block dark:bg-slate-700 uppercase h-auto">
                        Ahorra 40%
                      </span>
                    ) : (
                      <span className="text-xs bg-warning-50 text-warning-500 font-medium px-2 py-1 rounded-full inline-block dark:bg-slate-700 uppercase h-auto">
                        Ahorra 0%
                      </span>
                    )}

                  </div>
                  <p
                    className={` text-sm
             ${item.bg === "bg-indigo-900"
                        ? "text-slate-100"
                        : "text-slate-500 dark:text-slate-300"
                      }
                `}
                  >
                    por usuario/mensual
                  </p>
                </header>
                <div className="price-body space-y-8">
                  <ul className={`pl-4 text-sm ${item.bg === "bg-indigo-900" ? "text-white" : "text-slate-600 dark:text-slate-300"} font-oxanium font-bold`}>
                    {item.addons.map((addon, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <FaCheckCircle className="text-green-500" />
                        <span>{addon}</span>
                      </li>
                    ))}
                    {item.excludes.map((exclude, index) => (
                      <li key={index}>
                        {item.ribon ? (
                          <span className="text-danger-400 flex items-center gap-2">
                            <MdOutlineClose className="text-danger-400" />
                            <span>{exclude}</span>
                          </span>
                        ) :
                        (
                          <span className="text-red-500 flex items-center gap-2">
                            <MdOutlineClose className="text-red-500" />
                            <span>{exclude}</span>
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div>
                    <Button
                      text={item.button}
                      isLoading={isLoading}
                      className={`w-full ${item.bg === "bg-indigo-900" ? "text-slate-100 border-slate-300 border" : "btn-outline-dark dark:border-slate-400"} `}
                      onClick={(event) => {
                        if (!isLoading) {
                          const subscriptionType = !check;
                          triggerCheckout(item.title, subscriptionType ? item.price_Monthly : item.price_Yearly, check);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;