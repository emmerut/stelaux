import React, { useState } from "react";
import { Link } from "react-router-dom";
import TokenForm from "./common/token-form";
import Social from "./common/social";
import useDarkmode from "@/hooks/useDarkMode";
import { ToastContainer } from "react-toastify";
import { ReactTyped } from "react-typed"; // Import ReactTyped
import { motion } from "framer-motion";

// image import
import LogoWhite from "@/assets/images/auth/logo.png";
import Logo from "@/assets/images/logo/logo.svg";
import bgImage from "@/assets/images/all-img/login-bg.png";
const register2 = () => {
  const [texts, setTexts] = useState([
    "Impulso.",
    "Potencial.",
    "Alcance.",
  ]);
  const currentYear = new Date().getFullYear();
  const [isDark] = useDarkmode();
  return (
    <div className="loginwrapper">
      <div className="lg-inner-column">
        <div className="right-column relative">
          <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
            <div className="auth-box h-full flex flex-col justify-center">
              <div className="mobile-logo text-center mb-6 lg:hidden block">
                <Link to="/">
                  <img
                    src={isDark ? LogoWhite : Logo}
                    alt=""
                    className="mx-auto"
                  />
                </Link>
              </div>
              <div className="text-center 2xl:mb-10 mb-5">
                <h2 className="text-2xl font-bold mb-2 text-center">Cuenta Creada</h2>
                <div className="text-slate-500 dark:text-slate-400 text-base">
                  Hemos enviado un codigo a tu correo electronico.
                </div>
              </div>
              <TokenForm />
            </div>
            <div className="auth-footer text-center">
              Copyright {currentYear}, Emmerut LLC All Rights Reserved.
            </div>
          </div>
        </div>
        <div
          className="left-column bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage: `url(${bgImage})`,
          }}
        >
          <div className="flex flex-col h-full justify-center">
            <div className="flex-1 flex flex-col justify-center items-center">
              <Link to="/">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut", delay: 0.8 }}
                >
                  <Link to="/">
                    <img
                      width={200}
                      src={LogoWhite}
                      alt=""
                      className="mb-10 shadow-png"
                    />
                  </Link>
                </motion.div>
              </Link>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut", delay: 1.2 }}
              className="black-500-title max-w-[525px] mx-auto pb-20 text-center"
            >
              Desbloquea tu máximo
              <br />
              <span className="text-white font-bold uppercase">
                <ReactTyped
                  strings={texts}
                  typeSpeed={80}
                  backSpeed={50}
                  backDelay={1000}
                  loop={false}
                  className="text-white font-bold uppercase" // Apply styling
                />
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default register2;
