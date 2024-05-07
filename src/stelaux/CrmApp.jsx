import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "../stelaux/layouts/RootLayout";
import { ThemeProvider } from "../stelaux/hooks/useTheme";
import { HomePage } from "../stelaux/pages/HomePage";
import { BillingPage } from "../stelaux/pages/BillingPage";
import { ContentPage } from "../stelaux/pages/ContentPage";
import { FinyxPage } from "../stelaux/pages/FinyxPage";
import { InventoryPage } from "../stelaux/pages/InventoryPage";
import { PulsePage } from "../stelaux/pages/MessageCenterPage";
import { PaymentsPage } from "../stelaux/pages/PaymentsPage";
import { PostProPage } from "../stelaux/pages/PostProPage";
import { ExpertPage } from "../stelaux/pages/StelaExpertPage";
import { StelaScoutPage } from "../stelaux/pages/StelaScoutPage";
import { BigDataPage } from "../stelaux/pages/BigDataPage";
import { SettingsPage } from "../stelaux/pages/SettingsPage";
import { UsersPage } from "../stelaux/pages/UsersPage";
import { GoogleAnalythicsPage } from "../stelaux/pages/GoogleAnalythicsPage";

const CrmLayout = () => {
  return (
    <ThemeProvider>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/console" />} />
          <Route path="/console" element={<HomePage />} />
          <Route path="/pulse" element={<PulsePage />} />
          <Route path="/creator" element={<ContentPage />} />
          <Route path="/expert" element={<ExpertPage />} />
          <Route path="/post-pro" element={<PostProPage />} />
          <Route path="/big-data-lab" element={<BigDataPage />} />
          <Route path="/google-analythics" element={<GoogleAnalythicsPage />} />
          <Route path="/scout" element={<StelaScoutPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/finyx" element={<FinyxPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </RootLayout>
    </ThemeProvider>
  );
};

export default CrmLayout;
