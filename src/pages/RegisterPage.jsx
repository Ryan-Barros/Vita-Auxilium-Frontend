import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, loginWithGoogle } from "../services/authService";
import Toast from "../components/Toast";

export default function RegisterPage() {
  const [selectedProfile, setSelectedProfile] = useState("FAMILY");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [code, setCode] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const profiles = [
    { id: "FAMILY", label: "Familiar", icon: "family_restroom" },
    { id: "CAREGIVER", label: "Cuidador", icon: "medical_services" },
    { id: "ELDERLY", label: "Idoso", icon: "elderly" },
  ];

  const [FormattedPhone, setFormattedPhone] = useState("");

  const handlePhoneFormat = (e) => {
    const rawValue = e.target.value;
    const digits = rawValue.replace(/\D/g, "");

    setForm({ ...form, phone: digits });

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const passwordsMatch = form.password === confirmPassword;
  const showPasswordMismatch =
    confirmPassword.length > 0 && !passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) return;

    const cleanCode = code.trim().toUpperCase();
    const data = cleanCode
      ? { ...form, profile: selectedProfile, code: cleanCode }
      : { ...form, profile: selectedProfile };

    try {
      await register(data);
      navigate("/auth/login");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Erro ao criar conta. Tente novamente.";
      setToast({ type: "error", message: msg });
    }
  };

  return (
    <>
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
            {/* Card */}
            <div className="bg-surface-container-lowest dark:bg-[#2e312f] rounded-3xl p-8 md:p-12 shadow-[0_24px_48px_rgba(0,79,81,0.08)] border border-outline-variant/10 dark:border-[#3e4949] transition-colors duration-300">
              {/* Título */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary dark:text-[#8ed2d4] mb-3 transition-colors duration-300">
                  Criar nova conta
                </h2>
                <p className="text-secondary dark:text-[#b4cbcb] text-lg leading-relaxed transition-colors duration-300">
                  Junte-se à nossa comunidade para oferecer o melhor cuidado e
                  dignidade para quem você ama.
                </p>
              </div>

              {/* Botão de cadastro/login com Google */}
              <div className="mb-8">
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  className="w-full h-14 bg-white dark:bg-[#3e4949] text-on-surface dark:text-[#e1e3e0] border border-outline-variant dark:border-[#536868] rounded-2xl font-semibold text-base shadow-sm hover:shadow-md hover:bg-surface-container-low dark:hover:bg-[#4d6262] transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                  <span>Entrar com o Google</span>
                </button>

                <div className="relative flex py-4 items-center">
                  <div className="flex-grow border-t border-outline-variant/40 dark:border-[#3e4949]"></div>
                  <span className="flex-shrink mx-4 text-xs uppercase tracking-wider text-outline dark:text-[#8ea0a0] font-medium">
                    ou cadastrar com e-mail
                  </span>
                  <div className="flex-grow border-t border-outline-variant/40 dark:border-[#3e4949]"></div>
                </div>
              </div>

              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Seletor de Perfil */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-primary dark:text-[#8ed2d4] block px-1 transition-colors duration-300">
                    Selecione seu perfil
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {profiles.map((profile) => (
                      <button
                        key={profile.id}
                        type="button"
                        onClick={() => setSelectedProfile(profile.id)}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold transition-all flex items-center justify-center gap-2 ${
                          selectedProfile === profile.id
                            ? "border-primary dark:border-[#8ed2d4] bg-primary-fixed-dim/20 dark:bg-[#8ed2d4]/10 text-primary dark:text-[#8ed2d4]"
                            : "border-outline-variant dark:border-[#3e4949] bg-transparent text-secondary dark:text-[#b4cbcb] hover:border-primary/50 dark:hover:border-[#8ed2d4]/50 hover:text-primary dark:hover:text-[#8ed2d4]"
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">
                          {profile.icon}
                        </span>
                        {profile.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Campos */}
                <div className="space-y-5">
                  {/* Nome */}
                  <div className="group">
                    <label
                      className="block text-sm font-semibold text-secondary dark:text-[#b4cbcb] mb-1.5 ml-1 transition-colors group-focus-within:text-primary dark:group-focus-within:text-[#8ed2d4]"
                      htmlFor="name"
                    >
                      Nome completo
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-[#8ea0a0]">
                        person
                      </span>
                      <input
                        className="w-full h-14 pl-12 pr-4 rounded-xl bg-surface-container-low dark:bg-[#3e4949] dark:text-[#e1e3e0] border-transparent focus:border-primary dark:focus:border-[#8ed2d4] focus:bg-white dark:focus:bg-[#3e4949] focus:ring-4 focus:ring-primary/10 dark:focus:ring-[#8ed2d4]/10 transition-all placeholder:text-outline-variant dark:placeholder:text-[#8ea0a0]"
                        id="name"
                        placeholder="Ex: Maria Silva"
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* E-mail */}
                  <div className="group">
                    <label
                      className="block text-sm font-semibold text-secondary dark:text-[#b4cbcb] mb-1.5 ml-1 transition-colors group-focus-within:text-primary dark:group-focus-within:text-[#8ed2d4]"
                      htmlFor="email"
                    >
                      E-mail
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-[#8ea0a0]">
                        mail
                      </span>
                      <input
                        className="w-full h-14 pl-12 pr-4 rounded-xl bg-surface-container-low dark:bg-[#3e4949] dark:text-[#e1e3e0] border-transparent focus:border-primary dark:focus:border-[#8ed2d4] focus:bg-white dark:focus:bg-[#3e4949] focus:ring-4 focus:ring-primary/10 dark:focus:ring-[#8ed2d4]/10 transition-all placeholder:text-outline-variant dark:placeholder:text-[#8ea0a0]"
                        id="email"
                        placeholder="nome@exemplo.com"
                        type="email"
                        autoComplete="email"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        value={form.email.toLowerCase().trim()}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Telefone */}
                  <div className="group">
                    <label
                      className="block text-sm font-semibold text-secondary dark:text-[#b4cbcb] mb-1.5 ml-1 transition-colors group-focus-within:text-primary dark:group-focus-within:text-[#8ed2d4]"
                      htmlFor="phone"
                    >
                      Telefone
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
                        autoComplete="tel"
                        value={FormattedPhone}
                        onChange={handlePhoneFormat}
                        maxLength={15}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="group">
                        <label
                          className="block text-sm font-semibold text-secondary dark:text-[#b4cbcb] mb-1.5 ml-1 transition-colors group-focus-within:text-primary dark:group-focus-within:text-[#8ed2d4]"
                          htmlFor="password"
                        >
                          Senha
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-[#8ea0a0]">
                            lock
                          </span>
                          <input
                            className={`w-full h-14 pl-12 pr-12 rounded-xl bg-surface-container-low dark:bg-[#3e4949] dark:text-[#e1e3e0] border-transparent focus:border-primary dark:focus:border-[#8ed2d4] focus:bg-white dark:focus:bg-[#3e4949] focus:ring-4 focus:ring-primary/10 dark:focus:ring-[#8ed2d4]/10 transition-all placeholder:text-outline-variant dark:placeholder:text-[#8ea0a0] ${
                              showPasswordMismatch
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10 dark:border-red-400 dark:focus:border-red-400"
                                : ""
                            }`}
                            id="password"
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            value={form.password}
                            onChange={handleChange}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline dark:text-[#8ea0a0] hover:text-primary dark:hover:text-[#8ed2d4] transition-colors"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={
                              showPassword ? "Ocultar senha" : "Mostrar senha"
                            }
                          >
                            <span className="material-symbols-outlined">
                              {showPassword ? "visibility_off" : "visibility"}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Confirmar Senha */}
                      <div className="group">
                        <label
                          className="block text-sm font-semibold text-secondary dark:text-[#b4cbcb] mb-1.5 ml-1 transition-colors group-focus-within:text-primary dark:group-focus-within:text-[#8ed2d4]"
                          htmlFor="confirmPassword"
                        >
                          Confirmar Senha
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-[#8ea0a0]">
                            lock_reset
                          </span>
                          <input
                            className={`w-full h-14 pl-12 pr-12 rounded-xl bg-surface-container-low dark:bg-[#3e4949] dark:text-[#e1e3e0] border-transparent focus:border-primary dark:focus:border-[#8ed2d4] focus:bg-white dark:focus:bg-[#3e4949] focus:ring-4 focus:ring-primary/10 dark:focus:ring-[#8ed2d4]/10 transition-all placeholder:text-outline-variant dark:placeholder:text-[#8ea0a0] ${
                              showPasswordMismatch
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10 dark:border-red-400 dark:focus:border-red-400"
                                : ""
                            }`}
                            id="confirmPassword"
                            placeholder="••••••••"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline dark:text-[#8ea0a0] hover:text-primary dark:hover:text-[#8ed2d4] transition-colors"
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                            aria-label={
                              showConfirmPassword
                                ? "Ocultar senha"
                                : "Mostrar senha"
                            }
                          >
                            <span className="material-symbols-outlined">
                              {showConfirmPassword
                                ? "visibility_off"
                                : "visibility"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    {showPasswordMismatch && (
                      <div className="flex justify-center">
                        <p className="mt-2 relative text-sm text-red-600 dark:text-red-300">
                          As senhas não coincidem.
                        </p>
                      </div>
                    )}
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
                          Código de ambiente do responsável (opcional)
                        </label>
                        <input
                          className="w-full h-14 px-4 rounded-xl bg-white dark:bg-[#3e4949] dark:text-[#e1e3e0] border-2 border-outline-variant dark:border-[#3e4949] focus:border-tertiary dark:focus:border-[#bac3fd] focus:ring-4 focus:ring-tertiary/10 dark:focus:ring-[#bac3fd]/10 transition-all uppercase font-mono font-medium placeholder:normal-case dark:placeholder:text-[#8ea0a0]"
                          id="code"
                          placeholder="Ex: INV7A8B9C1D"
                          type="text"
                          autoCorrect="off"
                          autoCapitalize="characters"
                          spellCheck={false}
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                        />
                        <p className="mt-2 text-xs text-secondary dark:text-[#8ea0a0] px-1 transition-colors duration-300">
                          Este código (iniciado por INV) é fornecido pelo
                          familiar administrador do ambiente.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botão Submit */}
                <button
                  type="submit"
                  className="w-full h-16 bg-gradient-to-r from-primary to-primary-container dark:from-[#005f61] dark:to-[#8ed2d4] dark:text-[#002021] text-white font-bold text-lg rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  Criar conta
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </button>

                {/* Link para login */}
                <div className="text-center">
                  <Link
                    to="/auth/login"
                    className="text-primary dark:text-[#8ed2d4] font-semibold hover:underline decoration-2 underline-offset-4 transition-all"
                  >
                    Já possui uma conta? Entre aqui
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-neutral-50 dark:bg-[#191c1b] w-full py-12 border-t border-neutral-200/15 dark:border-[#3e4949] transition-colors duration-300">
          <div className="flex flex-col md:flex-row justify-between items-center px-8 gap-6 max-w-7xl mx-auto text-sm">
            <div className="font-bold text-primary dark:text-[#8ed2d4] transition-colors duration-300">
              © 2026 Vita Auxilium. O Cuidado com Dignidade.
            </div>
            <div className="flex gap-8">
              <a
                className="text-neutral-500 dark:text-[#8ea0a0] hover:text-primary dark:hover:text-[#8ed2d4] transition-colors"
                href="#"
              >
                Privacidade
              </a>
              <a
                className="text-neutral-500 dark:text-[#8ea0a0] hover:text-primary dark:hover:text-[#8ed2d4] transition-colors"
                href="#"
              >
                Termos de Uso
              </a>
              <a
                className="text-neutral-500 dark:text-[#8ea0a0] hover:text-primary dark:hover:text-[#8ed2d4] transition-colors"
                href="#"
              >
                Suporte
              </a>
            </div>
          </div>
        </footer>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </>
  );
}
