# PROYECTO: SISTEMA DE GESTIÓN PSV SERVIDOR

**Autor:** Equipo de Desarrollo PSV  
**Fecha:** 7 de Mayo de 2024  
**Versión:** 1.0.0  

---

## ÍNDICE
1. [Título del Proyecto](#1-título-del-proyecto)
2. [Introducción](#2-introducción)
3. [Objetivo General](#3-objetivo-general)
4. [Objetivos Específicos](#4-objetivos-específicos)
5. [Justificación](#5-justificación)
6. [Desarrollo del Proyecto](#6-desarrollo-del-proyecto)
   - [6.1 Arquitectura del Sistema](#61-arquitectura-del-sistema)
   - [6.2 Descripción de Módulos (Pantallas)](#62-descripción-de-módulos)
   - [6.3 Herramientas Utilizadas](#63-herramientas-utilizadas)
7. [Resultados y Demostración](#7-resultados-y-demostración)
8. [Conclusiones](#8-conclusiones)
9. [Referencias](#9-referencias)

---

## 1. TÍTULO DEL PROYECTO
**"PSV SERVIDOR: Plataforma Integral de Administración de Infraestructura y Control de Usuarios en Tiempo Real"**

---

## 2. INTRODUCCIÓN
En la era digital actual, la gestión de servidores y la seguridad de la información son pilares fundamentales para cualquier organización. PSV SERVIDOR nace como una herramienta diseñada para cerrar la brecha entre la complejidad de la administración técnica de servidores y la necesidad de una interfaz de usuario fluida y segura. Este sistema permite a los administradores gestionar no solo el hardware (servidores), sino también el activo más importante: el acceso humano.

---

## 3. OBJETIVO GENERAL
Diseñar y desplegar una aplicación web de alto rendimiento basada en React y TypeScript que centralice la administración de servidores, permitiendo el control total sobre usuarios, archivos y estados del sistema bajo un entorno de seguridad granular.

---

## 4. OBJETIVOS ESPECÍFICOS
*   **Seguridad:** Implementar un sistema de "Bloqueo de Acceso" que permita denegar la entrada al servidor de forma instantánea.
*   **Gestión de Archivos:** Desarrollar un explorador de archivos remoto funcional que soporte navegación de carpetas (subir/bajar niveles).
*   **Privilegios:** Crear un sistema de roles donde el "Superusuario" pueda otorgar o revocar el acceso al sistema de archivos de manera individual.
*   **Auditoría:** Mantener un diario de eventos (Logs) que se limpie automáticamente al eliminar usuarios, garantizando la privacidad y orden del sistema.
*   **Experiencia de Usuario:** Optimizar la interfaz para que sea responsiva y amigable, utilizando estándares modernos de diseño industrial.

---

## 5. JUSTIFICACIÓN
La administración de servidores tradicionalmente requiere conocimientos avanzados en terminales Linux/Unix. PSV SERVIDOR justifica su desarrollo al democratizar estas tareas, permitiendo que operadores con menos experiencia puedan gestionar archivos y usuarios de forma segura, mientras los administradores mantienen el control total mediante herramientas de supervisión visual. Además, la capacidad de borrar el historial de un usuario al eliminarlo cumple con las normativas vigentes de protección de datos y limpieza de sistemas.

---

## 6. DESARROLLO DEL PROYECTO

### 6.1 Arquitectura del Sistema
El sistema utiliza una arquitectura de **SPA (Single Page Application)**.
- **Estado Global:** Gestionado mediante Hooks de React (`useState`, `useEffect`) para mantener la sincronía entre la lista de usuarios y los logs de actividad.
- **Seguridad:** Los componentes de archivos y gestión de usuarios están protegidos por validaciones de rol en la capa del cliente.

### 6.2 Descripción de Módulos (Pantallas)
1.  **Panel de Login:** Interfaz minimalista con protección de ingreso y selección dinámica de perfiles.
2.  **Dashboard (Tablero):** Visualización de métricas de CPU (15%), Memoria (32%) y Disco (64%). Incluye el estado de conexión del enlace `us-west-prod`.
3.  **Gestión de Cuentas (Superusuario):** 
    - Lista de usuarios con ID único.
    - Botón de edición (Engranaje) para cambiar nombres, contraseñas y niveles de privilegio.
    - Interruptor de "Acceso al Sistema de Archivos" para cada usuario.
    - Botón de eliminación definitiva.
4.  **Explorador de Archivos:**
    - Sistema de rutas navegable.
    - Botón "Nueva Carpeta" con diálogos de entrada.
    - Botones de descarga y borrado de activos.
5.  **Historial (Journal):** Monitor de eventos filtrable que muestra quién, cuándo y qué acción realizó en el sistema.

### 6.3 Herramientas Utilizadas
*   **React 18:** Biblioteca principal para la interfaz.
*   **TypeScript:** Para la robustez del código y manejo de interfaces de datos (User, FileItem, Server).
*   **Tailwind CSS:** Para el estilizado mediante utilidades (diseño "Mobile First").
*   **Framer Motion:** Para las animaciones de los modales y transiciones de pestañas.
*   **Lucide React:** Set de iconos vectoriales para una carga rápida.

---

## 7. RESULTADOS Y DEMOSTRACIÓN
**Caso de uso exitoso:**
Un administrador ingresa a la sección de "Superusuario", pulsa el botón "Agregar Usuario", define un operador con el rol "Usuario Estándar" pero desactiva su "Acceso al Sistema de Archivos". 
*   **Resultado:** El usuario puede entrar al sistema y ver las métricas de estado, pero la pestaña del explorador desaparece de su menú lateral, cumpliendo con la restricción de seguridad. Al ser eliminado el usuario por el administrador, todos los logs relacionados con él desaparecen del historial principal.

---

## 8. CONCLUSIONES
El proyecto PSV SERVIDOR demuestra que la integración de lenguajes modernos como TypeScript y frameworks como React permite construir herramientas administrativas que son tanto potentes como seguras. Se logró cumplir con la restricción de accesos granulares y la gestión de archivos dinámicos, estableciendo una base sólida para futuras expansiones como la conexión real vía WebSSH o la monitorización de microservicios.

---

## 9. REFERENCIAS
1.  **Meta Open Source.** (2024). *React - A JavaScript library for building user interfaces.* [https://react.dev/](https://react.dev/)
2.  **Microsoft.** (2024). *TypeScript Documentation - Typed JavaScript at Any Scale.* [https://www.typescriptlang.org/](https://www.typescriptlang.org/)
3.  **Tailwind Labs.** (2024). *Tailwind CSS Style Guide.* [https://tailwindcss.com/](https://tailwindcss.com/)
4.  **Framer B.V.** (2024). *Framer Motion API Reference.* [https://www.framer.com/motion/](https://www.framer.com/motion/)
5.  **Ecma International.** (2024). *ECMAScript® 2024 Language Specification.* [https://www.ecma-international.org/](https://www.ecma-international.org/)
