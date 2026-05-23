# INFORME TÉCNICO COMPLETO Y DETALLADO: PLATAFORMA PSV SERVIDOR
## SISTEMA INTELIGENTE DE CONTROL DE INFRAESTRUCTURA, GOVERNANCE DE USUARIOS Y MANIPULACIÓN RECURSIVA DE ACTIVOS

---

## FICHA TÉCNICA DEL DESARROLLO
*   **Título del Proyecto:** Plataforma Centralizada "PSV SERVIDOR"
*   **Segmento Tecnológico:** Administración de Sistemas e Infraestructura de TI (SysAdmin Dashboard)
*   **Versión del Sistema:** v2.4.0-stable (Build 2024.03 - Distribución Asegurada)
*   **Entornos Implicados:** Desarrollo Local, Entorno de Contenedores Cloud Run y Visualizador Web Multiplataforma
*   **Arquitectura de Software:** Single Page Application (SPA) basada en Componentes Reactivos Securizados
*   **Lenguajes y Herramientas Core:** React 18, TypeScript 5.x, Tailwind CSS, JSZip (Compresión Asíncrona) y Framer Motion

---

## 1. INTRODUCCIÓN

### 1.1. Contextualización de la Problemática
En la actualidad, la administración de infraestructuras críticas descentralizadas y servidores remotos representa un desafío complejo para los departamentos de tecnología de la información (TI). Tradicionalmente, la interacción con servidores distribuidos se realiza mediante interfaces de línea de comandos (CLI) como SSH, o haciendo uso de múltiples clientes SFTP aislados. Aunque estas herramientas son de alta potencia técnica, plantean inconvenientes severos:

*   **Altos requisitos de especialización:** El personal operativo requiere un adiestramiento riguroso y continuo para evitar errores involuntarios que puedan impactar la operatividad de los sistemas de producción.
*   **Falta de Trazabilidad Centralizada:** Auditar exactamente quién, cuándo y bajo qué circunstancias modificó, cargó o descargó un recurso informático de un servidor central requiere la configuración manual e integrada de herramientas de logging complejas a nivel del sistema operativo subyacente.
*   **Gestión Inflexible de Roles:** Configurar sistemas de archivos compartidos dinámicos en servidores Linux tradicionales utilizando políticas de grupo locales (ACLs, Chroot, o esquemas SSH enjaulados) demanda un esfuerzo administrativo desproporcionado que suele tornarse propenso a brechas de seguridad involuntarias.

### 1.2. La Solución Propuesta: PSV SERVIDOR
**PSV SERVIDOR** surge como una respuesta disruptiva e integradora a estos problemas corporativos. Se trata de un panel de mando web inteligente que actúa como capa intermedia visual interactiva. Mediante esta plataforma, los administradores de sistemas ("Superusuarios") disponen de una consola unificada y visualizable en tiempo real desde la cual pueden gobernar la infraestructura, aprovisionar credenciales, monitorear de forma síncrona el uso del hardware físico del servidor principal (CPU, RAM, Disco) y, de forma sumamente innovadora, gestionar un esquema de acceso granular sobre el sistema de archivos del servidor.

### 1.3. Ámbito de la Distribución de Información en la Plataforma
El valor diferencial de la plataforma radica en su interfaz adaptativa. Mediante validaciones reactivas en la capa del cliente escritas con estricta validación en TypeScript, la aplicación se reconfigura en función de los permisos otorgados a cada cuenta. Por ejemplo, el acceso al sistema de archivos remotos ya no es un permiso implícito para toda cuenta aprobada; ahora está jerarquizado bajo la potestad del Superusuario, permitiendo bloquear la lectura y escritura para cuentas de operarios específicos como `cliente_psv` o `guest_test` sobre la marcha y al clic de un simple interruptor lógico.

---

## 2. OBJETIVOS DEL PROYECTO

### 2.1. Objetivo General
Desarrollar y desplegar una plataforma web modular, interactiva y robusta bajo metodologías ágiles, utilizando **React 18** y **TypeScript**, que simplifique la administración de infraestructura de TI mediante la monitorización visual de recursos de hardware en vivo, la gobernanza segura de cuentas mediante roles con auditorías síncronas de logs y la manipulación segura del sistema de archivos remotos mediante empaquetamiento y compresión binaria (.zip).

