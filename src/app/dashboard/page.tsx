import { AppSidebar } from "../../components/app-sidebar"
import { SiteHeader } from "../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader/>
        <div className="flex flex-1 flex-col p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Productos</CardTitle>
                <CardDescription>Gestión de productos</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between">
                <p>Administra tu catálogo de productos</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/dashboard/productos">
                    <ArrowRightIcon className="mr-2 h-4 w-4" />
                    Ver
                  </a>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Categorías</CardTitle>
                <CardDescription>Gestión de categorías</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between">
                <p>Organiza tus productos por categorías</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/dashboard/categorias">
                    <ArrowRightIcon className="mr-2 h-4 w-4" />
                    Ver
                  </a>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Precios</CardTitle>
                <CardDescription>Actualización de precios</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between">
                <p>Actualiza precios de forma masiva</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/dashboard/precios">
                    <ArrowRightIcon className="mr-2 h-4 w-4" />
                    Ver
                  </a>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Clientes</CardTitle>
                <CardDescription>Usuarios registrados</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between">
                <p>Visualiza los usuarios de la app</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/dashboard/clientes">
                    <ArrowRightIcon className="mr-2 h-4 w-4" />
                    Ver
                  </a>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Stocks</CardTitle>
                <CardDescription>Control de inventario</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between">
                <p>Gestiona el stock de tus productos</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/dashboard/stocks">
                    <ArrowRightIcon className="mr-2 h-4 w-4" />
                    Ver
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
