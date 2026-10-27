import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useEnvironmentStore } from "../stores/environmentStore";
import { useToastStore } from "../stores/toastStore";
import { getCapabilities } from "../config/profileCapabilities";

const MENU_ITEMS = [
  { to: "/home", label: "Início", icon: "home" },
  {
    to: "/monitoring",
    label: "Monitoramento",
    icon: "monitor_heart",
    capabilityKey: "canViewHealthData",
    requiresEnvironment: true,
  },
  { to: "/environments", label: "Ambientes", icon: "groups" },
  {
    to: "/activities",
    label: "Atividades",
    icon: "calendar_month",
    requiresEnvironment: true,
  },
  {
    to: "/reminders",
    label: "Lembretes",
    icon: "notifications",
    requiresEnvironment: true,
  },
  { to: "/configuration", label: "Configurações", icon: "settings" },
  { to: "/profile", label: "Perfil", icon: "account_circle" },
];

export default function SidebarLayout() {
  const { logout, user } = useAuthStore();
  const { currentEnvironment, clearEnvironment } = useEnvironmentStore();
  const { showToast } = useToastStore();
  const navigate = useNavigate();

  const profile = user?.profile || user?.role || "FAMILY";
  const capabilities = getCapabilities(profile);

  const visibleMenuItems = MENU_ITEMS.filter(
    (item) =>
      (!item.capabilityKey || capabilities[item.capabilityKey]) &&
      (!item.requiresEnvironment || currentEnvironment)
  );

  const handleLogout = () => {
    logout();
  };

  const handleSwitchEnvironment = () => {
    clearEnvironment();
    navigate("/environments");
    showToast("Selecione um novo ambiente para acessar.", "info");
  };

  const handleEmergencyClick = () => {
    showToast(
      "Chamada de emergência acionada! Enviando notificação prioritária para os familiares.",
      "error"
    );
  };

  const activeEnvName =
    currentEnvironment?.environmentName || currentEnvironment?.name || "Ambiente Ativo";

  return (
    <div className="min-h-screen bg-[#f7f9f7] dark:bg-[#191c1b] text-on-surface dark:text-[#e1e3e0]">
      {/* Clean Full-Height Sidebar */}
      <aside className="fixed left-0 top-0 h-full flex-col justify-between py-6 z-40 bg-white dark:bg-[#202524] border-r border-outline-variant/30 w-64 hidden md:flex shadow-xs">
        <div>
          {/* Logo & Header */}
          <div className="px-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary text-[#8ed2d4] rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">health_and_safety</span>
              </div>
              <div>
                <h2 className="font-headline font-extrabold text-xl text-primary dark:text-[#8ed2d4] leading-none">
                  Vita Auxilium
                </h2>
                <p className="text-[10px] text-secondary dark:text-[#b4cbcb] uppercase tracking-widest font-bold mt-1">
                  Cuidado e Dignidade
                </p>
              </div>
            </div>
          </div>

          {/* Active Environment Banner */}
          {currentEnvironment ? (
            <div className="mx-3 mb-6 p-3 rounded-2xl bg-surface-container-low dark:bg-[#191c1b] border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-primary dark:text-[#8ed2d4] text-lg flex-shrink-0">
                    house
                  </span>
                  <div className="truncate">
                    <p className="text-[9px] text-secondary dark:text-[#b4cbcb] font-bold uppercase tracking-wider">
                      Ambiente Ativo
                    </p>
                    <p className="text-xs font-bold text-on-surface dark:text-[#e1e3e0] truncate">
                      {activeEnvName}
                    </p>
                  </div>
                </div>

                {capabilities.canSwitchEnvironment && (
                  <button
                    onClick={handleSwitchEnvironment}
                    title="Trocar de ambiente"
                    className="px-2 py-1 bg-white dark:bg-[#2e312f] hover:bg-black/5 dark:hover:bg-white/10 text-primary dark:text-[#8ed2d4] text-[10px] font-bold rounded-lg border border-outline-variant/30 cursor-pointer flex-shrink-0 transition-all active:scale-95"
                  >
                    Trocar
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="mx-3 mb-6 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg flex-shrink-0">
                  info
                </span>
                <p className="text-[11px] font-semibold text-amber-900 dark:text-amber-300 leading-tight">
                  Selecione um ambiente em &quot;Ambientes&quot; para acessar o monitoramento
                </p>
              </div>
            </div>
          )}

          <nav className="space-y-1 px-3">
            {visibleMenuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-secondary dark:text-[#b4cbcb] hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary"
                  }`
                }
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Sidebar Action Group (Emergency + Logout) */}
        <div className="space-y-3 px-3 pt-4 border-t border-outline-variant/30">
          {capabilities.canTriggerEmergency ? (
            <button
              onClick={handleEmergencyClick}
              className="w-full h-12 bg-red-700 hover:bg-red-800 text-white rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all font-bold text-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">emergency</span>
              <span>EMERGÊNCIA</span>
            </button>
          ) : (
            <div className="px-2 py-1 text-center text-xs text-secondary opacity-60">
              Ambiente em Monitoramento
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-secondary dark:text-[#b4cbcb] hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary transition-all text-sm font-semibold rounded-2xl cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="md:ml-64 pt-8 pb-16 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
