/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
type Tab = 'dashboard' | 'users' | 'servers' | 'logs' | 'settings' | 'my_server';
type Lang = 'en' | 'es';
type UserRole = 'admin' | 'user';

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
    dashboard: "Dashboard",
    servers: "Servers",
    users: "Users",
    logs: "Activity",
    settings: "Settings",
    my_server: "My Server",
    logout: "Logout",
    sessions: "Active Sessions",
    cpu: "CPU Avg Load",
    disk: "Disk Usage",
    traffic: "Traffic (24h)",
    connected_servers: "Connected Servers",
    view_all: "View All",
    security_logs: "Security Logs",
    system_operational: "System Operational",
    search: "Global Search...",
    access_control: "Access Control",
    invite_user: "Invite User",
    journal: "System Journal",
    configuration: "System Configuration",
    tfa: "Two-Factor Authentication",
    tfa_desc: "Require 2FA for all administrative logins.",
    retention: "Log Retention",
    retention_desc: "Store detailed activity logs for 90 days.",
    wipe: "Wipe All Configs",
    login_title: "PSV Server Login",
    username_label: "Username",
    password_label: "Password",
    login_btn: "Login",
    username: "Username",
    role: "Role",
    status: "Status",
    last_login: "Last Login",
    server_mgmt: "Server Management",
    server_mgmt_desc: "Provision, monitor, and SSH into your infrastructure.",
    add_server: "Add Server",
    server_name: "Server Name",
    ip_address: "IP Address",
    ssh_port: "Port (SSH)",
    ssh_username: "Username",
    ssh_password: "Password / Key",
    save_server: "Connect & Save",
    cancel: "Cancel",
    new_server_title: "Add New SSH Server",
    tailing: "tailing logs...",
    days: "Days",
    file_explorer: "File Explorer",
    explorer_desc: "Manage your documents and server files.",
    new_file: "New File",
    upload: "Upload",
    download: "Download",
    delete: "Delete",
    name: "Name",
    size: "Size",
    modified: "Modified",
    role_admin: "Administrator",
    role_user: "Client / User",
    change_password: "Change Password",
    new_password: "New Password",
    save_changes: "Save Changes",
    pass_updated: "Password updated successfully"
  },
  es: {
    dashboard: "Tablero",
    servers: "Servidores",
    users: "Usuarios",
    logs: "Actividad",
    settings: "Ajustes",
    my_server: "Mi Servidor",
    logout: "Cerrar Sesión",
    sessions: "Sesiones Activas",
    cpu: "Carga de CPU",
    disk: "Uso de Disco",
    traffic: "Tráfico (24h)",
    connected_servers: "Servidores Conectados",
    view_all: "Ver Todo",
    security_logs: "Logs de Seguridad",
    system_operational: "Sistema Operativo",
    search: "Búsqueda Global...",
    access_control: "Control de Acceso",
    invite_user: "Invitar Usuario",
    journal: "Diario del Sistema",
    configuration: "Configuración del Sistema",
    tfa: "Autenticación 2FA",
    tfa_desc: "Requerir 2FA para todos los inicios de sesión admin.",
    retention: "Retención de Logs",
    retention_desc: "Guardar logs detallados por 90 días.",
    wipe: "Borrar Todas las Configs",
    login_title: "Inicio de Sesión PSV Server",
    username_label: "Usuario",
    password_label: "Contraseña",
    login_btn: "Entrar",
    username: "Usuario",
    role: "Rol",
    status: "Estado",
    last_login: "Último Acceso",
    server_mgmt: "Gestión de Servidores",
    server_mgmt_desc: "Provee, monitorea y entra vía SSH a tu infraestructura.",
    add_server: "Agregar Servidor",
    server_name: "Nombre del Servidor",
    ip_address: "Dirección IP",
    ssh_port: "Puerto (SSH)",
    ssh_username: "Usuario",
    ssh_password: "Contraseña / Llave",
    save_server: "Conectar y Guardar",
    cancel: "Cancelar",
    new_server_title: "Agregar Nuevo Servidor SSH",
    tailing: "siguiendo logs...",
    days: "Días",
    file_explorer: "Explorador de Archivos",
    explorer_desc: "Gestiona tus documentos y archivos del servidor.",
    new_file: "Nuevo Archivo",
    upload: "Subir",
    download: "Descargar",
    delete: "Eliminar",
    name: "Nombre",
    size: "Tamaño",
    modified: "Modificado",
    role_admin: "Administrador",
    role_user: "Cliente / Usuario",
    change_password: "Cambiar Contraseña",
    new_password: "Nueva Contraseña",
    save_changes: "Guardar Cambios",
    pass_updated: "Contraseña actualizada con éxito"
  }
};