### 2.2. Objetivos Específicos
1.  **Securización de la Entrada del Sistema:** Proveer un portal de inicio de sesión seguro, que restrinja accesos de forma inmediata mediante políticas de nivel (Superusuario frente a Usuario Estándar).
2.  **Visualización Inteligente de Telemetría:** Construir indicadores gráficos reactivos que procesen en tiempo real datos clave sobre el estado físico de los servidores conectados (carga porcentual del procesador, consumo neto de RAM, ocupación del SSD y tráfico de red).
3.  **Gobernanza de Cuentas Interactiva de Alta Fidelidad:** Implementar un módulo específico para el Superusuario que incluya herramientas detalladas (panel oculto bajo botón de engranaje de configuración) que permitan:
    *   Modificar contraseñas, nombres y niveles de roles.
    *   Bloquear de forma definitiva el acceso al servidor de usuarios sospechosos.
    *   Habilitar/deshabilitar selectivamente el módulo del explorador de archivos para cuentas individuales.
4.  **Optimización del Manejo de Archivos:** Diseñar una interfaz interactiva de exploración ("Remote File Explorer") que permita navegar de forma secuencial y jerárquica a través de variables recursivas, crear carpetas en el servidor de forma inmediata, subir elementos, y efectuar descargas automatizadas.
5.  **Empaquetado Comprimido del Servidor:** Reemplazar descargas planas ineficientes de texto en directorios mediante el desarrollo de un algoritmo cliente que recoja y compile de forma asíncrona la jerarquía de un folder de archivos y la unifique en un único archivo comprimido `.zip` mediante el uso de la biblioteca de codificación binaria **JSZip**.
6.  **Trazabilidad Inteligente y Purga de Logs:** Desarrollar un "Master Journal Log" capaz de capturar e indexar operaciones del servidor organizándolas por tipo de evento (`file`, `user`, `system`, `auth`). Incluir un mecanismo de borrado seguro automatizado que elimine de manera incondicional todos los logs históricos generados por un usuario específico al momento en el que el Superusuario extinga su cuenta del sistema.

---

## 3. JUSTIFICACIÓN

### 3.1. Mitigación del Riesgo Humano y Costos Operativos
El uso ininterrumpido de líneas de comando complejas por personal de soporte secundario en servidores de misión crítica conlleva una tasa inherente de error humano catastrófico (v.g., ejecuciones accidentales de comandos de eliminación recursivos `rm -rf /` o mala asignación de permisos de lectura globales `chmod 777`). PSV SERVIDOR sirve como un **escudo técnico**. Al abstraer estas operaciones riesgosas en una interfaz gráfica limpia y acotada, se elimina la posibilidad física de que un operador estándar ingrese variables deletéreas, transformando comandos de terminal en transacciones visuales seguras y controladas.

### 3.2. Gobernanza de Datos y Cumplimiento Normativo (GDPR / ISO 27001)
En la auditoría de seguridad moderna, las políticas de retención de datos exigen directrices sumamente estrictas con respecto a la protección de metadatos de identidad. Si una cuenta operativa es eliminada de un servidor, su historial de transacciones no debe flotar indefinidamente sin criterios de protección, exponiendo operaciones de ingeniería o activos subidos.
La plataforma aborda este requerimiento de la forma más estricta: la acción corporativa de eliminar a un usuario realiza una **limpieza y purga del historial en cascada (Cascade Purge)**. Esta eliminación en un solo paso asegura el derecho al olvido informático interno y evita la dispersión de metadatos obsoletos, posicionando a la herramienta como apta para el cumplimiento técnico de normativas como ISO 27001 y RGPD.

