# 🛒 Panel de Control – Mi Tienda

Este proyecto es un panel de administración web para **Mi Tienda**, desarrollado con **Next.js**, **Supabase** y componentes de UI modernos usando **shadcn/ui**. Permite la gestión integral de productos, categorías, subcategorías, stock, movimientos de inventario y clientes.

---

## 🚀 Tecnologías utilizadas

- **Next.js 14** – Framework web React fullstack
- **Supabase** – Backend as a Service (Base de datos + Auth + Storage)
- **PostgreSQL** – Base de datos relacional
- **TypeScript** – Tipado estático para escalabilidad
- **shadcn/ui** – Componentes accesibles y personalizables
- **Tailwind CSS** – Estilos rápidos y responsive
- **Sonner** – Toasts de notificación modernos

---

## 📂 Funcionalidades

### Productos
- Crear, editar, inactivar productos
- Subida de imágenes al bucket de Supabase Storage
- Relación con categorías y subcategorías
- Cálculo automático de precio con impuesto
- Estado visual (Activo/Inactivo)

### Categorías & Subcategorías
- Módulo tabulado: todas / categorías / subcategorías
- Permite inactivar sin eliminar (badge rojo)
- Relación jerárquica padre-hijo entre categorías

### Stock
- Aumento de stock manual
- Visualización de stock físico y comprometido
- Control por producto

### Clientes
- Registro de datos básicos de clientes

### Inventario
- Registro de movimientos: entradas/salidas
- Afecta directamente el stock

---

## 🛠 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/mi-tienda-panel.git
cd mi-tienda-panel
