/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  Users, 
  Terminal, 
  Settings, 
  Shield, 
  Activity, 
  Database, 
  HardDrive, 
  Cpu, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Circle, 
  LayoutDashboard,
  LogOut,
  Bell,
  CpuIcon,
  Network,
  Lock,
  ChevronDown,
  Globe,
  Folder,
  File,
  Upload,
  Download,
  FilePlus,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Tab = 'dashboard' | 'users' | 'logs' | 'settings' | 'my_server';
type Lang = 'en' | 'es';
type UserRole = 'admin' | 'user';

interface ActivityLog {
  id: string;
  time: string;
  user: string;
  action: string;
  details: string;
  type: 'file' | 'user' | 'system' | 'auth';
}

interface Server {
  id: string;
  name: string;
  ip: string;
  status: 'online' | 'offline' | 'warning';
  cpu: number;
  memory: number;
  location: string;
}

interface User {
  id: string;
  username: string;
  role: 'admin' | 'user' | 'root';
  lastLogin: string;
  status: 'active' | 'inactive';
}

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  result: 'success' | 'failure';
}

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
}

// --- Translations ---
const translations = {
  en: {
    dashboard: "Status",
    users: "Account Management",
    logs: "History/Activity",
    settings: "Settings",
    my_server: "File System",
    logout: "Logout",
    sessions: "Current Sessions",
    cpu: "CPU Load",
    disk: "Storage",
    traffic: "Data Flow",
    connected_servers: "Primary Server Status",
    view_all: "Refresh",
    security_logs: "Recent Real-Time Activity",
    system_operational: "Active Link",
    search: "Search everything...",
    access_control: "User Control",
    invite_user: "Add User",
    journal: "Master Activity Journal",
    configuration: "System Config",
    tfa: "Two-Factor Auth",
    tfa_desc: "Require 2FA for all logins.",
    retention: "Retention",
    retention_desc: "Auto-clear logs after 90 days.",
    wipe: "Purge System",
    login_title: "PSV SERVIDOR Login",
    username_label: "Username",
    password_label: "Password",
    login_btn: "Access Platform",
    username: "User",
    role: "Role",
    status: "Service",
    last_login: "Timestamp",
    server_mgmt: "Connected Infrastructure",
    server_mgmt_desc: "Viewing: us-west-prod · 192.168.1.10",
    add_server: "Add Server",
    server_name: "Resource ID",
    ip_address: "Link IP",
    ssh_port: "Port",
    ssh_username: "SSH User",
    ssh_password: "SSH Pass",
    save_server: "Confirm Link",
    cancel: "Discard",
    new_server_title: "Link New Infrastructure",
    tailing: "streaming active events...",
    days: "Days",
    file_explorer: "Remote File Browser",
    explorer_desc: "Direct manipulation of server volume.",
    new_file: "Create File",
    upload: "Push File",
    download: "Pull",
    delete: "RM",
    name: "Filename",
    size: "Size",
    modified: "Last Edit",
    role_admin: "Superuser",
    role_user: "Standard User",
    change_password: "Reset Auth",
    new_password: "New Credentials",
    save_changes: "Update",
    pass_updated: "Auth Vector Updated",
    register_title: "Platform Enrollment",
    register_btn: "Enroll",
    have_account: "Secure Login",
    need_account: "New Enrollment",
  },
  es: {
    dashboard: "Estado",
    users: "Gestión de Cuentas",
    logs: "Historial/Actividad",
    settings: "Ajustes",
    my_server: "Sistema de Archivos",
    logout: "Cerrar Sesión",
    sessions: "Sesiones Activas",
    cpu: "Carga CPU",
    disk: "Almacenamiento",
    traffic: "Flujo de Datos",
    connected_servers: "Estado del Servidor Principal",
    view_all: "Actualizar",
    security_logs: "Actividad Reciente en Tiempo Real",
    system_operational: "Enlace Activo",
    search: "Buscar en todo...",
    access_control: "Control de Usuarios",
    invite_user: "Agregar Usuario",
    journal: "Diario Maestro de Actividad",
    configuration: "Config. del Sistema",
    tfa: "Autenticación 2FA",
    tfa_desc: "Requerir 2FA para entrar.",
    retention: "Retención",
    retention_desc: "Limpiar logs cada 90 días.",
    wipe: "Purgar Sistema",
    login_title: "Inicio de Sesión PSV SERVIDOR",
    username_label: "Usuario",
    password_label: "Contraseña",
    login_btn: "Acceder",
    username: "Usuario",
    role: "Rol",
    status: "Estado",
    last_login: "Marca de Tiempo",
    server_mgmt: "Infraestructura Conectada",
    server_mgmt_desc: "Visualizando: us-west-prod · 192.168.1.10",
    add_server: "Agregar Servidor",
    server_name: "ID del Recurso",
    ip_address: "IP de Enlace",
    ssh_port: "Puerto",
    ssh_username: "Usuario SSH",
    ssh_password: "Pass SSH",
    save_server: "Confirmar Enlace",
    cancel: "Descartar",
    new_server_title: "Enlazar Nueva Infraestructura",
    tailing: "rastreando eventos activos...",
    days: "Días",
    file_explorer: "Explorador Remoto",
    explorer_desc: "Manipulación directa del volumen del servidor.",
    new_file: "Crear Archivo",
    upload: "Subir Archivo",
    download: "Descargar",
    delete: "Borrar",
    name: "Nombre",
    size: "Tamaño",
    modified: "Último Cambio",
    role_admin: "Superusuario",
    role_user: "Usuario Estándar",
    change_password: "Resetear Clave",
    new_password: "Nueva Credencial",
    save_changes: "Actualizar",
    pass_updated: "Vector de Auth Actualizado",
    register_title: "Inscripción en Plataforma",
    register_btn: "Inscribirse",
    have_account: "Entrar Seguro",
    need_account: "Nueva Inscripción",
  }
};