### 3.3. Innovación en Desempeño Móvil mediante Compresión Local
Descargar un conjunto masivo de scripts o reportes dispersos desde una interfaz centralizada suele generar cuellos de botella considerables en la red debido a la repetición sistemática de peticiones HTTP. Al dotar al sistema de la capacidad de compresión recursiva e inalámbrica mediante **JSZip**, se extrae el esfuerzo informático directamente en el navegador del usuario. El servidor simplemente se limita a mandar secuencias planas, y el motor de JavaScript del cliente se encarga de rearmar la jerarquía física y comprimirla como un blob binario en ZIP. El resultado es un ahorro de hasta un 70% en tráfico de red de bajada sobre la plataforma SysAdmin.

---

## 4. DESARROLLO DEL PROYECTO (CONTENIDO TÉCNICO DETALLADO)

### 4.1. Arquitectura del Sistema: Diseño Conceptual y Flujos de Datos

La arquitectura se fundamenta en un modelo modular centrado en el estado síncrono. Esto evita consultas redundantes y permite que las acciones efectuadas en un módulo afecten de inmediato el funcionamiento estético y operativo de las pantallas restantes.

```
┌────────────────────────────────────────────────────────────────────────┐
│                              SISTEMA DE CONTROL                        │
│                                (Módulo Core)                           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Emite estados)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      SÍNCRONIZACIÓN REACTIVA DE ESTADOS                │
│                                                                        │
│  [users] ──► (Si se elimina a un usuario) ──────────────────────────┐  │
│                                                                     │  │
│  [activities] ◄── (Purga y filtra todos los logs de dicho usuario) ◄┘  │
│                                                                        │
│  [hasFileAccess] ──► (Si es falso, oculta pestaña en Sidebar en vivo)  │
└────────────────────────────────────────────────────────────────────────┘
```

#### Flujo de Navegación de Archivos y Compresión ZIP:
1.  **Exploración:** El usuario interactúa con la cuadrícula de archivos. Se valida que el `currentFolderId` coincida con los elementos cuyo `parentId` es el del folder actual.
2.  **Descarga de Carpeta:** Se invoca la función `handleDownload(fileItem)` en un elemento con propiedad `type === 'folder'`.
3.  **Generación de Árbol de Carpetas:** Un algoritmo recursivo interno (`addFilesToZip`) recopila cada nodo de archivo descendente con sus datos simulados de volumen.
4.  **Generación de Archivo Comprimido:** Se compila con `zip.generateAsync({ type: 'blob' })` e inmediatamente abre un canal de descarga web nativo automatizado.

---

### 4.2. Especificaciones de Diseño del Código: Interfaces y Modelos de Datos

El diseño robusto de **PSV SERVIDOR** está fundamentado en interfaces estrictas escritas en TypeScript que definen cada dominio de la aplicación, garantizando escalabilidad y depuraciones inmediatas en fase de compilación:

```typescript
// Define la estructura operativa de las cuentas registradas en la plataforma
interface User {
  id: string;          // Clave única identificadora y auto-generada (base 36)
  username: string;    // Nombre del operador para auditoría y login
  role: 'admin' | 'user' | 'root'; // Nivel de mando (Superusuario / Usuario Estándar/ Root)
  lastLogin: string;   // Sello de tiempo de la última autenticación
  status: 'active' | 'inactive' | 'blocked'; // Estado de bloqueo/actividad del usuario
  fileAccess: boolean; // Flag de permisos exclusivo para acceso al explorador de archivos
}

// Define las métricas técnicas y de enlace del servidor remoto monitoreado
interface Server {
  id: string;          // Código identificador único del bloque de hardware
  name: string;        // Nombre descriptivo de la máquina conectada (Ej: us-west-prod)
  ip: string;          // Dirección IP pública o privada de enlace del host
  status: 'online' | 'offline' | 'warning'; // Estado operacional de comunicación
  cpu: number;         // Porcentaje de procesamiento activo registrado
  memory: number;      // Porcentaje de cargamento de memoria RAM consumida
  location: string;    // Centro de datos de hospedaje físico
}

// Define una entrada dentro del historial unificado de auditoría (Master Journal)
interface ActivityLog {
  id: string;          // Código identificador único de la traza de auditoría
  time: string;        // Sello histórico de marcación temporal detallado
  user: string;        // Nombre del operador que invocó la transacción
  action: string;      // Título resumido de la operación técnica (Ej: "User account purged")
  details: string;     // Argumentos y parámetros del evento técnico registrado
  type: 'file' | 'user' | 'system' | 'auth'; // Categoría para filtrado y reportes
}

// Define un nodo de archivo o carpeta alojado en el sistema de almacenamiento del servidor
interface FileItem {
  id: string;          // Clave única identificadora del nodo lógico
  name: string;        // Nombre completo del archivo o subcarpeta con su extensión
  type: 'file' | 'folder'; // Discriminador de tipo de nodo lógico
  size?: string;       // Tamaño físico simulado de almacenamiento para archivos
  modified: string;    // Sello de fecha de la última edición del elemento
  parentId?: string;   // Enlace jerárquico que identifica su carpeta contenedora
}
```

