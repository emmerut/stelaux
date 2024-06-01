import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";

// home pages  & dashboard
//import Dashboard from "./pages/dashboard";
const Ecommerce = lazy(() => import("./pages/dashboard/ecommerce"));
const InventoryPage = lazy(() => import("./pages/dashboard/Inventory"));

import Layout from "./layout/Layout";

const sectionTitles = {
  home: "home",
  services: "control de servicios",
  products: "control de productos",
  billing: "billing",
  orders: "orders",
  users: "users",
};

function App() {
  return (
    <main className="App  relative">
      <Routes>
        <Route path="/*" element={<Layout />}>
          <Route path="console" element={<Ecommerce />} />
          <Route path="products" element={<InventoryPage mainTitle={sectionTitles.products} buttonSet={'productButtons'} tableType={'products'} />} />
          <Route path="services" element={<InventoryPage mainTitle={sectionTitles.services} buttonSet={'serviceButtons'} tableType={'services'} />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