// --- Mock Data ---
const MOCK_ACTIVITIES: ActivityLog[] = [
  { id: '1', time: '2024-03-25 09:12:44', user: 'admin', action: 'System Boot Success', details: 'Kernel 5.15.0-generic responsive', type: 'system' },
  { id: '2', time: '2024-03-25 10:45:12', user: 'admin', action: 'User Management Access', details: 'Privileged session established', type: 'user' },
  { id: '3', time: '2024-03-25 14:15:12', user: 'misaelsoto', action: 'Remote Disk Sync', details: 'Volume us-west-prod mounted', type: 'system' },
  { id: '4', time: '2024-03-25 15:20:00', user: 'guest_test', action: 'Unauthorized Write Blocked', details: 'Write permission denied on /etc/', type: 'auth' },
];

const MOCK_FILES: FileItem[] = [
  { id: '1', name: 'documents', type: 'folder', modified: '2024-03-20 10:00' },
  { id: '2', name: 'backups', type: 'folder', modified: '2024-03-19 15:30' },
  { id: '3', name: 'config.yaml', type: 'file', size: '1.2 KB', modified: '2024-03-25 09:15' },
  { id: '4', name: 'server_key.pem', type: 'file', size: '2.4 KB', modified: '2024-03-24 16:45' },
  { id: '5', name: 'logs.txt', type: 'file', size: '450 KB', modified: '2024-03-25 14:00' },
];

const MOCK_SERVERS: Server[] = [
  { id: '1', name: 'us-west-prod', ip: '192.168.1.10', status: 'online', cpu: 24, memory: 45, location: 'San Francisco' },
  { id: '2', name: 'eu-central-bk', ip: '10.0.5.21', status: 'online', cpu: 12, memory: 30, location: 'Frankfurt' },
  { id: '3', name: 'dev-sandbox', ip: '172.16.0.5', status: 'warning', cpu: 89, memory: 92, location: 'Remote' },
  { id: '4', name: 'db-cluster-01', ip: '192.168.1.50', status: 'online', cpu: 15, memory: 78, location: 'Ashburn' },
];

const MOCK_USERS: User[] = [
  { id: '1', username: 'admin', role: 'admin', lastLogin: '2 mins ago', status: 'active' },
  { id: '2', username: 'misaelsoto', role: 'admin', lastLogin: '1 hour ago', status: 'active' },
  { id: '3', username: 'dev_user_01', role: 'user', lastLogin: 'Yesterday', status: 'active' },
  { id: '4', username: 'guest_test', role: 'user', lastLogin: '3 days ago', status: 'inactive' },
];

