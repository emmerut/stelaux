import React, { useContext } from 'react';
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Menu, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteCookie } from "@/constant/sessions"
import { SkeletionTitle, SkeletionAvatar } from "@/components/skeleton/Skeleton";
import UserAvatar from "@/assets/images/avatar/default_user.jpg";

const profileLabel = ({ name, avatar }) => {
  return (
    <div className="flex items-center">
      <div className="flex-1 ltr:mr-[10px] rtl:ml-[10px]">
        <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
          {name ? <img
            src={avatar ? avatar : UserAvatar}
            alt=""
            className="block w-full h-full object-cover rounded-full"
          /> : <SkeletionAvatar width="w-8 h-8"/>}
        </div>
      </div>
      <div className="flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="overflow-hidden text-ellipsis whitespace-nowrap w-[85px] block">
          {name ? name : <SkeletionTitle />}
        </span>
        <span className="text-base inline-block ltr:ml-[10px] rtl:mr-[10px]">
          <Icon icon="heroicons-outline:chevron-down"></Icon>
        </span>
      </div>
    </div>
  );
};

const Profile = ({ userData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    deleteCookie("user_token");
    navigate("/auth/login");
  };

  const ProfileMenu = [
    {
      label: "Perfíl",
      icon: "heroicons-outline:user",

      action: () => {
        navigate("/profile");
      },
    },
    {
      label: "Seguridad",
      icon: "clarity:lock-line",
      action: () => {
        navigate("/settings");
      },
    },
    {
      label: "Salir",
      icon: "heroicons-outline:login",
      action: () => {
        dispatch(handleLogout);
      },
    },
  ];

  return (
    <Dropdown label={profileLabel({ name: userData?.full_name || null })} classMenuItems="w-[180px] top-[58px]">
      {ProfileMenu.map((item, index) => (
        <Menu.Item key={index}>
          {({ active }) => (
            <div
              onClick={() => item.action()}
              className={`${active
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50"
                  : "text-slate-600 dark:text-slate-300"
                } block     ${item.hasDivider
                  ? "border-t border-slate-100 dark:border-slate-700"
                  : ""
                }`}
            >
              <div className={`block cursor-pointer px-4 py-2`}>
                <div className="flex items-center">
                  <span className="block text-xl ltr:mr-3 rtl:ml-3">
                    <Icon icon={item.icon} />
                  </span>
                  <span className="block text-sm">{item.label}</span>
                </div>
              </div>
            </div>
          )}
        </Menu.Item>
      ))}
    </Dropdown>
  );
};

export default Profile;
