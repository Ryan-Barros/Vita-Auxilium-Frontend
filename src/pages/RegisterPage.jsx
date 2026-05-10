import { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [selectedProfile, setSelectedProfile] = useState("familiar");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    code: "",
  });

  const profiles = [
    { id: "familiar", label: "Familiar", icon: "family_restroom" },
    { id: "cuidador", label: "Cuidador", icon: "medical_services" },
    { id: "idoso", label: "Idoso", icon: "elderly" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Cadastro:", { ...form, profile: selectedProfile });
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

          {/* Card */}
          <div className="bg-surface-container-lowest dark:bg-[#2e312f] rounded-3xl p-8 md:p-12 shadow-[0_24px_48px_rgba(0,79,81,0.08)] border border-outline-variant/10 dark:border-[#3e4949] transition-colors duration-300">

            {/* Título */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-primary dark:text-[#8ed2d4] mb-3 transition-colors duration-300">
                Criar nova conta
              </h2>
              <p className="text-secondary dark:text-[#b4cbcb] text-lg leading-relaxed transition-colors duration-300">
                Junte-se à nossa comunidade para oferecer o melhor cuidado e dignidade para quem você ama.
              </p>
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
                      <span className="material-symbols-outlined text-lg">{profile.icon}</span>
                      {profile.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Campos */}
              <div className="space-y-5">

                {/* Nome */}
                <div className="group">
                  <label className="block text-sm font-semibold text-secondary dark:text-[#b4cbcb] mb-1.5 ml-1 transition-colors group-focus-within:text-primary dark:group-focus-within:text-[#8ed2d4]" htmlFor="name">
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
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* E-mail */}
                <div className="group">
                  <label className="block text-sm font-semibold text-secondary dark:text-[#b4cbcb] mb-1.5 ml-1 transition-colors group-focus-within:text-primary dark:group-focus-within:text-[#8ed2d4]" htmlFor="email">
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
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Senha + Confirmar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Senha */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-secondary dark:text-[#b4cbcb] mb-1.5 ml-1 transition-colors group-focus-within:text-primary dark:group-focus-within:text-[#8ed2d4]" htmlFor="password">
                      Senha
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-[#8ea0a0]">
                        lock
                      </span>
                      <input
                        className="w-full h-14 pl-12 pr-12 rounded-xl bg-surface-container-low dark:bg-[#3e4949] dark:text-[#e1e3e0] border-transparent focus:border-primary dark:focus:border-[#8ed2d4] focus:bg-white dark:focus:bg-[#3e4949] focus:ring-4 focus:ring-primary/10 dark:focus:ring-[#8ed2d4]/10 transition-all placeholder:text-outline-variant dark:placeholder:text-[#8ea0a0]"
                        id="password"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-outline dark:text-[#8ea0a0] hover:text-primary dark:hover:text-[#8ed2d4] transition-colors"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        <span className="material-symbols-outlined">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Confirmar Senha */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-secondary dark:text-[#b4cbcb] mb-1.5 ml-1 transition-colors group-focus-within:text-primary dark:group-focus-within:text-[#8ed2d4]" htmlFor="confirmPassword">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-[#8ea0a0]">
                        lock_reset
                      </span>
                      <input
                        className="w-full h-14 pl-12 pr-12 rounded-xl bg-surface-container-low dark:bg-[#3e4949] dark:text-[#e1e3e0] border-transparent focus:border-primary dark:focus:border-[#8ed2d4] focus:bg-white dark:focus:bg-[#3e4949] focus:ring-4 focus:ring-primary/10 dark:focus:ring-[#8ed2d4]/10 transition-all placeholder:text-outline-variant dark:placeholder:text-[#8ea0a0]"
                        id="confirmPassword"
                        placeholder="••••••••"
                        type={showConfirmPassword ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-outline dark:text-[#8ea0a0] hover:text-primary dark:hover:text-[#8ed2d4] transition-colors"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        <span className="material-symbols-outlined">
                          {showConfirmPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Código de ambiente */}
                <div className="pt-2">
                  <div className="group p-5 rounded-2xl bg-tertiary-container/5 dark:bg-[#515b8e]/10 border border-tertiary/10 dark:border-[#515b8e]/20 transition-colors duration-300">
                    <label className="block text-sm font-semibold text-tertiary dark:text-[#bac3fd] mb-2 flex items-center gap-2 transition-colors duration-300" htmlFor="code">
                      <span className="material-symbols-outlined text-lg">key</span>
                      Código de ambiente do responsável
                    </label>
                    <input
                      className="w-full h-14 px-4 rounded-xl bg-white dark:bg-[#3e4949] dark:text-[#e1e3e0] border-2 border-outline-variant dark:border-[#3e4949] focus:border-tertiary dark:focus:border-[#bac3fd] focus:ring-4 focus:ring-tertiary/10 dark:focus:ring-[#bac3fd]/10 transition-all uppercase font-medium placeholder:normal-case dark:placeholder:text-[#8ea0a0]"
                      id="code"
                      placeholder="Ex: AMB-12345"
                      type="text"
                      value={form.code}
                      onChange={handleChange}
                    />
                    <p className="mt-2 text-xs text-secondary dark:text-[#8ea0a0] px-1 transition-colors duration-300">
                      Este código é fornecido pelo administrador da rede familiar.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full h-16 bg-gradient-to-r from-primary to-primary-container dark:from-[#005f61] dark:to-[#8ed2d4] dark:text-[#002021] text-white font-bold text-lg rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                Criar conta
                <span className="material-symbols-outlined">arrow_forward</span>
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

          {/* Imagem decorativa */}
          <div className="mt-12 flex justify-center opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            <img
              alt="Vita Auxilium"
              className="h-16 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/ADBb0ujwxu_oIyWSecszpovnxTlnaNb5FTY44p3rhMrGfh2ksCSfsc7SF_lIvPp-s25c-630D2KWmIfRuM8P9we6Ni0tkgtdlcoz43Leb3FEBGfQQfnHQZkcS2KCb7QCa_5Tcw1CuCspGQyStalc2Y-xMoI3fSxoKMYalJ1X7MZrSVXoVCW0XpDkPBDOv-ynr5rk1XZHq8PiQeb_xSHpk2FEnolcQEVfz267hqVHaJP6YaKSMeGWRMDLrp-ftpkWn6bI7FxKLJ28LNkR"
            />
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
            <a className="text-neutral-500 dark:text-[#8ea0a0] hover:text-primary dark:hover:text-[#8ed2d4] transition-colors" href="#">Privacidade</a>
            <a className="text-neutral-500 dark:text-[#8ea0a0] hover:text-primary dark:hover:text-[#8ed2d4] transition-colors" href="#">Termos de Uso</a>
            <a className="text-neutral-500 dark:text-[#8ea0a0] hover:text-primary dark:hover:text-[#8ed2d4] transition-colors" href="#">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}