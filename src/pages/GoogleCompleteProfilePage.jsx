import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { completeGoogleRegistration } from "../services/authService";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";

export default function GoogleCompleteProfilePage() {
  const [selectedProfile, setSelectedProfile] = useState("FAMILY");
  const [phone, setPhone] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const profiles = [
    {
      id: "FAMILY",
      label: "Familiar",
      icon: "family_restroom",
      description: "Gerencie o ambiente, monitore idosos e convide cuidadores.",
    },
    {
      id: "CAREGIVER",
      label: "Cuidador",
      icon: "medical_services",
      description: "Acompanhe e conclua atividades diárias de idosos monitorados.",
    },
    {
      id: "ELDERLY",
      label: "Idoso",
      icon: "elderly",
      description: "Acompanhe seus sinais vitais e interaja com suas rotinas.",
    },
  ];

  const handlePhoneFormat = (e) => {
    const rawValue = e.target.value;
    const digits = rawValue.replace(/\D/g, "");

    setPhone(digits);

    let formattedValue = "";

    if (digits.length > 10) {
      formattedValue = digits.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    } else if (digits.length > 6) {
      formattedValue = digits.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
    } else if (digits.length > 2) {
      formattedValue = digits.replace(/^(\d{2})(\d{0,4})$/, "($1) $2");
    } else if (digits.length > 0) {
      formattedValue = digits.replace(/^(\d{0,2})$/, "($1");
    }

    setFormattedPhone(formattedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      profile: selectedProfile,
      ...(phone ? { phone } : {}),
      ...(code.trim() ? { code: code.trim().toUpperCase() } : {}),
    };

    try {
      await completeGoogleRegistration(payload);
      await useAuthStore.getState().fetchUser();
      useToastStore.getState().showToast("Perfil definido com sucesso! Bem-vindo ao Vita Auxilium.", "success");
      navigate("/home", { replace: true });
    } catch (err) {
      console.error(err);
      useToastStore.getState().showToast(
        err?.response?.data?.detail || "Erro ao definir perfil. Tente novamente.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface dark:bg-[#191c1b] text-on-surface dark:text-[#e1e3e0] min-h-screen flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-[#2e312f]/80 backdrop-blur-xl top-0 z-50 shadow-[0_8px_32px_rgba(0,79,81,0.05)] border-b border-surface-container-low dark:border-[#3e4949] transition-colors duration-300">
        <div className="flex flex-col items-center justify-center w-full px-6 py-8 max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-[#8ed2d4]">
            Vita Auxilium
          </h1>
          <p className="text-secondary dark:text-[#b4cbcb] text-sm font-medium mt-1 uppercase tracking-widest">
            Cuidado e Dignidade
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          <div className="bg-surface-container-lowest dark:bg-[#2e312f] rounded-3xl p-8 md:p-12 shadow-[0_24px_48px_rgba(0,79,81,0.08)] border border-outline-variant/10 dark:border-[#3e4949] transition-colors duration-300">
            {/* Título & Badge de login Google */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-[#8ed2d4]/10 text-primary dark:text-[#8ed2d4] text-sm font-semibold mb-4">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Autenticado via Google
              </div>
              <h2 className="text-3xl font-bold text-primary dark:text-[#8ed2d4] mb-3 transition-colors duration-300">
                Selecione o seu Perfil
              </h2>
              <p className="text-secondary dark:text-[#b4cbcb] text-lg leading-relaxed transition-colors duration-300">
                Sua conta do Google foi conectada. Escolha como você atuará na plataforma para personalizar sua experiência.
              </p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Seleção de Perfil com Cards Detalhados */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-primary dark:text-[#8ed2d4] block px-1 transition-colors duration-300">
                  Tipo de perfil *
                </label>
                <div className="flex flex-col gap-3">
                  {profiles.map((profile) => (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => setSelectedProfile(profile.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-4 cursor-pointer ${
                        selectedProfile === profile.id
                          ? "border-primary dark:border-[#8ed2d4] bg-primary-fixed-dim/20 dark:bg-[#8ed2d4]/10 text-primary dark:text-[#8ed2d4]"
                          : "border-outline-variant dark:border-[#3e4949] bg-transparent text-secondary dark:text-[#b4cbcb] hover:border-primary/50 dark:hover:border-[#8ed2d4]/50"
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl p-2 rounded-xl bg-primary/10 dark:bg-[#8ed2d4]/10 text-primary dark:text-[#8ed2d4]">
                        {profile.icon}
                      </span>
                      <div className="flex-1">
                        <div className="font-bold text-base flex items-center justify-between">
                          <span>{profile.label}</span>
                          {selectedProfile === profile.id && (
                            <span className="material-symbols-outlined text-primary dark:text-[#8ed2d4]">
                              check_circle
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-secondary dark:text-[#8ea0a0] mt-1">
                          {profile.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Telefone */}
              <div className="group">
                <label
                  className="block text-sm font-semibold text-secondary dark:text-[#b4cbcb] mb-1.5 ml-1 transition-colors group-focus-within:text-primary dark:group-focus-within:text-[#8ed2d4]"
                  htmlFor="phone"
                >
                  Telefone (Opcional)
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-[#8ea0a0]">
                    phone
                  </span>
                  <input
                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-surface-container-low dark:bg-[#3e4949] dark:text-[#e1e3e0] border-transparent focus:border-primary dark:focus:border-[#8ed2d4] focus:bg-white dark:focus:bg-[#3e4949] focus:ring-4 focus:ring-primary/10 dark:focus:ring-[#8ed2d4]/10 transition-all placeholder:text-outline-variant dark:placeholder:text-[#8ea0a0]"
                    id="phone"
                    placeholder="(99) 99999-9999"
                    type="tel"
                    value={formattedPhone}
                    onChange={handlePhoneFormat}
                    maxLength={15}
                  />
                </div>
              </div>

              {/* Código de ambiente */}
              <div className="pt-2">
                <div className="group p-5 rounded-2xl bg-tertiary-container/5 dark:bg-[#515b8e]/10 border border-tertiary/10 dark:border-[#515b8e]/20 transition-colors duration-300">
                  <label
                    className="block text-sm font-semibold text-tertiary dark:text-[#bac3fd] mb-2 flex items-center gap-2 transition-colors duration-300"
                    htmlFor="code"
                  >
                    <span className="material-symbols-outlined text-lg">
                      key
                    </span>
                    Código de ambiente do responsável (Opcional)
                  </label>
                  <input
                    className="w-full h-14 px-4 rounded-xl bg-white dark:bg-[#3e4949] dark:text-[#e1e3e0] border-2 border-outline-variant dark:border-[#3e4949] focus:border-tertiary dark:focus:border-[#bac3fd] focus:ring-4 focus:ring-tertiary/10 dark:focus:ring-[#bac3fd]/10 transition-all uppercase font-medium placeholder:normal-case dark:placeholder:text-[#8ea0a0]"
                    id="code"
                    placeholder="Ex: AMB-12345"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <p className="mt-2 text-xs text-secondary dark:text-[#8ea0a0] px-1 transition-colors duration-300">
                    Se você já recebeu um código de um familiar responsável, insira-o acima para conectar-se ao ambiente imediatamente.
                  </p>
                </div>
              </div>

              {/* Botão Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-gradient-to-r from-primary to-primary-container dark:from-[#005f61] dark:to-[#8ed2d4] dark:text-[#002021] text-white font-bold text-lg rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? "Concluindo..." : "Concluir Cadastro"}</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-50 dark:bg-[#191c1b] w-full py-12 border-t border-neutral-200/15 dark:border-[#3e4949] transition-colors duration-300">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 gap-6 max-w-7xl mx-auto text-sm">
          <div className="font-bold text-primary dark:text-[#8ed2d4] transition-colors duration-300">
            © 2024 Vita Auxilium. O Cuidado com Dignidade.
          </div>
          <div className="flex gap-8">
            <a className="text-neutral-500 dark:text-[#8ea0a0] hover:text-primary dark:hover:text-[#8ed2d4] transition-colors" href="#">
              Privacidade
            </a>
            <a className="text-neutral-500 dark:text-[#8ea0a0] hover:text-primary dark:hover:text-[#8ed2d4] transition-colors" href="#">
              Termos de Uso
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
