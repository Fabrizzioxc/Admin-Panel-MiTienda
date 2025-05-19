"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { ClienteTable } from "@/components/clientes/ClienteTable";
import { useClientes } from "@/hooks/useClientes";

export default function ClientesPage() {
  const { clientes, loading } = useClientes();

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-64">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar clientes..." className="pl-8" />
            </div>
            <div className="text-sm text-muted-foreground">
              Mostrando {clientes.length} clientes
            </div>
          </div>

          <ClienteTable clientes={clientes} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
