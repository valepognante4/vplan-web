# 🚀 VPlan — Tu productividad, simplificada

**VPlan** es una aplicación web full-stack diseñada para la gestión y organización eficiente de tareas diarias. Permite a los usuarios registrarse, organizar sus pendientes, filtrar por prioridades y estados, y mantener el control total de su productividad mediante una interfaz moderna y limpia en modo oscuro.

🌐 **Enlace a producción:** [Ver aplicación en vivo](https://vplan-frontend.onrender.com)

---

## 🛠️ Tecnologías y Stack Tecnológico

El proyecto está desarrollado utilizando una arquitectura moderna de separación de responsabilidades (Client-Server):

### **Frontend**
* **React.js** (con JavaScript)
* **CSS / Estilos personalizados** (Diseño moderno con interfaz en modo oscuro y estética minimalista)

### **Backend**
* **Node.js** & **Express.js** (API REST robusta)
* **JSON Web Tokens (JWT)** para autenticación y recuperación segura de contraseñas.
* **Google OAuth** para inicio de sesión alternativo.

### **Base de Datos**
* **PostgreSQL** alojada en **Supabase**.

### **DevOps y Despliegue**
* **Docker** para la contenedorización.
* **Render** para el alojamiento y despliegue continuo de los servicios en producción.

---

## ✨ Características Principales

* **Gestión completa de tareas (CRUD):** Creación, visualización, edición y eliminación de tareas pendientes.
* **Filtros avanzados:** Filtrado rápido de tareas según su estado (Todas, Pendientes, Completadas) y nivel de prioridad.
* **Autenticación segura:** 
  * Registro e inicio de sesión tradicional con hashing de contraseñas.
  * Autenticación mediante **Google OAuth**.
  * Flujo de **recuperación de contraseña** mediante tokens seguros (JWT).
* **Interfaz de usuario optimizada:** Diseño limpio en modo oscuro enfocado en la experiencia de usuario y la claridad visual.

---

## 📂 Estructura del Proyecto

```text
vplan/
│
├── frontend/          # Interfaz de usuario (React)
├── backend/           # API REST y lógica de negocio (Node.js / Express)
└── README.md          # Documentación del proyecto
