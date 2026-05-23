# INFORME TÉCNICO DE SISTEMA: PLATAFORMA PSV SERVIDOR

## 1. INTRODUCCIÓN

En el panorama actual de la administración de sistemas y la gestión de infraestructura de TI, la seguridad, la trazabilidad y la eficiencia operativa son factores indispensables. La administración tradicional de servidores mediante interfaces de línea de comandos (CLI) o clientes SFTP independientes suele requerir un alto nivel de especialización técnica y carece de un sistema unificado para auditar, restringir y estructurar accesos a nivel de usuario sin incurrir en configuraciones complejas en la terminal de Linux.

**PSV SERVIDOR** nace para resolver este desafío de manera integral. Es una plataforma web administrativa modular desarrollada con tecnología moderna (**React, TypeScript, Tailwind CSS y JSZip**) diseñada para centralizar e interactuar visualmente con servidores virtuales SSH, exploradores de archivos distribuidos e historial de eventos de sistema. Su enfoque centrado en la usabilidad permite a los administradores y operarios monitorear, en tiempo real, el rendimiento del hardware, restringir dinámicamente el acceso selectivo a directorios e inspeccionar actividades, garantizando el cumplimiento de estrictos estándares normativos de seguridad de datos.

---

## 2. CONTENIDO (DESARROLLO DEL PROYECTO)

### 2.1. Arquitectura y Stack Tecnológico del Sistema

El sistema implementa una **Arquitectura de Aplicación de Página Única (SPA)** de alto rendimiento, optimizada para dar feedback visual inmediato sin recargar la página.

*   **Capa del Cliente (Interfaz de Usuario):** Construida sobre **React 18** y estructurada mediante **TypeScript** para asegurar tipado estricto en los dominios de datos (`User`, `FileItem`, `ActivityLog`, `Server`).
*   **Diseño Visual:** Estilizado mediante **Tailwind CSS** utilizando una paleta de color minimalista de alta densidad ("Cosmic Slate Theme") que aprovecha el padding asimétrico y la tipografía monoespaciada para elementos de diagnóstico.
*   **Motor de Animación:** Implementación de transiciones de pestaña, modales flotantes y paneles deslizables fluidos usando **Framer Motion** (`motion/react`).
*   **Empaquetado de Activos:** Integración de la biblioteca **JSZip** para el procesamiento binario de carpetas del servidor y empaquetado recursivo de archivos en formato comprimido `.zip` directamente desde el navegador del cliente.

```
       [ Interfaz de Usuario (React + Tailwind CSS) ]
                            │
               [ Estado de Aplicación React ]
         (Gestión de Hooks: useState, useEffect, useRef)
                            │
       ┌────────────────────┼────────────────────┐
       ▼                    ▼                    ▼
[Gestión de Archivos] [Control de Usuarios] [Monitor de Logs]
 (Navegación / jszip)  (Roles/Permiso File)  (Filtros/Purga)
```

### 2.2. Descripción de Módulos Críticos y Pantallas

#### A. Módulo de Autenticación Unificado (Login)
*   **Acceso Restringido:** Diseñado bajo el principio de menor privilegio. Remueve el auto-registro no controlado de la vista principal e introduce inicio seguro para operarios autorizados.
*   **Perfiles por Defecto:** Cuenta con accesos predefinidos para superusuarios (`admin`, `misaelsoto`) y usuarios del sistema (`dev_user_01`, `cliente_psv`), asignándoles políticas específicas de acceso desde el arranque.

#### B. Dashboard de Estado e Infraestructura
*   **Métricas de Hardware:** Contenedores dinámicos que muestran el rendimiento de almacenamiento de datos del sistema, la carga actual de CPU (15%), ocupación de memoria RAM (32%) y estado general del disco Sólido (64%).
*   **Supervisión Logística:** Monitorea el estado y uptime de enlaces a máquinas redundantes como `us-west-prod` (192.168.1.10).

