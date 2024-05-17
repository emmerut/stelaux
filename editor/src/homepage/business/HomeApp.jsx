import RootLayout from "../layouts/RootLayout";
import { ThemeProvider } from "../hooks/useTheme"
import { Routes, Route, Navigate } from "react-router-dom";

//pages
import HomePage from "../pages/business/HomePage";

//css
import "../static/business/css/icons.css"
import "../static/business/css/global.css"
import "../static/business/css/pages.css"
import "../static/business/css/styles.css"
import "../../index.scss"

function HomeApp() {
  return (
    <ThemeProvider>
      <RootLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </RootLayout>
    </ThemeProvider>
  );
}

export default HomeApp;
