# DOCUMENTACIÓN DEL PROYECTO: PSV SERVIDOR

## 1. Título del Proyecto
**PSV SERVIDOR** - Panel de Control Inteligente para Gestión de Infraestructura y Usuarios.

---

## 2. Objetivo General
Desarrollar una interfaz administrativa web robusta y segura que permita la gestión centralizada de servidores SSH, usuarios y sistemas de archivos, facilitando la supervisión técnica y operacional en tiempo real.

---

## 3. Objetivos Específicos
*   **Gestión de Usuarios:** Implementar un sistema de control de acceso basado en roles (Admin/Usuario) con capacidades de bloqueo y auditoría.
*   **Exploración de Archivos:** Proveer una herramienta de manipulación de archivos remotos que soporte la creación de directorios, carga y descarga de archivos.
*   **Monitoreo en Tiempo Real:** Visualizar métricas críticas del servidor como carga de CPU, uso de memoria y estado de almacenamiento.
*   **Auditoría de Actividad:** Generar un historial detallado de las acciones realizadas dentro de la plataforma para asegurar la trazabilidad.
*   **Integridad de Acceso:** Incluir mecanismos para denegar o permitir el acceso al sistema de archivos de forma granular por usuario.

---

## 4. Justificación
En entornos de administración de servidores, la complejidad de las líneas de comandos puede llevar a errores humanos o tiempos de respuesta lentos. "PSV SERVIDOR" surge como una solución visual que abstrae la complejidad técnica mediante un dashboard intuitivo. Esto no solo mejora la eficiencia de los administradores (Superusuarios), sino que permite a los usuarios estándar interactuar con activos específicos de forma segura y controlada, reduciendo la superficie de ataque y mejorando la operatividad general.

---

## 5. Desarrollo de Proyecto

### 5.1 Pantallas y Flujos
1.  **Módulo de Autenticación (Login):** Punto de acceso seguro donde se validan credenciales y se asigna el entorno según el rol del usuario.
2.  **Dashboard de Estado:** Vista general con estadísticas dinámicas (CPU, Disco, Red) y una lista de infraestructuras conectadas.
3.  **Gestión de Cuentas:** Interfaz exclusiva para administradores donde se listan, modifican, bloquean o eliminan usuarios. Incluye la configuración selectiva de acceso al sistema de archivos.
4.  **Explorador de Archivos (Remote Browser):** Interfaz para navegar por la jerarquía de carpetas del servidor, permitiendo gestiones CRUD de archivos.
5.  **Historial de Actividad (Logs):** Registro cronológico de eventos del sistema, autenticaciones y manipulaciones de archivos.

### 5.2 Herramientas y Tecnologías
*   **Frontend:** React 18+ utilizando Vite como herramienta de construcción rápida.
*   **Lenguaje:** TypeScript para asegurar un código tipado, escalable y libre de errores en tiempo de ejecución.
*   **Estilos:** Tailwind CSS para un diseño moderno, responsivo y de alto rendimiento.
*   **Iconografía:** Lucide React para una representación visual clara de las funciones.
*   **Animaciones:** Framer Motion para transiciones suaves entre vistas y estados de componentes.

### 5.3 Resultados y Demostración
El sistema permite realizar operaciones críticas en menos de 3 clics:
*   **Ejemplo de flujo:** Un administrador crea un usuario "Operador1", le otorga permisos de "Acceso al Sistema de Archivos" y el operador puede inmediatamente subir scripts a la carpeta `/root` del servidor, quedando todo registrado en el diario maestro.

---

## 6. Conclusiones
PSV SERVIDOR cumple exitosamente con la promesa de simplificar la administración de infraestructuras complejas. La separación de roles garantiza que solo personal autorizado realice cambios críticos, mientras que las herramientas de monitoreo aseguran que el administrador esté siempre informado sobre la salud del hardware. La inclusión de un explorador de archivos integrado elimina la necesidad de clientes externos de SFTP en tareas rápidas, centralizando el flujo de trabajo en una sola herramienta web.

---

## 7. Referencias

1.  **React Documentation.** (2024). *The Library for Web and Native User Interfaces.* Disponible en: [https://react.dev/](https://react.dev/)
2.  **TypeScript Handbook.** (2024). *Official documentation for TypeScript.* Disponible en: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
3.  **Tailwind CSS Documentation.** (2024). *Utility-first CSS framework for rapid UI development.* Disponible en: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
4.  **Lucide Icons Reference.** (2024). *Open-source icon library.* Disponible en: [https://lucide.dev/](https://lucide.dev/)
5.  **Vite Guide.** (2024). *Next Generation Frontend Tooling.* Disponible en: [https://vitejs.dev/guide/](https://vitejs.dev/guide/)