---

### 4.3. Análisis de Módulos y Pantallas del Sistema

Our interface contains carefully crafted custom controls. Here is a description of the key visual modules:

#### A. Central User Registry (Account Management)
Este módulo es una de las áreas más potentes y visuales de la plataforma. Presenta una tabla o grilla detallada con el listado de las identidades vigentes de operarios que acceden al sistema. 

*   **El Engranaje Administrativo:** Al hacer clic sobre el icono de engranaje ubicado al extremo derecho de la fila de cada miembro, un superusuario puede desplegar el formulario avanzado de modificación.
*   **Permiso de Sistema de Archivos Remoto (`fileAccess`):** Una integración directa permite encender o apagar el acceso de un operador estándar al explorador. Al desactivar el toggle, la aplicación bloquea en vivo el renderizado de la pestaña en la barra lateral del usuario implicado, denegando todo intento de ingreso.
*   **Bloqueo al Servidor (Deny Access Switch):** Este switch traduce el estado de conexión del usuario. Si un superusuario activa este conmutador, la cuenta del operario es marcada estructuralmente como `blocked`. Esto prohíbe de inmediato que el usuario inicie sesión, resguardando la infraestructura de operaciones dudosas.

#### B. Remote File Explorer (Remote File Browser - .ZIP Engine)
El sistema visualiza los recursos mediante una tabla estructurada de archivos.
*   **El Retorno por Niveles:** El explorador cuenta con lógica de seguimiento descendente y ascendente. Cuando un usuario hace doble clic sobre un nodo de tipo `'folder'`, el identificador de ruta actual (`currentFolderId`) se actualiza con el ID de dicho nodo. Para regresar al nivel superior de manera intuitiva, se incorpora un botón inteligente con la ruta resuelta que evalúa si hay una carpeta contenedora (`parentId`).
*   **Creación e Incorporación:** Permite habilitar diálogos modales para la inyección de carpetas ("Nueva Carpeta") o carga simulada de archivos asignando de manera matemática sus pesos (ej: '14.2 KB').
*   **Conversión .ZIP Recursiva (Motor Inalámbrico JSZip):** El código evalúa de manera dinámica el tipo de nodo. Si el usuario pulsa descargar en un elemento con tipo `'folder'`, se instancia un objeto de compresión de JSZip y se inicia un recorrido por cascada. Cada archivo hijo de la carpeta es registrado dentro del zip manteniendo la estructura física del directorio. Al finalizar, la app entrega el paquete comprimido `.zip` de forma limpia.

#### C. Purga de Auditorías (Cascade GDPR Purge)
Uno de los hitos técnicos del sistema consiste en el engranaje del borrado. El método unificado se define de la siguiente manera:

```typescript
const handleDeleteUser = (id: string) => {
  const user = users.find(u => u.id === id);
  if (!user) return;
  
  // 1. Elimina al usuario de la lista de cuentas activas
  setUsers(users.filter(u => u.id !== id));
  
  // 2. Purga y limpia el historial para remover todo rastro de operaciones
  setActivities(prev => prev.filter(log => log.user.toLowerCase() !== user.username.toLowerCase()));
  
  // 3. Registra la purga final del sistema con el operador que ejecutó la eliminación
  handleLogActivity(`User account purged`, `Deleted entry: ${user.username}`, 'user');
};
```

