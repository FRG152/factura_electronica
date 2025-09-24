import {
  Home,
  Users,
  LogOut,
  FileText,
  Settings,
  PlusCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarItem,
  SidebarGroup,
  SidebarFooter,
  SidebarHeader,
  SidebarContent,
} from "./ui/sidebar";
import { useAuth } from "../contexts/AuthContext";
import { sidebarItems } from "../constants/sidebar";
import { Link, useLocation } from "react-router-dom";

const iconMap = {
  Home,
  FileText,
  Users,
  Settings,
  PlusCircle,
};

export function SidebarComponent() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          <span className="font-semibold">Facturación</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-0">
        <SidebarGroup>
          {sidebarItems.map((item) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap];
            const isActive = location.pathname === item.url;

            return (
              <Link key={item.url} to={item.url}>
                <SidebarItem
                  active={isActive}
                  className="mb-2"
                  icon={<IconComponent size={50} />}
                >
                  {item.title}
                </SidebarItem>
              </Link>
            );
          })}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="sidebar_user">
          {user?.name || user?.email || "Usuario"}
        </div>
        <div>
          <SidebarItem
            onClick={logout}
            icon={<LogOut size={50} />}
            className="sidebar_btn_logout"
          >
            Cerrar Sesión
          </SidebarItem>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
