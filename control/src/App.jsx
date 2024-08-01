import React, { lazy, useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { getCookie } from "@/constant/sessions"
import { getUserData } from '@/constant/apiData'

//auth section
import AuthLayout from "./layout/AuthLayout";
const Login = lazy(() => import("./pages/auth/login2"));
const Register = lazy(() => import("./pages/auth/register2"));
const ForgotPass = lazy(() => import("./pages/auth/forgot-password2"));
const Verify = lazy(() => import("./pages/auth/verifyToken"));
const NewPassword = lazy(() => import("./pages/auth/new-password"));

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
const Profile = lazy(() => import("./pages/utility/profile"));
const PaymentsPage = lazy(() => import("./pages/utility/payments"));
const Plans = lazy(() => import("./pages/dashboard/plans"));
const Checkout = lazy(() => import("./pages/dashboard/checkout"));

import Layout from "./layout/Layout";

const sectionTitles = {
  home: "home",
  services: "control de servicios",
  products: "control de productos",
  billing: "sistema de finanzas",
  orders: "ordenes",
  users: "central de usuarios",
  payments: "configuración de pagos",
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isRegistered, setIsRegistered] = useState(() => {
    return JSON.parse(localStorage.getItem("isRegistered")) || false;
  });
  const [isRecovery, setIsRecovery] = useState(false); 

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = getCookie('user_token');
    return token ? true : false;
  });
  
  const [userData, setUserData] = useState(null);
  const [isPaymentSignal, setIsPaymentSignal] = useState(false)
  const [isActivePlan, setIsActivePlan] = useState(false);

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchData = async () => { 
      if (!isAuthenticated) {
        return;
      } else{
        try {
          const res = await getUserData(); 
          setUserData(res); // Update user data state
        } catch (error) {
          
        }
      }
    };
    fetchData(); // Call the async function
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("isRegistered", JSON.stringify(isRegistered));
  }, [isRegistered]);

  useEffect(() => {
    const token = getCookie('user_token');
    if (!token) {
      setIsAuthenticated(false);
    }
  }, [isAuthenticated]);

  const resetRegistration = () => {
    setIsRegistered(false);
  };

  // Función para restablecer isAuthenticated a false
  const resetAuthentication = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      isRecovery,
      setIsRecovery,
      resetRegistration,
      resetAuthentication,
      isRegistered,
      setIsRegistered,
      isAuthenticated,
      setIsAuthenticated,
      userData,
      isActivePlan,
      setIsActivePlan,
      setUserData,
      isPaymentSignal,
      setIsPaymentSignal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const ProtectedVerifyRoute = ({ children }) => {
  const { isRegistered } = useContext(AuthContext);

  if (!isRegistered) {
    return <Navigate to="/auth/signup" replace />;
  }

  return children;
};

const ProtectedRecoveryRoute = ({ children }) => {
  const { isRecovery } = useContext(AuthContext);

  if (!isRecovery) {
    return <Navigate to="/auth/reset-password" replace />;
  }

  return children;
};

function App() {

  return (
    <main className="App  relative">
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Register />} />
            <Route path="verify" element={
              <ProtectedVerifyRoute>
                <Verify />
              </ProtectedVerifyRoute>
            } />
            <Route path="reset-verify" element={
              <ProtectedRecoveryRoute>
                <Verify />
              </ProtectedRecoveryRoute>
            } />
            <Route path="reset-password" element={<ForgotPass />} />
            <Route path="reset-confirm" element={
              <ProtectedRecoveryRoute>
                <NewPassword />
              </ProtectedRecoveryRoute>
            } />
          </Route>

          <Route path="/*" element={<Layout />}>
            <Route path="console" element={<Ecommerce />} />
            <Route path="products" element={<InventoryPage mainTitle={sectionTitles.products} buttonSet={'productButtons'} tableType={'products'} />} />
            <Route path="services" element={<InventoryPage mainTitle={sectionTitles.services} buttonSet={'serviceButtons'} tableType={'services'} />} />
            <Route path="finance" element={<BankingPage mainTitle={sectionTitles.billing} buttonSet={'billingButton'} />} />
            <Route path="orders" element={<OrdersPage mainTitle={sectionTitles.orders} />} />
            <Route path="users" element={<UsersPage mainTitle={sectionTitles.users} />} />
            <Route path="profile" element={<Profile />} />
            <Route path="payments" element={<PaymentsPage mainTitle={sectionTitles.payments} buttonSet={'paymentsButton'} />} />
          </Route>
          
          <Route path="plans" element={<Plans />} />
          <Route path="checkout" element={<Checkout />} />
        </Routes>
      </AuthProvider>
    </main>
  );
}

export default App;