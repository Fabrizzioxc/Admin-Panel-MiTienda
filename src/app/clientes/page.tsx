"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { SearchIcon, MoreVerticalIcon, MailIcon, PhoneIcon, UserIcon, ArrowUpDownIcon } from "lucide-react"

// Datos de ejemplo
const clientesData = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan.perez@example.com",
    celular: "+1234567890",
    estado: "Activo",
    fecha_registro: "2023-01-15",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    nombre: "María García",
    email: "maria.garcia@example.com",
    celular: "+1234567891",
    estado: "Activo",
    fecha_registro: "2023-02-20",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    nombre: "Carlos Rodríguez",
    email: "carlos.rodriguez@example.com",
    celular: "+1234567892",
    estado: "Inactivo",
    fecha_registro: "2023-03-10",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    nombre: "Ana Martínez",
    email: "ana.martinez@example.com",
    celular: "+1234567893",
    estado: "Activo",
    fecha_registro: "2023-04-05",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    nombre: "Luis Sánchez",
    email: "luis.sanchez@example.com",
    celular: "+1234567894",
    estado: "Inactivo",
    fecha_registro: "2023-05-12",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    nombre: "Laura Fernández",
    email: "laura.fernandez@example.com",
    celular: "+1234567895",
    estado: "Activo",
    fecha_registro: "2023-06-18",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 7,
    nombre: "Pedro Gómez",
    email: "pedro.gomez@example.com",
    celular: "+1234567896",
    estado: "Activo",
    fecha_registro: "2023-07-22",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 8,
    nombre: "Sofía López",
    email: "sofia.lopez@example.com",
    celular: "+1234567897",
    estado: "Inactivo",
    fecha_registro: "2023-08-30",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

type SortField = "nombre" | "email" | "fecha_registro" | "estado"
type SortDirection = "asc" | "desc"

export default function ClientesPage() {
  const [clientes] = useState(clientesData)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>("nombre")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  // Filtrar clientes por término de búsqueda
  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.celular.includes(searchTerm),
  )

  // Ordenar clientes
  const sortedClientes = [...filteredClientes].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  // Cambiar ordenamiento
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader/>
        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-64">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Mostrando {sortedClientes.length} de {clientes.length} clientes
            </div>
          </div>

          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 p-0 hover:bg-transparent"
                      onClick={() => handleSort("nombre")}
                    >
                      <span>Nombre</span>
                      <ArrowUpDownIcon className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 p-0 hover:bg-transparent"
                      onClick={() => handleSort("email")}
                    >
                      <span>Email</span>
                      <ArrowUpDownIcon className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Celular</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 p-0 hover:bg-transparent"
                      onClick={() => handleSort("fecha_registro")}
                    >
                      <span>Fecha de Registro</span>
                      <ArrowUpDownIcon className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 p-0 hover:bg-transparent"
                      onClick={() => handleSort("estado")}
                    >
                      <span>Estado</span>
                      <ArrowUpDownIcon className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedClientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell>
                      <Avatar className="h-10 w-10 rounded-full">
                        <img src={cliente.avatar || "/placeholder.svg"} alt={cliente.nombre} />
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{cliente.nombre}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell>{cliente.celular}</TableCell>
                    <TableCell>{formatDate(cliente.fecha_registro)}</TableCell>
                    <TableCell>
                      <Badge variant={cliente.estado === "Activo" ? "outline" : "secondary"}>{cliente.estado}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4" />
                            <span>Ver perfil</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <MailIcon className="h-4 w-4" />
                            <span>Enviar email</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <PhoneIcon className="h-4 w-4" />
                            <span>Llamar</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
