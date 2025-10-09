import {
  Route,
  Routes,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import { useEffect } from "react";
import { Login } from "./pages/Login";
import { Facturas } from "./pages/Invoice";
import { Clientes } from "./pages/Clients";
import { Dashboard } from "./pages/Dashboard";
import { Configuracion } from "./pages/Configuration";
import { SidebarComponent } from "./components/Sidebar";
import { GenerarFactura } from "./pages/GenerateInvoice";
import { Productos } from "./pages/Productos";
import { CrearProducto } from "./pages/CrearProducto";
import { EditarProducto } from "./pages/EditarProducto";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { checkAuth } from "./store/slices/authSlice";

function AppContent() {
  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="container_loading">
        <div className="content_loading"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <SidebarComponent />
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/generar_factura" element={<GenerarFactura />} />
            <Route path="/facturas" element={<Facturas />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/productos/crear" element={<CrearProducto />} />
            <Route path="/productos/editar/:id" element={<EditarProducto />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
