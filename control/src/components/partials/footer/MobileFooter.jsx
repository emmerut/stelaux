import React from "react";
import { NavLink } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import { SkeletionAvatar } from "@/components/skeleton/Skeleton";
import FooterAvatar from "@/assets/images/avatar/default_user.jpg";
const MobileFooter = ({ userData }) => {
  return (
    <div className="bg-white bg-no-repeat custom-dropshadow footer-bg dark:bg-slate-700 flex justify-around items-center backdrop-filter backdrop-blur-[40px] fixed left-0 w-full z-[9999] bottom-0 py-[12px] px-4">
      <NavLink to="chat">
        {({ isActive }) => (
          userData == null ? (
            <SkeletionAvatar />
          ) : (
            <div>
              <span
                className={`relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1 
          ${isActive ? "text-primary-500" : "dark:text-white text-slate-900"}
          `}
              >
                <Icon icon="heroicons-outline:mail" />
                <span
                  className="absolute right-[5px] lg:top-0 -top-2 h-4 w-4 bg-red-500 text-[8px] font-semibold flex flex-col items-center justify-center rounded-full text-white z-[99]"
                >
                  {userData?.messages_count} {/* Display the counter value here */}
                </span>
              </span>
              <span
                className={`block text-[11px]
          ${isActive ? "text-primary-500" : "text-slate-600 dark:text-slate-300"}
          `}
              >
                Messages
              </span>
            </div>
          )
        )}
      </NavLink>
      <NavLink
        to="profile"
        className="relative bg-white bg-no-repeat backdrop-filter backdrop-blur-[40px] rounded-full footer-bg dark:bg-slate-700 h-[65px] w-[65px] z-[-1] -mt-[40px] flex justify-center items-center"
      >
        {({ isActive }) => (
          <div className={` w-full h-full rounded-full
            ${isActive
                    ? "border-2 border-primary-500"
                    : "border-2 border-slate-100"
                  }
                `}>
            {userData ? <img
            src={userData?.avatar ? userData?.avatar : FooterAvatar}
            alt=""
            className="block w-full h-full object-cover rounded-full"
          /> : <SkeletionAvatar width="h-[65px] w-[65px]"/>}
          </div>
        )}
      </NavLink>
      <NavLink to="notifications">
        {({ isActive }) => (
          userData == null ? (
            <SkeletionAvatar />
          ) : (
            <div>
              <span
                className={`relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1 
          ${isActive ? "text-primary-500" : "dark:text-white text-slate-900"}
          `}
              >
                <Icon icon="heroicons-outline:mail" />
                <span
                  className="absolute right-[5px] lg:top-0 -top-2 h-4 w-4 bg-red-500 text-[8px] font-semibold flex flex-col items-center justify-center rounded-full text-white z-[99]"
                >
                  {userData?.notifications_count} {/* Display the counter value here */}
                </span>
              </span>
              <span
                className={`block text-[11px]
          ${isActive ? "text-primary-500" : "text-slate-600 dark:text-slate-300"}
          `}
              >
                Notifications
              </span>
            </div>
          )
        )}
      </NavLink>
    </div>
  );
};

export default MobileFooter;
