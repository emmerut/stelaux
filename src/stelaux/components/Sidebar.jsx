import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SubMenu from "../components/SubMenu";
import { ThemeSwap } from "../components/ThemeSwap";

//oher packages
import { AiFillHome } from "react-icons/ai";
import { AiFillSetting } from "react-icons/ai";
import { AiFillBank } from "react-icons/ai";
import { BsMagic } from "react-icons/bs";
import { BsFillBarChartFill } from "react-icons/bs";
import { BsFillPeopleFill } from "react-icons/bs";
import { AiFillTags } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import { GoPulse } from "react-icons/go";
import { useMediaQuery } from "react-responsive";
import { MdMenu } from "react-icons/md";
import { useTheme } from "../hooks/useTheme";

const Sidebar = () => {
  let isTab = useMediaQuery({ query: "(max-width: 768px)" });
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(isTab ? false : true);
  const { isLightMode, toggleTheme } = useTheme();
  const Sidebar_animation = isTab
    ? {
        open: {
          x: 0,
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          x: -250,
          width: 0,
          transition: {
            damping: 40,
            delay: 0.15,
          },
        },
      }
    : {
        open: {
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          width: "4rem",
          transition: {
            damping: 40,
          },
        },
      };

  useEffect(() => {
    if (isTab) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isTab]);

  useEffect(() => {
    isTab && setIsOpen(false);
  }, [pathname]);

  const logoSrc = isLightMode
    ? "https://stelacdn.s3.amazonaws.com/static/img/stela/stela-light.png"
    : "https://stelacdn.s3.amazonaws.com/static/img/stela/stela-dark.png";
  const logoAlt = isLightMode
    ? "Stela Control Dynamic - Light Theme"
    : "Stela Control Dynamic - Dark Theme";

  const subMenusList = [
    {
      name: "content",
      icon: BsMagic,
      menus: ["post pro", "creator", "expert"],
    },
    {
      name: "marketing",
      icon: BsFillBarChartFill,
      menus: ["scout", "big data lab", "google analythics"],
    },
    {
      name: "fintech",
      icon: AiFillBank,
      menus: ["billing", "payments", "finyx"],
    },
    
  ];
  const handleChange = () => {
    toggleTheme();
  };
  return (
    <>
      <div
        onClick={() => setIsOpen(false)}
        className={`md:hidden fixed inset-0 max-h-screen z-[998] bg-black/50 ${
          isOpen ? "block" : "hidden"
        } `}
      ></div>
      <motion.div
        variants={Sidebar_animation}
        initial={{ x: isTab ? -250 : 0 }}
        animate={isOpen ? "open" : "closed"}
        className="text-slate-500 shadow-xl z-[999] w-[16rem] max-w-[16rem] h-screen overflow-hidden md:relative fixed"
        data-theme="light"
        id="sidebar"
      >
        <div className="flex items-center justify-center gap-2.5 font-medium border-b border-slate-300 py-3 mx-3">
          <img src={logoSrc} alt={logoAlt} width={150} />
        </div>
        <div className="flex flex-col h-3/4">
          <ul className="whitespace-pre px-2.5 text-[0.9rem] py-5 flex flex-col gap-1 font-medium overflow-x-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-100">
            <li>
              <NavLink to="/console" className={"link"}>
                <AiFillHome size={23} className="min-w-max" />
                Inicio
              </NavLink>
            </li>
            <li>
              <NavLink to="/pulse" className={"link"}>
                <GoPulse size={23} className="min-w-max" />
                Pulse
              </NavLink>
            </li>
            {(isOpen || isTab) && (
              <div className="border-y py-5 border-slate-300">
                <small className="pl-3 text-slate-500 inline-block mb-2">
                  Potenciadores Stela
                </small>
                {subMenusList?.map((menu) => (
                  <div key={menu.name} className="flex flex-col gap-1">
                    <SubMenu data={menu} />
                  </div>
                ))}
              </div>
            )}
            <li>
              <NavLink to="/inventory" className={"link"}>
                <AiFillTags size={23} className="min-w-max" />
                Inventario
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings" className={"link"}>
                <AiFillSetting size={23} className="min-w-max" />
                Configuración
              </NavLink>
            </li>
            <li>
              <NavLink to="/users" className={"link"}>
                <BsFillPeopleFill size={23} className="min-w-max" />
                Usuarios
              </NavLink>
            </li>
          </ul>
          {isOpen && (
            <div className="flex-1 text-sm z-50 max-h-48 my-auto whitespace-pre w-full font-medium">
              <div className="flex items-center justify-between border-y border-slate-300 p-4 ">
                <div>
                  <p>Basico</p>
                  <small>$7/mes</small>
                </div>
                <p className="text-teal-500 py-1.5 px-3 text-xs bg-teal-50 rounded-xl">
                  Potenciar
                </p>
              </div>
              <div className="flex items-center justify-between border-slate-300 p-4">
                <div>
                  <ThemeSwap />
                </div>
                <p
                  className="text-slate-50 py-1.5 px-3 text-xs bg-indigo-600 rounded-xl cursor-pointer"
                  onClick={handleChange}
                >
                  Cambiar Tema
                </p>
              </div>
            </div>
          )}
        </div>
        <motion.div
          animate={
            isOpen
              ? {
                  x: 0,
                  y: 0,
                  rotate: 0,
                }
              : {
                  x: -10,
                  y: -10,
                  rotate: 180,
                }
          }
          transition={{
            duration: 0,
          }}
          onClick={() => setIsOpen(!isOpen)}
          className="absolute w-fit h-fit z-50 right-2 bottom-5 cursor-pointer md:block hidden"
        >
          <IoIosArrowBack size={25} />
        </motion.div>
      </motion.div>
      <div className="m-3 md:hidden" onClick={() => setIsOpen(true)}>
        <MdMenu size={25} />
      </div>
    </>
  );
};

export default Sidebar;
