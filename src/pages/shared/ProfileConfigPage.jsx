import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useToastStore } from "../../stores/toastStore";
import { userService } from "../../services/userService";

/**
 * ProfileConfigPage
 * Permite ao usuário autenticado visualizar, atualizar e desativar seu perfil (CRUD de Users).
 */
export default function ProfileConfigPage() {
  const user = useAuthStore((s) => s.user);
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const logout = useAuthStore((s) => s.logout);
  const showToast = useToastStore((s) => s.showToast);
  const navigate = useNavigate();

  const [name, setName] = useState(() => user?.name || "");
  const [phone, setPhone] = useState(() => user?.phone || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  useEffect(() => {
    let active = true;
    userService
      .getMe()
      .then((me) => {
        if (!active) return;
        setName(me.name || "");
        setPhone(me.phone || "");
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      showToast("As senhas informadas não coincidem.", "error");
      return;
    }

    const payload = {
      name: name.trim(),
      phone: phone.replace(/\D/g, ""),
    };
    if (password.trim()) {
      payload.password = password.trim();
    }

    setSaving(true);
    try {
      await userService.updateMe(payload);
      await fetchUser();
      setPassword("");
      setConfirmPassword("");
      showToast("Perfil atualizado com sucesso!", "success");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Erro ao atualizar os dados do perfil.";
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      await userService.deactivateMe();
      await logout();
      showToast("Sua conta foi desativada com sucesso.", "info");
      navigate("/auth/login");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Não foi possível desativar a conta.";
      showToast(msg, "error");
    }
  };

  const profileLabels = {
    FAMILY: "Familiar / Administrador",
    CAREGIVER: "Cuidador Profissional",
    ELDERLY: "Idoso Assistido",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <header className="border-b border-outline-variant/30 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="p-2.5 bg-primary/10 text-primary dark:bg-[#8ed2d4]/20 dark:text-[#8ed2d4] rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">person</span>
          </span>
          <div>
            <h1 className="text-3xl font-extrabold text-on-surface dark:text-[#e1e3e0] tracking-tight">
              Meu Perfil
            </h1>
            <p className="text-secondary dark:text-[#b4cbcb] text-sm">
              Gerencie suas informações pessoais, telefone de contato e credenciais de acesso.
            </p>
          </div>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-surface-container-lowest dark:bg-[#252a29] rounded-[2rem] p-8 border border-outline-variant/20 shadow-xs space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="profile-email"
              className="block text-xs font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb] mb-2"
            >
              E-mail da Conta
            </label>
            <input
              id="profile-email"
              type="email"
              disabled
              autoComplete="email"
              value={user?.email || ""}
              className="w-full h-12 px-4 rounded-xl bg-surface-container dark:bg-[#1e2221] text-secondary dark:text-[#8ea0a0] border border-outline-variant/20 cursor-not-allowed text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="profile-role"
              className="block text-xs font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb] mb-2"
            >
              Perfil de Acesso
            </label>
            <input
              id="profile-role"
              type="text"
              disabled
              value={profileLabels[user?.profile] || user?.profile || "Familiar"}
              className="w-full h-12 px-4 rounded-xl bg-surface-container dark:bg-[#1e2221] text-secondary dark:text-[#8ea0a0] border border-outline-variant/20 cursor-not-allowed text-sm font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="profile-name"
              className="block text-xs font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb] mb-2"
            >
              Nome Completo
            </label>
            <input
              id="profile-name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-surface-container-low dark:bg-[#2e3433] text-on-surface dark:text-[#e1e3e0] border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="profile-phone"
              className="block text-xs font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb] mb-2"
            >
              Telefone (apenas números, 10 ou 11 dígitos)
            </label>
            <input
              id="profile-phone"
              type="tel"
              required
              autoComplete="tel"
              maxLength={15}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="11999999999"
              className="w-full h-12 px-4 rounded-xl bg-surface-container-low dark:bg-[#2e3433] text-on-surface dark:text-[#e1e3e0] border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-outline-variant/20">
          <h3 className="text-sm font-bold text-on-surface dark:text-[#e1e3e0] mb-4">
            Alterar Senha (opcional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="profile-password"
                className="block text-xs font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb] mb-2"
              >
                Nova Senha
              </label>
              <input
                id="profile-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Deixe em branco para manter a atual"
                className="w-full h-12 px-4 rounded-xl bg-surface-container-low dark:bg-[#2e3433] text-on-surface dark:text-[#e1e3e0] border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="profile-confirm-password"
                className="block text-xs font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb] mb-2"
              >
                Confirmar Nova Senha
              </label>
              <input
                id="profile-confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                className="w-full h-12 px-4 rounded-xl bg-surface-container-low dark:bg-[#2e3433] text-on-surface dark:text-[#e1e3e0] border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-2xl bg-primary text-on-primary hover:bg-primary-container font-bold text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-lg">save</span>
            <span>{saving ? "Salvando..." : "Salvar Alterações"}</span>
          </button>
        </div>
      </form>

      {/* Zona de Desativação de Conta */}
      <section className="bg-error-container/25 dark:bg-red-950/20 rounded-[2rem] p-6 border border-error/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-error dark:text-red-300">
            Desativar Minha Conta
          </h3>
          <p className="text-xs text-secondary dark:text-[#b4cbcb] mt-1">
            Sua conta será desativada logicamente preservando o histórico de auditoria dos ambientes.
          </p>
        </div>
        {!confirmDeactivate ? (
          <button
            type="button"
            onClick={() => setConfirmDeactivate(true)}
            className="px-5 py-2.5 rounded-xl bg-error/10 hover:bg-error/20 text-error dark:text-red-300 text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            Desativar Conta
          </button>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setConfirmDeactivate(false)}
              className="px-4 py-2 rounded-xl bg-surface-container text-secondary text-xs font-bold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDeactivate}
              className="px-4 py-2 rounded-xl bg-error text-on-error text-xs font-bold cursor-pointer"
            >
              Confirmar Desativação
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