// --- Mock Data ---
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
    { id: 'servers', icon: Database, label: t.servers },
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
        <span className="font-bold tracking-tight text-lg uppercase">PSV SERVER</span>
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

const DashboardContent = ({ t, servers }: { t: any, servers: Server[] }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 data-grid">
        <StatCard 
          icon={Terminal} 
          label={t.sessions} 
          value="12" 
          subtext="2 super-admin, 10 users" 
          color="text-blue-600"
        />
        <StatCard 
          icon={Cpu} 
          label={t.cpu} 
          value="34%" 
          subtext="Stable across clusters" 
          color="text-green-600"
        />
        <StatCard 
          icon={HardDrive} 
          label={t.disk} 
          value="1.2 TB" 
          subtext="85% capacity reached" 
          color="text-orange-600"
        />
        <StatCard 
          icon={Network} 
          label={t.traffic} 
          value="452 GB" 
          subtext="In: 120GB | Out: 332GB" 
          color="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="font-serif italic text-xl opacity-80">{t.connected_servers}</h3>
            <button className="text-xs uppercase font-bold tracking-widest border-b border-[var(--ink)] pb-1 hover:opacity-60">{t.view_all}</button>
          </div>
          <div className="data-grid bg-white">
            <div className="grid grid-cols-4 bg-gray-50 border-b border-[var(--line)]">
              <div className="col-header p-3 border-r border-[var(--line)]">{t.username}</div>
              <div className="col-header p-3 border-r border-[var(--line)]">IP Address</div>
              <div className="col-header p-3 border-r border-[var(--line)]">{t.status}</div>
              <div className="col-header p-3">Load</div>
            </div>
            {servers.slice(0, 4).map(server => (
              <div key={server.id} className="grid grid-cols-4 hover:bg-gray-50 transition-colors group cursor-pointer">
                <div className="p-4 border-r border-[var(--line)] border-b border-[var(--line)] font-medium text-sm">{server.name}</div>
                <div className="p-4 border-r border-[var(--line)] border-b border-[var(--line)] data-value text-gray-500">{server.ip}</div>
                <div className="p-4 border-r border-[var(--line)] border-b border-[var(--line)] flex items-center gap-2">
                  <Circle className={`w-2 h-2 fill-current ${
                    server.status === 'online' ? 'text-green-500' : 
                    server.status === 'warning' ? 'text-orange-500' : 'text-red-500'
                  }`} />
                  <span className="text-xs uppercase font-bold tracking-tighter opacity-70">{server.status}</span>
                </div>
                <div className="p-4 border-b border-[var(--line)] flex items-center gap-3">
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${server.cpu > 70 ? 'bg-orange-500' : 'bg-[var(--brand)]'}`} style={{ width: `${server.cpu}%` }}></div>
                  </div>
                  <span className="data-value text-xs">{server.cpu}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-serif italic text-xl opacity-80">{t.security_logs}</h3>
          <div className="data-grid bg-white">
            {MOCK_LOGS.map(log => (
              <div key={log.id} className="p-4 border-b border-[var(--line)] border-r border-[var(--line)] space-y-2 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  <span>{log.timestamp}</span>
                  <span className={log.result === 'success' ? 'text-green-600' : 'text-red-600'}>{log.result}</span>
                </div>
                <p className="text-sm font-medium">{log.action}</p>
                <p className="text-[11px] text-gray-500">{t.username}: <span className="font-mono text-gray-900">{log.user}</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FileExplorer = ({ t }: { t: any }) => {
  const [files, setFiles] = useState<FileItem[]>(MOCK_FILES);

  const handleCreate = () => {
    const newFile: FileItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: `new_file_${files.length + 1}.txt`,
      type: 'file',
      size: '0 KB',
      modified: new Date().toLocaleString()
    };
    setFiles([newFile, ...files]);
  };

  const handleDelete = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center text-sm mb-4 bg-blue-50 p-4 border border-blue-100 rounded-lg">
        <div className="flex items-center gap-3 text-blue-700">
          <Circle className="w-2 h-2 fill-green-500 text-green-500" />
          <span className="font-bold">Conectado a: us-west-prod (192.168.1.10)</span>
        </div>
        <span className="text-blue-600 font-mono text-xs">Uptime: 14d 05h 22m</span>
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
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest bg-[var(--ink)] text-white rounded hover:opacity-90 transition-all shadow-md">
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
               <button className="text-gray-400 hover:text-[var(--brand)] transition-colors">
                  <Download className="w-4 h-4" />
               </button>
               <button 
                onClick={() => handleDelete(file.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
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

const LoginScreen = ({ lang, setLang, t, onLogin }: { lang: Lang, setLang: (l: Lang) => void, t: any, onLogin: (role: UserRole) => void }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');

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
          <h1 className="text-2xl font-serif italic">{t.login_title}</h1>
          <p className="text-xs text-gray-400 uppercase tracking-[0.2em] font-bold">Secure Access Portal</p>
        </div>

        <div className="space-y-4">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setSelectedRole('admin')}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${selectedRole === 'admin' ? 'bg-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {t.role_admin}
            </button>
            <button 
              onClick={() => setSelectedRole('user')}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${selectedRole === 'user' ? 'bg-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {t.role_user}
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">{t.username_label}</label>
            <div className="relative">
              <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                defaultValue={selectedRole === 'admin' ? 'admin' : 'cliente_psv'}
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

        <button 
          onClick={() => onLogin(selectedRole)}
          className="w-full bg-[var(--ink)] text-white py-3 font-bold uppercase tracking-[0.3em] text-xs hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          {t.login_btn}
        </button>

        <p className="text-center text-[10px] text-gray-400 font-mono italic">
          v2.4.0-stable | build_2024.03
        </p>
      </motion.div>
    </div>
  );
};

const AddServerModal = ({ isOpen, onClose, onAdd, t }: { isOpen: boolean, onClose: () => void, onAdd: (s: Server) => void, t: any }) => {
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    port: '22',
    username: '',
    password: ''
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-md border border-[var(--line)] shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-[var(--line)] bg-gray-50">
          <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[var(--brand)]" />
            {t.new_server_title}
          </h3>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">{t.server_name}</label>
              <input 
                type="text" 
                placeholder="Productive Server"
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">{t.ip_address}</label>
                <input 
                  type="text" 
                  placeholder="192.168.1.1"
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                  value={formData.ip}
                  onChange={e => setFormData({...formData, ip: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">{t.ssh_port}</label>
                <input 
                  type="text" 
                  placeholder="22"
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                  value={formData.port}
                  onChange={e => setFormData({...formData, port: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">{t.ssh_username}</label>
              <input 
                type="text" 
                placeholder="root"
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">{t.ssh_password}</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              onClick={onClose}
              className="flex-1 py-2 text-xs font-bold uppercase border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              {t.cancel}
            </button>
            <button 
              onClick={() => {
                onAdd({
                  id: Math.random().toString(36).substr(2, 9),
                  name: formData.name || formData.ip,
                  ip: formData.ip,
                  status: 'online',
                  cpu: Math.floor(Math.random() * 20) + 5,
                  memory: Math.floor(Math.random() * 30) + 10,
                  location: 'Linux / Remote'
                });
                onClose();
              }}
              className="flex-1 py-2 text-xs font-bold uppercase bg-[var(--ink)] text-white rounded hover:opacity-90 transition-all"
            >
              {t.save_server}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [lang, setLang] = useState<Lang>('es');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [servers, setServers] = useState<Server[]>(MOCK_SERVERS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [passwordModal, setPasswordModal] = useState({ isOpen: false, username: '' });

  const t = translations[lang];

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setActiveTab(role === 'admin' ? 'dashboard' : 'my_server');
  };

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
      <AddServerModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={(newServer) => setServers([...servers, newServer])}
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
              {activeTab === 'dashboard' && <DashboardContent t={t} servers={servers} />}
              {activeTab === 'my_server' && <FileExplorer t={t} />}
              {activeTab === 'servers' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h3 className="font-serif italic text-2xl">{t.server_mgmt}</h3>
                      <p className="text-sm text-gray-500">{t.server_mgmt_desc}</p>
                    </div>
                    <button 
                      onClick={() => setIsAddModalOpen(true)}
                      className="bg-[var(--ink)] text-white px-6 py-2.5 rounded font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
                    >
                      <Plus className="w-4 h-4" /> {t.add_server}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {servers.map(server => (
                      <div key={server.id} className="data-cell bg-white hover:border-[var(--brand)] transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-6">
                          <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                            <CpuIcon className="w-6 h-6 text-gray-400 group-hover:text-[var(--brand)]" />
                          </div>
                          <div className="flex items-center gap-2">
                             <Circle className={`w-2 h-2 fill-current ${
                              server.status === 'online' ? 'text-green-500' : 
                              server.status === 'warning' ? 'text-orange-500' : 'text-red-500'
                            }`} />
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{server.status}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-bold text-lg leading-tight">{server.name}</h4>
                            <p className="text-xs font-mono text-gray-400">{server.ip}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                            <div>
                              <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">CPU</p>
                              <p className="text-sm font-mono">{server.cpu}%</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Memory</p>
                              <p className="text-sm font-mono">{server.memory}%</p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                            <span>{server.location}</span>
                            <button className="text-[var(--brand)] font-bold hover:underline">SSH CONNECT</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => setIsAddModalOpen(true)}
                      className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-all bg-gray-50/50"
                    >
                      <Plus className="w-8 h-8 mb-2" />
                      <span className="text-xs font-bold uppercase tracking-widest">{t.add_server}</span>
                    </button>
                  </div>
                </div>
              )}
              {activeTab === 'users' && (
                 <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-serif italic text-2xl">{t.access_control}</h3>
                      <button className="bg-[var(--brand)] text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-all hover:shadow-lg">{t.invite_user}</button>
                    </div>
                    <div className="data-grid bg-white">
                      <div className="grid grid-cols-5 bg-gray-50 border-b border-[var(--line)]">
                        {[t.username, t.role, t.status, t.last_login, ''].map(h => (
                          <div key={h} className="col-header p-4 border-r last:border-r-0 border-[var(--line)]">{h}</div>
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
                          <div className="p-4 border-r border-[var(--line)] text-xs text-gray-500 italic font-serif">
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
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-widest mb-2 font-bold">
                    <Activity className="w-3 h-3" /> {t.journal}
                  </div>
                  <div className="bg-[var(--ink)] text-gray-300 font-mono text-xs p-6 rounded-lg shadow-2xl space-y-1.5 border border-gray-800">
                    <p className="text-blue-400">[SYSTEM] Initialization complete...</p>
                    <p className="text-green-500">[INFO] SSHD listening on port 22</p>
                    <p className="text-gray-500">2024-03-25T14:40:01Z - pam_unix(sshd:session): session opened for user admin by (uid=0)</p>
                    <p className="text-red-400">2024-03-25T14:41:05Z - Failed password for invalid user bot_778 from 45.12.89.201 port 52312 ssh2</p>
                    <p className="text-gray-500">2024-03-25T14:42:30Z - User misaelsoto connected via RSA key fingerprint SHA256:...</p>
                    <motion.p 
                      animate={{ opacity: [1, 0.5, 1] }} 
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-white border-l-2 border-white pl-2 mt-4"
                    >
                      {t.tailing} _
                    </motion.p>
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
