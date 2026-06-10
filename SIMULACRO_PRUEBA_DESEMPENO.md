# Simulacro — Prueba de Desempeño

## Descripción General

Desarrollar una aplicación **e-commerce** completa utilizando **Next.js**, con autenticación de usuarios, internacionalización, integración con base de datos, envío de correos electrónicos y tareas programadas.

---

## Requisitos Funcionales

### 1. Catálogo de Productos

- Mostrar un listado de productos con **scroll** en la página principal.
- Cada producto se muestra mediante un **componente reutilizable con props** (`ProductCard` o similar).
- El componente debe mostrar: imagen, nombre, precio y una **estrella de favoritos** (toggle).
- Los productos son **visibles sin necesidad de iniciar sesión**.

### 2. Vista de Detalle de Producto

- Ruta dinámica (ej. `/products/[id]`) que muestra la información completa del producto.
- Debe incluir **datos adicionales** que **no se muestran** en el listado (descripción extendida, especificaciones, stock, etc.).

### 3. Autenticación

- Páginas de **Login** y **Register**.
- Un usuario **no autenticado** puede navegar y ver productos, pero:
  - Al intentar **agregar al carrito** o **comprar**, se le solicita iniciar sesión primero.
- Al estar autenticado, el **Navbar superior** muestra el **nombre del usuario** logueado.

### 4. Favoritos

- Cada tarjeta de producto tiene una **estrella (ícono)**: al hacer clic, agrega o quita el producto de favoritos.
- Existe una **vista dedicada** (`/favorites`) que muestra únicamente los productos marcados como favoritos del usuario.
- Requiere autenticación.

### 5. Carrito de Compras y Ventas

- Los usuarios autenticados pueden agregar productos al carrito.
- Al realizar una compra, se registra la venta en la base de datos.

---

## Requisitos Técnicos

### Arquitectura

- Implementar una **capa de servicios** (service layer) separada de la lógica de las rutas/páginas. Toda interacción con la base de datos debe pasar por esta capa.

### Base de Datos

Usar **MongoDB** con las siguientes colecciones:

| Colección | Descripción |
|---|---|
| `users` | Información de usuarios registrados |
| `products` | Catálogo de productos (incluye campos extendidos solo visibles en detalle) |
| `cart` | Carrito de compras por usuario |
| `favorites` | Productos favoritos por usuario |
| `sales` | Ventas registradas |

### Internacionalización (i18n)

- Implementar soporte para **3 idiomas**: Español (`es`), Inglés (`en`) y Portugués (`pt`).
- Todos los textos de la interfaz deben estar traducidos.

### Librería de Componentes UI

- Usar una librería de componentes para los elementos generales de la UI (botones, inputs, modales, etc.).
- Se sugiere **MUI (Material UI)** o **HeroUI**.

---

## Requisitos de Integración / Servicios Externos

### Envío de Correo Electrónico

1. **Bienvenida al registro:** Al registrar un nuevo usuario, enviar automáticamente un correo electrónico de bienvenida a la dirección proporcionada.

2. **Reporte diario de ventas (Cron Job):** Configurar un **cron job diario** que envíe un correo electrónico a una dirección configurada con un reporte de las **ventas realizadas en el mes en curso**.

---

## Resumen de Vistas / Rutas

| Ruta | Descripción | Auth requerida |
|---|---|---|
| `/` | Listado de productos con scroll | No |
| `/products/[id]` | Detalle del producto | No |
| `/login` | Inicio de sesión | No |
| `/register` | Registro de nuevo usuario | No |
| `/favorites` | Productos marcados como favoritos | Sí |
| `/cart` | Carrito de compras | Sí |

---

## Criterios de Evaluación

- Componentización correcta con uso de **props** para `ProductCard`.
- Correcta implementación de **rutas dinámicas** para el detalle.
- Flujo de **autenticación** funcional (protección de acciones, usuario en Navbar).
- **Capa de servicios** desacoplada y bien estructurada.
- Integración con **MongoDB** y colecciones correctamente definidas.
- **i18n** operativo en los 3 idiomas.
- **Envío de email** en registro y mediante cron job diario.
- Código limpio, organizado y escalable.
