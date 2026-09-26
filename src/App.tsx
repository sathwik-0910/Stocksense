import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { InventoryProvider, useInventory } from "./context/InventoryContext";

import { Sidebar } from "./components/navigation/Sidebar";
import { TopNavbar } from "./components/navigation/TopNavbar";
import { CommandPalette } from "./components/command/CommandPalette";

import { Login } from "./pages/Auth/Login";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { ProductsPage } from "./pages/Products/ProductsPage";
import { OperationsPage } from "./pages/Operations/OperationsPage";
import { MovesPage } from "./pages/Moves/MovesPage";
import { WarehousesPage } from "./pages/Warehouses/WarehousesPage";
import { SettingsPage } from "./pages/Settings/SettingsPage";

const AuthenticatedLayout: React.FC = () => {
  const { isAuthenticated } = useInventory();
  const location = useLocation();

  if (!isAuthenticated && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-bg-base flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Top Navigation */}
        <TopNavbar />

        {/* Dashboard Background Gradient Mesh */}
        <div className="absolute top-0 left-0 w-full h-[500px] pointer-events-none z-0">
          <div className="absolute top-0 right-1/4 h-80 w-80 rounded-full bg-blue-600/[0.04] blur-[120px]" />
          <div className="absolute top-40 left-1/3 h-60 w-60 rounded-full bg-emerald-600/[0.04] blur-[100px]" />
          <div className="absolute top-20 right-1/2 h-40 w-40 rounded-full bg-purple-600/[0.03] blur-[80px]" />
        </div>

        {/* Page Content */}
        <main className="flex-1 relative z-10 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <InventoryProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />

          {/* Authenticated Routes with Layout */}
          <Route element={<AuthenticatedLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/operations" element={<OperationsPage />} />
            <Route path="/moves" element={<MovesPage />} />
            <Route path="/warehouses" element={<WarehousesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Default fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </InventoryProvider>
    </BrowserRouter>
  );
};

export default App;
