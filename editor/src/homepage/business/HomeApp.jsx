import RootLayout from "../layouts/RootLayout";
import { ThemeProvider } from "../hooks/useTheme"
import { useEffect, useState } from "react";
import { homepageData } from '../data/homepageData';
import { Routes, Route } from "react-router-dom";
import Lottie from 'react-lottie';
import animationData from '../static/business/animations/loader.json';

//pages
import HomePage from "../pages/business/Home/Startup";

//css
import "../static/business/css/icons.css"
import "../static/business/css/global.css"
import "../static/business/css/pages.css"
import "../static/business/css/styles.css"
import "../../index.scss"

function HomeApp() {
  const [dataHome, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const homepageDataResult = await homepageData();
        setData(homepageDataResult);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center h-screen">
        <Lottie options={defaultOptions} height={200} width={200} />
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ThemeProvider>
      <RootLayout>
        <Routes>
          <Route path="/" element={<HomePage dataContent={dataHome} />} />
        </Routes>
      </RootLayout>
    </ThemeProvider>
  );
}

export default HomeApp;