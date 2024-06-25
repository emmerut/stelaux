import React, { lazy, useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

//auth section
import AuthLayout from "./layout/AuthLayout";
const Login = lazy(() => import("./pages/auth/login2"));
const Register = lazy(() => import("./pages/auth/register2"));
const ForgotPass = lazy(() => import("./pages/auth/forgot-password2"));
const TokenPassSMS = lazy(() => import("./pages/auth/token-sms"));
const TokenPassEmail = lazy(() => import("./pages/auth/token-email"));

//layout

//404 page
const Error = lazy(() => import("./pages/404"));

// home pages  & dashboard
//import Dashboard from "./pages/dashboard";
const Ecommerce = lazy(() => import("./pages/dashboard/ecommerce"));
const InventoryPage = lazy(() => import("./pages/dashboard/inventory"));
const BankingPage = lazy(() => import("./pages/dashboard/banking"));
const OrdersPage = lazy(() => import("./pages/dashboard/orders"));
const UsersPage = lazy(() => import("./pages/dashboard/users"));


import Layout from "./layout/Layout";

const sectionTitles = {
  home: "home",
  services: "control de servicios",
  products: "control de productos",
  billing: "sistema de finanzas",
  orders: "ordenes",
  users: "central de usuarios",
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Simulación de verificación de autenticación (reemplaza con tu lógica real)
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    const authRoutes = ['/auth/login', '/auth/signup', '/auth/reset-password', '/auth/confirm-email', '/auth/confirm-phone'];
    const protectedRoutes = ['/console', '/products', '/services', '/finance', '/orders', '/users'];

    if (isAuthenticated) {
      // Redirecciona a la ruta protegida solicitada si está autenticado y no está en una ruta prohibida
      if (!protectedRoutes.includes(location.pathname)) {
        navigate('/console');
      }
    } else {
      // Redirecciona a /auth/login si no está autenticado y no está tratando de acceder a una ruta de autenticación
      if (protectedRoutes.includes(location.pathname) || !authRoutes.includes(location.pathname)) {
        navigate('/auth/login');
      }
    }
  }, [isAuthenticated, navigate, location.pathname]);

  return (
    <main className="App  relative">
      <Routes>
        <Route path="/auth" element={<AuthLayout setIsAuthenticated={setIsAuthenticated} />}>
          <Route path="login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="signup" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="confirm-email" element={<TokenPassEmail setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="confirm-phone" element={<TokenPassSMS setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="reset-password" element={<ForgotPass setIsAuthenticated={setIsAuthenticated} />} />
        </Route>
        <Route path="/*" element={<Layout />}>
          <Route path="console" element={<Ecommerce />} />
          <Route path="products" element={<InventoryPage mainTitle={sectionTitles.products} buttonSet={'productButtons'} tableType={'products'} />} />
          <Route path="services" element={<InventoryPage mainTitle={sectionTitles.services} buttonSet={'serviceButtons'} tableType={'services'} />} />
          <Route path="finance" element={<BankingPage mainTitle={sectionTitles.billing} buttonSet={'billingButton'} />} />
          <Route path="orders" element={<OrdersPage mainTitle={sectionTitles.orders} />} />
          <Route path="users" element={<UsersPage mainTitle={sectionTitles.users} />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
