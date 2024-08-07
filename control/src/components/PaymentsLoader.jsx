import React from "react";
import useDarkMode from "@/hooks/useDarkMode";
import LogoWhite from "@/assets/images/logo/stela_dark.png";
import Logo from "@/assets/images/logo/stela_white.png";
import { useSelector } from "react-redux";
import Lottie from "react-lottie";
import loadCardAnimation from "@/assets/animations/loadCard.json";
import loadConnectAnimation from "@/assets/animations/loadCardConnect.json";
import loadSuccessAnimation from "@/assets/animations/loadCardSuccess.json";
import loadFailedAnimation from "@/assets/animations/loadCardFailed.json";


const Loading = ({loadCall}) => {
    const animations = {
        'card': loadCardAnimation,
        'connect': loadConnectAnimation,
        'success': loadSuccessAnimation,
        'failed': loadFailedAnimation,
    };

    const animationData = animations[loadCall] || loadCardAnimation; // Default to loadCardAnimation if loadCall is invalid

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };
    const [isDark] = useDarkMode();
    const { isAuth } = useSelector((state) => state.auth);

    return (
        <div className="flex items-center justify-center h-full w-full dark:bg-gray-800">
            <div className="flex flex-col items-center justify-center space-y-4">
                <Lottie options={defaultOptions} height={250} width={250} />
                {isAuth && (
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                        {" "}
                        Cargando...
                    </span>
                )}
            </div>
        </div>
    );
};

export default Loading;
