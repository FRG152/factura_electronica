export function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        Panel principal de facturación electrónica
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Facturas</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Gestiona tus facturas electrónicas
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Clientes</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Administra tu base de clientes
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Reportes</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Visualiza estadísticas y reportes
          </p>
        </div>
      </div>
    </div>
  );
}
