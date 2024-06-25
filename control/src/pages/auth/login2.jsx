import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoginForm from "./common/login-form";
import Social from "./common/social";
import { ToastContainer } from "react-toastify";
import useDarkMode from "@/hooks/useDarkMode";
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion
import { ReactTyped } from "react-typed"; // Import ReactTyped
// image import
import LogoWhite from "@/assets/images/auth/logo.png";
import Logo from "@/assets/images/logo/logo.svg";
import bgImage from "@/assets/images/auth/login.jpg";

const login2 = () => {
  const [isDark] = useDarkMode();
  const currentYear = new Date().getFullYear();
  const [texts, setTexts] = useState([
    "Soñadores.",
    "Creadores.",
    "Startups.",
  ]);

  const logoVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeInOut", delay: 0.5 } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeInOut", delay: 1 } },
  };

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
              <div className="text-center 2xl:mb-10 mb-4">
                <h4 className="font-medium">Ingresa en tu cuenta</h4>
                
              </div>
              <LoginForm />
              {/* <div className=" relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6">
                <div className=" absolute inline-block  bg-white dark:bg-slate-800 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm  text-slate-500  dark:text-slate-400font-normal ">
                  O continúa con
                </div>
              </div>
              <div className="max-w-[242px] mx-auto mt-8 w-full">
                <Social />
              </div> */}
              <div className="md:max-w-[345px] mt-6 mx-auto font-normal text-slate-500 dark:text-slate-400mt-12 uppercase text-sm">
                Aún no tienes cuenta?{" "}
                <Link
                  to="/auth/signup"
                  className="text-slate-900 dark:text-white font-medium hover:underline"
                >
                  Registrate
                </Link>
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
            backgroundBlendMode: "multiply", // Blend image with dark background
            backdropFilter: "blur(5px)", // Add blur effect
          }}
        >
          <div className="flex flex-col h-full justify-center">
            <div className="flex-1 flex flex-col items-center mt-16">
              <motion.div variants={logoVariants} initial="hidden" animate="visible">
                <Link to="/">
                  <img
                    width={250}
                    src={LogoWhite}
                    alt=""
                    className="mb-10 shadow-png"
                  />
                </Link>
              </motion.div>
            </div>
            <div>
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-2xl text-slate-100 max-w-[525px] mx-auto mb-20 text-center"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(4px)', /* Apply backdrop filter */
                  WebkitBackdropFilter: 'blur(4px)', /* Fallback for Safari */
                }}
              >
                La herramienta definitiva para&nbsp;
                <ReactTyped
                  strings={texts}
                  typeSpeed={80}
                  backSpeed={50}
                  backDelay={1000}
                  loop={false}
                  className="text-white font-bold uppercase" // Apply styling
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default login2;