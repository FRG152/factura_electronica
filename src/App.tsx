import {
  Route,
  Routes,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import { Login } from "./pages/Login";
import { Facturas } from "./pages/Invoice";
import { Clientes } from "./pages/Clients";
import { Dashboard } from "./pages/Dashboard";
import { Configuracion } from "./pages/Configuration";
import { SidebarComponent } from "./components/Sidebar";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { GenerarFactura } from "./pages/GenerateInvoice";

function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container_loading">
        <div className="content_loading"></div>
      </div>
    );
  }

  if (false) {
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
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