#### C. Control de Cuentas Avanzado (Módulo del Superusuario)
Es la sección donde el Administrador ejerce la gobernanza del servidor. Ofrece las opciones avanzadas desde el menú con un engranaje administrativo:
*   **Creación e Inicialización:** Registro de nuevos miembros con selección explícita de nivel (`Superusuario` o `Usuario Estándar`).
*   **Supervisión e Identidades:** Posibilidad de modificar nombres de usuario operativos de manera directa.
*   **Asignación Gradual de Privilegios:** Permite promover o degradar cuentas de usuario a nivel "Superusuario" de manera dinámica.
*   **Interruptor de Acceso al Servidor (Bloqueo):** Permite aislar por completo a un usuario malicioso o inactivo cancelando su sesión en vivo.
*   **Control Selectivo del Sistema de Archivos:** A través de un toggle incorporado en el panel del engranaje administrativo, el Superusuario puede habilitar o inhabilitar de manera inalámbrica la pestaña "Explorador de Servidor" a usuarios estándar específicos.
*   **Eliminación Absoluta y Purga de Historial (GDPR Compliance):** Al borrar un usuario, el sistema no solo lo elimina del registro de cuentas, sino que ejecuta una purga recursiva dentro del historial unificado de logs, eliminando automáticamente cada rastro de su actividad para propósitos de privacidad y limpieza técnica del servidor.

#### D. Explorador de Archivos Remoto con Descarga en ZIP
*   **Navegación Intuitiva Horizontal y Descendente:** Soporta jerarquía en cascada mediante una variable de estado `currentFolderId`. El usuario puede hacer clic en carpetas para explorar su interior con un visualizador interactivo, contando con un botón de retroceso dinámico ("Regresar").
*   **Creación Dinámica de Directorios:** Permite estructurar nuevas subcarpetas en tiempo de ejecución ("Nueva Carpeta") solicitando su nombre mediante ventanas de diálogo óptimas.
*   **Carga y Gestión de Activos:** Permite adjuntar archivos del sistema a carpetas específicas, registrando de forma automática la ruta actual en el historial de eventos.
*   **Descarga Estructurada de Carpetas (.ZIP) con JSZip:** A diferencia de sistemas estándar que leen listados planos de texto, al presionar el botón de descarga en una carpeta, el navegador genera dinámicamente un archivo `.zip` comprimido que guarda de manera recursiva la jerarquía del directorio conservando sus respectivos nombres de archivo, facilitando el respaldo rápido de activos.

---

## 3. CONCLUSIONES

1.  **Gobernabilidad y Seguridad Adaptativa:** La inclusión del toggle de acceso al sistema de archivos dentro de la interfaz del "Superusuario" brinda un esquema adaptativo único, donde la interfaz gráfica del usuario de tipo estándar (por ejemplo, `cliente_psv`) se reestructura de forma instantánea desactivando accesos laterales no autorizados. El usuario `cliente_psv` viene predeterminado para ver la información de manera segura pero restringible.
2.  **Optimización en Rendimiento de Descargas:** La incorporación del motor de compresión de JSZip representa una mejora disruptiva en el consumo de ancho de banda del servidor. En lugar de descargar archivos uno por uno, la compresión recursiva permite empaquetar directorios de forma integrada en el cliente, logrando flujos de descarga inmediatos sin sobrecargar la CPU del servidor central.
3.  **Cumplimiento de Privacidad y Limpieza Automatizada:** La respuesta sincronizada entre la persistencia de usuarios y el diario de logs (eliminando el historial de actividad de un usuario borrado) previene la sobrecarga informática de logs innecesarios y se alinea con las mejores prácticas internacionales de higiene de bases de datos.
4.  **Trazabilidad Operacional Absoluta:** La segregación de logs clasificados por origen ('user', 'file', 'auth', 'system') ofrece a los analistas un historial comprensible y claro de cada comando simulado ejecutado en la plataforma, permitiendo reconstruir incidentes en segundos.

---

## 4. REFERENCIAS

1.  **React Docs.** (2026). *Managing Application State & Component Lifecycle.* Meta Open Source. Obtenido de: [https://react.dev/](https://react.dev/)
2.  **TypeScript Reference.** (2026). *Strict Type Architectures for Multi-user Environments.* Microsoft. Obtenido de: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
3.  **Tailwind CSS Documentation.** (2026). *Utility-First CSS and Responsive Adaptive Layouts.* Tailwind Labs. Obtenido de: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
4.  **JSZip Library API.** (2026). *Dynamic Client-side Zip Compression and File Packing.* Stuk Github Foundation. Obtenido de: [https://stuk.github.io/jszip/](https://stuk.github.io/jszip/)
5.  **Framer Motion Reference.** (2026). *Declarative Layout Animations for Complex Modals in React.* Framer B.V. Obtenido de: [https://motion.dev/](https://motion.dev/)
