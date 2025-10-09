export interface SidebarItem {
  url: string;
  title: string;
  icon: string;
}

export const sidebarItems: SidebarItem[] = [
  {
    url: "/facturas",
    title: "Facturas",
    icon: "FileText",
  },
  {
    url: "/generar_factura",
    title: "Generar Factura",
    icon: "PlusCircle",
  },
  {
    url: "/productos",
    title: "Productos",
    icon: "Package",
  },
  // {
  //   url: "/clientes",
  //   title: "Clientes",
  //   icon: "Users",
  // },
  {
    url: "/configuracion",
    title: "Configuración",
    icon: "Settings",
  },
];