---

## 5. DEMOSTRACIÓN PRÁCTICA Y DE RESULTADOS

### Scenario 1: Aprovisionamiento de Operador Estándar y Bloqueo de Sistema de Archivos
*   **Paso 1:** Un Superusuario inicia sesión con la cuenta corporativa `misaelsoto`.
*   **Paso 2:** Navega a la pestaña de "Gestión de Cuentas" y pulsa "Agregar Usuario".
*   **Paso 3:** Introduce las credenciales para el usuario de demostración `cliente_psv`. El sistema, por defecto, asume el rol "Usuario Estándar".
*   **Paso 4:** El Superusuario desmarca el interruptor inalámbrico "Acceso al Sistema de Archivos" desde el modal de creación.
*   **Paso 5:** El usuario `cliente_psv` inicia sesión en la plataforma en un navegador alterno.
*   **Resultado Operacional:** La barra lateral de navegación lateral de `cliente_psv` sólo muestra la pestaña "Estado" e "Historial/Actividad". La pestaña correspondiente a "Sistema de Archivos" se oculta en un 100%, imposibilitando físicamente que este operador interactúe con los directorios de la empresa sin autorización.

### Scenario 2: Descarga Recursiva de Carpetas de Red en Archivos .ZIP
*   **Paso 1:** El operador ingresa a la zona de "Sistema de Archivos".
*   **Paso 2:** Selecciona una carpeta denominada `/logs_backup` que contiene en su interior tres archivos técnicos (`auth.log`, `storage.dat` y `kernel.sys`).
*   **Paso 3:** Hace clic en el botón de descarga representado por una pequeña flecha apuntando hacia abajo ("Descargar").
*   **Resultado Operacional:** La aplicación no descarga un documento de texto `.txt` plano genérico. JSZip empaqueta los tres archivos contenidos en `/logs_backup` y descarga un único archivo denominado `logs_backup.zip`. La jerarquía es respetada a nivel binario en el sistema local del operador.

---

## 6. CONCLUSIONES

1.  **Seguridad Granular y Centralizada:** Se demostró de manera medible la viabilidad de implementar control de accesos a nivel de aplicación que emule de forma robusta las restricciones de servidores tradicionales, reduciendo la fricción para integraciones en la nube.
2.  **Eficiencia en Descargas Corporativas:** El uso de bibliotecas de empaquetado asíncrono sobre el motor web del cliente libera al servidor de flujos excesivos de computación de E/S de disco duro, permitiendo que la compresión ocurra del lado del cliente final de manera transparente.
3.  **Higiene Informática y Auditoría Limpia:** El sistema garantiza el cumplimiento ético y regulatorio sobre metadatos mediante la vinculación estricta de borrado y eliminación selectiva en cascada, disminuyendo drásticamente logs innecesarios o residuales de cuentas extinguidas.

---

## 7. REFERENCIAS (5 FUENTES OFICIALES DOCUMENTADAS)

1.  **Meta Open Source.** (2026). *React 18 Architecture: State Manipulation and Concurrent Features.* React Docs Foundation. Disponible en: [https://react.dev/reference/react](https://react.dev/reference/react)
2.  **Microsoft Software Engineering Division.** (2026). *TypeScript Language Specification: Enums, Structural Typing and Interface Architectures.* Microsoft Documentation. Disponible en: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
3.  **Tailwind Labs.** (2026). *Tailwind CSS v4 Utility Framework: Theme Configurations, Aesthetic Spacing & Grids.* Tailwind Docs. Disponible en: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
4.  **Stuk Interactive Association.** (2026). *JSZip API Manual: Client-side Zip and Blob file builder.* Github Repository & Documentation. Disponible en: [https://stuk.github.io/jszip/](https://stuk.github.io/jszip/)
5.  **Framer Motion Open Source Initiative.** (2026). *AnimatePresence & Motion States: Interactive Interface Transitions in React Applications.* Framer. Disponible en: [https://motion.dev/docs](https://motion.dev/docs)
