import React, { useState } from "react";
import { Link } from "react-router-dom";
import ForgotPass from "../../components/form/Auth/forgot-pass";
import useDarkMode from "@/hooks/useDarkMode";
import { ReactTyped } from "react-typed"; // Import ReactTyped
import { motion } from "framer-motion";
import LogoWhite from "@/assets/images/auth/logo.png";
import Logo from "@/assets/images/logo/logo.svg";
import bgImage from "@/assets/images/all-img/login-bg.png";
const ForgotPass2 = () => {
  const currentYear = new Date().getFullYear();
  const [texts, setTexts] = useState([
    "Impulso.",
    "Potencial.",
    "Alcance.",
  ]);
  const [isDark] = useDarkMode();
  return (
    <div className="loginwrapper">
      <div className="lg-inner-column">
        <div className="right-column relative">
          <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
            <div className="auth-box2 flex flex-col justify-center h-full">
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
                <h4 className="font-medium mb-4">¿No puedes acceder a tu cuenta?</h4>
                <div className="text-slate-500 dark:text-slate-400 text-base">
                ¡Recuperala rapidamente en pocos minutos!
                </div>
              </div>
              <ForgotPass />
              <div className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 2xl:mt-12 mt-8 uppercase text-sm">
                <Link
                  to="/auth/login"
                  className="text-slate-900 dark:text-white font-medium hover:underline"
                >
                  Quiero regresar&nbsp;
                </Link>
                A la página de inicio de sesión
              </div>
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

export default ForgotPass2;
