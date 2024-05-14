import React, { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import useDarkMode from "@/hooks/useDarkMode";
import useSidebar from "@/hooks/useSidebar";
import useSemiDark from "@/hooks/useSemiDark";
import useSkin from "@/hooks/useSkin";

const SidebarLogo = ({ menuHover }) => {
  const [isDark] = useDarkMode();
  const [collapsed, setMenuCollapsed] = useSidebar();
  const [isSemiDark] = useSemiDark();
  const [skin] = useSkin();
  const [isLogoCollapsed, setIsLogoCollapsed] = useState(false);

  return (
    <div
      className={` logo-segment flex justify-evenly items-center bg-white dark:bg-slate-800 z-[9] py-6  px-4 
      ${menuHover ? "logo-hovered" : ""}
      ${skin === "bordered"
          ? " border-b border-r-0 border-slate-200 dark:border-slate-700"
          : " border-none"
        }
      ${collapsed ? "collapsed" : ""}
      `}
      style={{ width: "100%" }}
    >
      <Link to="/console">
        <div className="flex items-center space-x-4">
          <div className="logo-icon">
            {!isDark && !isSemiDark ? (
              <img src="https://stelacdn.s3.amazonaws.com/static/img/stela/stela-light.png" width="150" alt="" />
            ) : (
              <img src="https://stelacdn.s3.amazonaws.com/static/img/stela/stela-dark.png" width="150" alt="" />
            )}
          </div>

          {(!collapsed || menuHover) && (
            <div>

            </div>
          )}
        </div>
      </Link>

      {(!collapsed || menuHover) && (
        <div
          onClick={() => {
            setMenuCollapsed(!collapsed);
            setIsLogoCollapsed(!isLogoCollapsed);
          }}
          className={`h-6 w-6 transition-all duration-150 flex items-center justify-center
          ${collapsed
              ? ''
              : ''
            }
        `}
        >
          {collapsed
           ? <Icon icon="line-md:arrow-close-right" width="20" height="20" /> 
           : <Icon icon="line-md:arrow-close-left" width="20" height="20" /> 
          }
        </div>
      )}
    </div>
  );
};

export default SidebarLogo;