const MOCK_LOGS: LogEntry[] = [
  { id: '1', timestamp: '2024-03-25 14:30:21', user: 'admin', action: 'Modified sshd_config', result: 'success' },
  { id: '2', timestamp: '2024-03-25 14:28:05', user: 'guest_test', action: 'Failed login attempt', result: 'failure' },
  { id: '3', timestamp: '2024-03-25 14:15:12', user: 'misaelsoto', action: 'Connected to us-west-prod', result: 'success' },
  { id: '4', timestamp: '2024-03-25 13:55:40', user: 'root', action: 'Package update (apt)', result: 'success' },
];

// --- Components ---

const Sidebar = ({ activeTab, setTab, lang, t, onLogout, userRole }: { activeTab: Tab, setTab: (t: Tab) => void, lang: Lang, t: any, onLogout: () => void, userRole: UserRole }) => {
  const adminItems: { id: Tab, icon: any, label: string }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: t.dashboard },
    { id: 'users', icon: Users, label: t.users },
    { id: 'logs', icon: Activity, label: t.logs },
    { id: 'settings', icon: Settings, label: t.settings },
  ];

  const userItems: { id: Tab, icon: any, label: string }[] = [
    { id: 'my_server', icon: HardDrive, label: t.my_server },
    { id: 'logs', icon: Activity, label: t.logs },
  ];

  const items = userRole === 'admin' ? adminItems : userItems;

  return (
    <div className="w-64 border-r border-[var(--line)] flex flex-col h-screen bg-white">
      <div className="p-6 flex items-center gap-3 border-b border-[var(--line)]">
        <div className="bg-[var(--brand)] p-2 rounded">
          <Shield className="text-white w-5 h-5" />
        </div>
        <span className="font-bold tracking-tight text-lg uppercase">PSV SERVIDOR</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
              activeTab === item.id 
                ? 'bg-[var(--ink)] text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[var(--line)]">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          {t.logout}
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, subtext, color }: any) => (
  <div className="data-cell bg-white group hover:bg-[var(--ink)] transition-colors duration-200">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded bg-gray-50 group-hover:bg-gray-800 transition-colors`}>
        <Icon className={`w-5 h-5 ${color} group-hover:text-blue-400`} />
      </div>
      <span className="col-header group-hover:text-gray-400">Live Status</span>
    </div>
    <div className="space-y-1">
      <h4 className="text-3xl font-light tracking-tight group-hover:text-white transition-colors">{value}</h4>
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 group-hover:text-gray-500">{label}</p>
    </div>
    {subtext && <p className="mt-4 text-[11px] text-gray-500 group-hover:text-gray-400 font-mono italic">{subtext}</p>}
  </div>
);

const DashboardContent = ({ t, activeServer, activities }: { t: any, activeServer: Server, activities: ActivityLog[] }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 data-grid">
        <StatCard 
          icon={Terminal} 
          label={t.sessions} 
          value="1" 
          subtext="Active Secure Tunnel" 
          color="text-blue-600"
        />
        <StatCard 
          icon={Cpu} 
          label={t.cpu} 
          value={`${activeServer.cpu}%`} 
          subtext="Real-time Load" 
          color="text-green-600"
        />
        <StatCard 
          icon={HardDrive} 
          label={t.disk} 
          value="1.2 TB" 
          subtext="Available Partition" 
          color="text-orange-600"
        />
        <StatCard 
          icon={Network} 
          label={t.traffic} 
          value="452 GB" 
          subtext="Throughput" 
          color="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="font-serif italic text-xl opacity-80">{t.connected_servers}</h3>
            <div className="flex items-center gap-2 text-xs font-mono text-green-600">
              <Circle className="w-2 h-2 fill-current" />
              STABLE CONNECTION
            </div>
          </div>
          <div className="data-grid bg-white p-6 border border-[var(--line)]">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h4 className="text-2xl font-bold tracking-tight mb-1">{activeServer.name}</h4>
                <p className="font-mono text-gray-400 text-sm">{activeServer.ip}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Location</p>
                <p className="text-sm italic font-serif">{activeServer.location}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Uptime</p>
                <p className="text-lg font-mono">14d 05h 22m</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Node Status</p>
                <p className="text-lg font-bold text-green-600 uppercase tracking-tighter">Operational</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Auth Method</p>
                <p className="text-lg font-mono">ED25519_KEY</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-serif italic text-xl opacity-80">{t.security_logs}</h3>
          <div className="data-grid bg-white">
            {activities.slice(0, 6).map(log => (
              <div key={log.id} className="p-4 border-b border-[var(--line)] border-r border-[var(--line)] space-y-1 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between text-[10px] font-mono text-gray-400">
                  <span>{log.time}</span>
                  <span className="uppercase">{log.type}</span>
                </div>
                <p className="text-xs font-bold leading-tight">{log.action}</p>
                <p className="text-[10px] text-gray-500 tracking-tight italic">By: {log.user}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FileExplorer = ({ t, onLogActivity, currentUser }: { t: any, onLogActivity: (action: string, details: string, type: any) => void, currentUser: string }) => {
  const [files, setFiles] = useState<FileItem[]>(MOCK_FILES);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = () => {
    const filename = `doc_${files.length + 1}.txt`;
    const newFile: FileItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: filename,
      type: 'file',
      size: '1 KB',
      modified: new Date().toLocaleString()
    };
    setFiles([newFile, ...files]);
    onLogActivity(`Created file: ${filename}`, `System volume extension`, 'file');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      const sizeInKb = (uploadedFile.size / 1024).toFixed(1);
      const newFile: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: uploadedFile.name,
        type: 'file',
        size: `${sizeInKb} KB`,
        modified: new Date().toLocaleString()
      };
      setFiles([newFile, ...files]);
      onLogActivity(`Uploaded file: ${uploadedFile.name}`, `Size: ${sizeInKb} KB`, 'file');
    }
  };

  const handleDownload = (file: FileItem) => {
    const element = document.createElement("a");
    const content = `Contenido del archivo: ${file.name}\nTipo: ${file.type}\nTamaño: ${file.size}\nFecha: ${file.modified}`;
    const fileBlob = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(fileBlob);
    element.download = file.name.endsWith('.txt') || file.name.includes('.') ? file.name : `${file.name}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onLogActivity(`Downloaded file: ${file.name}`, `Source archive extraction`, 'file');
  };

  const handleDelete = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      setFiles(files.filter(f => f.id !== id));
      onLogActivity(`Deleted file: ${file.name}`, `Permanent storage removal`, 'file');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
      />
      
      <div className="flex justify-between items-center text-sm mb-4 bg-blue-50 p-4 border border-blue-100 rounded-lg">
        <div className="flex items-center gap-3 text-blue-700">
          <Circle className="w-2 h-2 fill-green-500 text-green-500" />
          <span className="font-bold">Active Link: us-west-prod (192.168.1.10)</span>
        </div>
        <span className="text-blue-600 font-mono text-xs">Uptime: 14d 05h 22m</span>
      </div>

      <div className="flex justify-between items-center text-sm bg-gray-50 p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2 text-gray-500">
          <Users className="w-4 h-4" />
          <span>Operator: <span className="font-bold text-gray-900">{currentUser}</span></span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Activity className="w-4 h-4" />
          <span>Live Tracking Active</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="font-serif italic text-2xl">{t.file_explorer}</h3>
          <p className="text-sm text-gray-500">{t.explorer_desc}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest border border-gray-200 rounded hover:bg-gray-50 transition-all bg-white"
          >
            <FilePlus className="w-4 h-4" /> {t.new_file}
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest bg-[var(--ink)] text-white rounded hover:opacity-90 transition-all shadow-md"
          >
            <Upload className="w-4 h-4" /> {t.upload}
          </button>
        </div>
      </div>

      <div className="data-grid bg-white border border-[var(--line)]">
        <div className="grid grid-cols-12 bg-gray-50 border-b border-[var(--line)]">
          <div className="col-span-6 col-header p-4 border-r border-[var(--line)]">{t.name}</div>
          <div className="col-span-2 col-header p-4 border-r border-[var(--line)]">{t.size}</div>
          <div className="col-span-3 col-header p-4 border-r border-[var(--line)]">{t.modified}</div>
          <div className="col-span-1 col-header p-4"></div>
        </div>

        {files.map((file) => (
          <div key={file.id} className="grid grid-cols-12 hover:bg-gray-50 transition-colors border-b last:border-b-0 border-[var(--line)] group">
            <div className="col-span-6 p-4 border-r border-[var(--line)] flex items-center gap-3">
              {file.type === 'folder' ? (
                <Folder className="w-5 h-5 text-blue-400 fill-blue-50" />
              ) : (
                <File className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-sm font-medium">{file.name}</span>
            </div>
            <div className="col-span-2 p-4 border-r border-[var(--line)] flex items-center text-xs font-mono text-gray-500">
              {file.size || '--'}
            </div>
            <div className="col-span-3 p-4 border-r border-[var(--line)] flex items-center text-xs text-gray-400 font-serif italic">
              {file.modified}
            </div>
            <div className="col-span-1 p-4 flex items-center justify-around">
               <button 
                onClick={() => handleDownload(file)}
                className="text-gray-400 hover:text-[var(--brand)] transition-colors"
                title={t.download}
               >
                  <Download className="w-4 h-4" />
               </button>
               <button 
                onClick={() => handleDelete(file.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title={t.delete}
               >
                  <Trash2 className="w-4 h-4" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChangePasswordModal = ({ isOpen, onClose, username, t }: { isOpen: boolean, onClose: () => void, username: string, t: any }) => {
  const [newPassword, setNewPassword] = useState('');
  const [showToast, setShowToast] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-sm border border-[var(--line)] shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-[var(--line)] bg-gray-50 flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-gray-600">
            <Lock className="w-4 h-4" />
            {t.change_password}
          </h3>
          <span className="text-[10px] font-mono text-gray-400">{username}</span>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">{t.new_password}</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-[var(--line)] rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-2 text-xs font-bold uppercase border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              {t.cancel}
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 py-2 text-xs font-bold uppercase bg-[var(--ink)] text-white rounded hover:opacity-90 transition-all"
            >
              {t.save_changes}
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {showToast && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="absolute bottom-4 left-4 right-4 bg-green-600 text-white p-3 rounded text-[10px] font-bold uppercase tracking-widest text-center shadow-lg"
            >
              {t.pass_updated}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const Header = ({ tab, lang, setLang, t, userRole }: { tab: string, lang: Lang, setLang: (l: Lang) => void, t: any, userRole: UserRole }) => (
  <header className="h-16 border-b border-[var(--line)] bg-white flex items-center justify-between px-8">
    <div className="flex items-center gap-4">
      <h2 className="text-sm font-bold uppercase tracking-[0.2em]">{tab}</h2>
      <div className="h-4 w-[1px] bg-[var(--line)]"></div>
      <div className="flex items-center gap-2 text-xs text-gray-400 italic">
        <Activity className="w-3 h-3 text-green-500" />
        {t.system_operational}
      </div>
    </div>

    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2 border border-[var(--line)] rounded-lg px-2 py-1 bg-gray-50">
        <Globe className="w-3.5 h-3.5 text-gray-400" />
        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value as Lang)}
          className="text-xs font-bold uppercase tracking-tight focus:outline-none bg-transparent cursor-pointer"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>

      <div className="relative group">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder={t.search} 
          className="bg-gray-50 border border-[var(--line)] rounded-full py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)] w-32 focus:w-48 transition-all lg:w-40 lg:focus:w-64"
        />
      </div>
      <button className="relative">
        <Bell className="w-5 h-5 text-gray-600" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
      </button>
        <div className="flex items-center gap-3 pl-4 border-l border-[var(--line)]">
        <div className="text-right">
          <p className="text-xs font-bold leading-none">{userRole === 'admin' ? 'Misael Soto' : 'Invitado PSV'}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{userRole === 'admin' ? 'Root Admin' : 'Standard User'}</p>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-inner ${userRole === 'admin' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
          {userRole === 'admin' ? 'MS' : 'IP'}
        </div>
      </div>
    </div>
  </header>
);

const LoginScreen = ({ lang, setLang, t, onLogin }: { lang: Lang, setLang: (l: Lang) => void, t: any, onLogin: (username: string, role: UserRole) => void }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState(selectedRole === 'admin' ? 'admin' : 'cliente_psv');

  useEffect(() => {
    setUsername(selectedRole === 'admin' ? 'admin' : 'cliente_psv');
  }, [selectedRole]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg)]">
      <div className="mb-8 flex items-center gap-3">
         <button 
          onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[var(--line)] rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-50"
        >
          <Globe className="w-3.5 h-3.5" />
          {lang === 'en' ? 'Español' : 'English'}
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white p-10 border border-[var(--line)] shadow-2xl space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-[var(--brand)] rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
            <Shield className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif italic">{isRegistering ? t.register_title : t.login_title}</h1>
          <p className="text-xs text-gray-400 uppercase tracking-[0.2em] font-bold">
            {isRegistering ? 'Create new credentials' : 'Secure Access Portal'}
          </p>
        </div>

        <div className="space-y-4">
          {!isRegistering && (
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setSelectedRole('admin')}
                className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${selectedRole === 'admin' ? 'bg-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {t.role_admin}
              </button>
              <button 
                onClick={() => setSelectedRole('user')}
                className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${selectedRole === 'user' ? 'bg-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {t.role_user}
              </button>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">{t.username_label}</label>
            <div className="relative">
              <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50 border border-[var(--line)] rounded px-10 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand)]" 
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">{t.password_label}</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                defaultValue="password"
                className="w-full bg-gray-50 border border-[var(--line)] rounded px-10 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand)]" 
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => onLogin(username, isRegistering ? 'user' : selectedRole)}
            className="w-full bg-[var(--ink)] text-white py-3 font-bold uppercase tracking-[0.3em] text-xs hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            {isRegistering ? t.register_btn : t.login_btn}
          </button>

          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="w-full text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[var(--brand)] transition-colors"
          >
            {isRegistering ? t.have_account : t.need_account}
          </button>
        </div>

        <p className="text-center text-[10px] text-gray-400 font-mono italic">
          v2.4.0-stable | build_2024.03
        </p>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [lang, setLang] = useState<Lang>('es');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [currentUser, setCurrentUser] = useState('');
  const [activities, setActivities] = useState<ActivityLog[]>(MOCK_ACTIVITIES);
  const [servers, setServers] = useState<Server[]>(MOCK_SERVERS);
  const [passwordModal, setPasswordModal] = useState({ isOpen: false, username: '' });

  const t = translations[lang];

  const handleLogActivity = (action: string, details: string, type: 'file' | 'user' | 'system' | 'auth' = 'system') => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleString(),
      user: currentUser || 'system',
      action,
      details,
      type
    };
    setActivities(prev => [newLog, ...prev]);
  };

  const handleLogin = (username: string, role: UserRole) => {
    setUserRole(role);
    setCurrentUser(username);
    setIsLoggedIn(true);
    setActiveTab(role === 'admin' ? 'dashboard' : 'my_server');
    
    // Log the login
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleString(),
      user: username,
      action: 'Initial Platform Entry',
      details: `Successful login as ${role}`,
      type: 'auth'
    };
    setActivities(prev => [newLog, ...prev]);
  };

  // Guard to prevent users from accessing admin tabs
  useEffect(() => {
    const adminTabs: Tab[] = ['dashboard', 'users', 'settings'];
    if (isLoggedIn && userRole === 'user' && adminTabs.includes(activeTab)) {
       setActiveTab('my_server');
    }
  }, [activeTab, userRole, isLoggedIn]);

  if (!isLoggedIn) {
    return <LoginScreen lang={lang} setLang={setLang} t={t} onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      <ChangePasswordModal 
        isOpen={passwordModal.isOpen}
        onClose={() => setPasswordModal({ ...passwordModal, isOpen: false })}
        username={passwordModal.username}
        t={t}
      />
      <Sidebar 
        activeTab={activeTab} 
        setTab={setActiveTab} 
        lang={lang} 
        t={t} 
        onLogout={() => setIsLoggedIn(false)} 
        userRole={userRole}
      />
      
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50 overflow-y-auto">
        <Header tab={t[activeTab as keyof typeof t] || activeTab} lang={lang} setLang={setLang} t={t} userRole={userRole} />
        
        <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <DashboardContent t={t} activeServer={servers[0]} activities={activities} />}
              {activeTab === 'my_server' && <FileExplorer t={t} onLogActivity={handleLogActivity} currentUser={currentUser} />}
              {activeTab === 'users' && (
                 <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-serif italic text-2xl">{t.access_control}</h3>
                      <button className="bg-[var(--brand)] text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-all hover:shadow-lg">{t.invite_user}</button>
                    </div>
                    <div className="data-grid bg-white">
                      <div className="grid grid-cols-5 bg-gray-50 border-b border-[var(--line)]">
                        {[t.username, t.role, t.status, t.last_login, ''].map(h => (
                          <div key={h} className="col-header p-4 border-r last:border-r-0 border-[var(--line)] text-center">{h}</div>
                        ))}
                      </div>
                      {MOCK_USERS.map(user => (
                        <div key={user.id} className="grid grid-cols-5 hover:bg-gray-50 transition-colors border-b last:border-b-0 border-[var(--line)]">
                          <div className="p-4 border-r border-[var(--line)] font-medium text-sm flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            {user.username}
                          </div>
                          <div className="p-4 border-r border-[var(--line)] flex items-center">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                              user.role === 'admin' ? 'border-orange-200 text-orange-700 bg-orange-50' : 'border-gray-200 text-gray-600 bg-gray-50'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                          <div className="p-4 border-r border-[var(--line)] flex items-center">
                            <div className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                              <span className="text-xs capitalize">{user.status}</span>
                            </div>
                          </div>
                          <div className="p-4 border-r border-[var(--line)] text-[10px] font-mono text-gray-400 italic">
                            {user.lastLogin}
                          </div>
                          <div className="p-4 flex items-center justify-center gap-2">
                            <button 
                              onClick={() => setPasswordModal({ isOpen: true, username: user.username })}
                              className="p-1.5 hover:bg-gray-200 rounded transition-colors text-gray-500 hover:text-[var(--brand)]"
                              title={t.change_password}
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
              )}
              {activeTab === 'logs' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h3 className="font-serif italic text-2xl">{t.journal}</h3>
                      <p className="text-sm text-gray-500">Comprehensive system event tracking</p>
                    </div>
                  </div>
                  
                  <div className="data-grid bg-white border border-[var(--line)]">
                    <div className="grid grid-cols-12 bg-gray-50 border-b border-[var(--line)]">
                      <div className="col-span-3 col-header p-4 border-r border-[var(--line)]">Timestamp</div>
                      <div className="col-span-2 col-header p-4 border-r border-[var(--line)]">Actor</div>
                      <div className="col-span-1 col-header p-4 border-r border-[var(--line)]">Type</div>
                      <div className="col-span-6 col-header p-4">Activity Description</div>
                    </div>

                    {activities.map((log) => (
                      <div key={log.id} className="grid grid-cols-12 hover:bg-gray-50 transition-colors border-b last:border-b-0 border-[var(--line)] group">
                        <div className="col-span-3 p-4 border-r border-[var(--line)] flex items-center font-mono text-[10px] text-gray-500">
                          {log.time}
                        </div>
                        <div className="col-span-2 p-4 border-r border-[var(--line)] flex items-center">
                          <span className="text-xs font-bold">{log.user}</span>
                        </div>
                        <div className="col-span-1 p-4 border-r border-[var(--line)] flex items-center justify-center">
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                            log.type === 'auth' ? 'border-red-200 text-red-700 bg-red-50' :
                            log.type === 'file' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                            log.type === 'user' ? 'border-orange-200 text-orange-700 bg-orange-50' :
                            'border-gray-200 text-gray-600 bg-gray-50'
                          }`}>
                            {log.type}
                          </span>
                        </div>
                        <div className="col-span-6 p-4">
                          <p className="text-sm font-medium">{log.action}</p>
                          <p className="text-[10px] text-gray-400 italic">{log.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="max-w-2xl bg-white border border-[var(--line)] p-8">
                  <h3 className="font-serif italic text-2xl mb-8">{t.configuration}</h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center py-4 border-b border-gray-100">
                      <div>
                        <p className="text-sm font-bold">{t.tfa}</p>
                        <p className="text-xs text-gray-500">{t.tfa_desc}</p>
                      </div>
                      <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow transition-all"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-gray-100">
                      <div>
                        <p className="text-sm font-bold">{t.retention}</p>
                        <p className="text-xs text-gray-500">{t.retention_desc}</p>
                      </div>
                      <select className="text-xs font-bold border rounded p-1">
                        <option>30 {t.days}</option>
                        <option selected>90 {t.days}</option>
                        <option>365 {t.days}</option>
                      </select>
                    </div>
                    <div className="pt-4">
                      <button className="bg-red-600 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-red-700 transition-colors">{t.wipe}</button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
