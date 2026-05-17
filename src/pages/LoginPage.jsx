import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import Toast from "../components/Toast";
import { useAuthStore } from "../stores/authStore";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const { setToken } = useAuthStore();

  const toggleTheme = (dark) => {
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      setToken(res.data.token);
      navigate("/");
    } catch (err) {
      console.log(err);
      setToast({
        message: err?.response?.data?.message || "Email ou senha inválidos!",
        type: "error",
      });
    }
  };

  return (
    <>
      <div className="bg-background dark:bg-[#191c1b] text-on-background dark:text-[#e1e3e0] min-h-screen flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/10 rounded-full blur-[120px]" />

        <main className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 bg-surface-container-lowest dark:bg-[#2e312f] shadow-2xl rounded-[32px] overflow-hidden relative z-10 transition-colors duration-300">
          <section className="hidden lg:flex flex-col justify-between p-16 bg-primary dark:bg-[#003738] text-on-primary relative overflow-hidden transition-colors duration-300">
            <div className="relative z-20">
              <h1 className="font-bold text-3xl tracking-tight mb-2">
                Apoio Idoso
              </h1>
              <p className="text-on-primary-container/80 text-xl font-light">
                Cuidado e Dignidade
              </p>
            </div>
            <div className="relative z-20">
              <h2 className="text-5xl font-extrabold leading-tight mb-6">
                Sua jornada de cuidado começa aqui.
              </h2>
              <p className="text-lg opacity-90 max-w-md font-light leading-relaxed">
                Uma plataforma pensada para proporcionar segurança, organização
                e tranquilidade para quem cuida e para quem é cuidado.
              </p>
            </div>
            <div className="absolute inset-0 z-10 opacity-40">
              <img
                alt="Casal de idosos sorrindo"
                className="w-full h-full object-cover grayscale mix-blend-overlay"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIM088-nTjFDW8TxqvgWfGoyxYk3YJ8uDbauR4Q4jvDmesU2iSuHkYc1hnWwz2nvSMmgrn5YMOiaGr7b99bfBIYN8veaV6A1qd6c61aTl5Q6Obb8x8doMHACzHXeIB-5sAx-W1nlZvSTW0oLLrnXQ3juXueeTqMhVrojWhgB8IvK7MbjRvgRRLq-OhByhHYErKXiFuniL7L6YRA9Ib-EfhzAOzi3A34O7Hejpo_BdsH1vTEt_lD62HK9GxtEOH0RfCI3xC2MUGsg"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary dark:from-[#003738] via-transparent to-transparent z-[15]" />
          </section>

          <section className="p-8 md:p-16 flex flex-col justify-center bg-surface-container-lowest dark:bg-inverse-surface transition-colors duration-300">
            <div className="max-w-md mx-auto w-full">
              <header className="mb-12">
                <h3 className="text-4xl font-bold text-primary dark:text-[#8ed2d4] mb-4 tracking-tight transition-colors duration-300">
                  Bem-vindo
                </h3>
                <p className="text-secondary dark:text-secondary-fixed-dim text-lg transition-colors duration-300">
                  Acesse sua conta para continuar.
                </p>
              </header>

              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="space-y-3">
                  <label
                    className="block text-xl font-medium text-on-surface dark:text-[#e1e3e0] transition-colors duration-300"
                    htmlFor="email"
                  >
                    E-mail
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-[#8ea0a0]">
                      mail
                    </span>
                    <input
                      className="w-full h-16 pl-14 pr-4 bg-surface-container-highest dark:bg-on-surface-variant dark:text-[#e1e3e0] border-none rounded-xl text-lg focus:ring-2 focus:ring-primary dark:focus:ring-[#8ed2d4] transition-all placeholder:text-outline/60 dark:placeholder:text-[#8ea0a0]"
                      id="email"
                      placeholder="nome@exemplo.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label
                      className="block text-xl font-medium text-on-surface dark:text-[#e1e3e0] transition-colors duration-300"
                      htmlFor="password"
                    >
                      Senha
                    </label>
                    <a
                      className="text-primary dark:text-[#8ed2d4] font-semibold text-lg hover:underline transition-all"
                      href="#"
                    >
                      Esqueci minha senha
                    </a>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-[#8ea0a0]">
                      lock
                    </span>
                    <input
                      className="w-full h-16 pl-14 pr-14 bg-surface-container-highest dark:bg-on-surface-variant dark:text-[#e1e3e0] border-none rounded-xl text-lg focus:ring-2 focus:ring-primary dark:focus:ring-[#8ed2d4] transition-all placeholder:text-outline/60 dark:placeholder:text-[#8ea0a0]"
                      id="password"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-outline dark:text-[#8ea0a0] hover:text-primary dark:hover:text-[#8ed2d4] transition-colors"
                      type="button"
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

                <button
                  className="w-full h-16 bg-gradient-to-r from-primary to-primary-container dark:from-[#005f61] dark:to-[#8ed2d4] dark:text-[#002021] text-on-primary rounded-xl text-xl font-bold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  type="submit"
                >
                  <span>Entrar</span>
                  <span className="material-symbols-outlined">login</span>
                </button>
              </form>

              <div className="mt-12 pt-8 border-t border-surface-container dark:border-on-surface-variant flex flex-col items-center gap-4 transition-colors duration-300">
                <p className="text-secondary dark:text-secondary-fixed-dim text-lg transition-colors duration-300">
                  Não possui uma conta?
                </p>
                <Link
                  to="/auth/register"
                  className="flex items-center gap-2 px-8 py-3 rounded-full border-2 border-primary dark:border-[#8ed2d4] text-primary dark:text-[#8ed2d4] font-bold text-lg hover:bg-primary/5 dark:hover:bg-[#8ed2d4]/10 transition-colors"
                >
                  Criar uma conta
                  <span className="material-symbols-outlined">person_add</span>
                </Link>
              </div>
            </div>

            <footer className="mt-12 text-center">
              <p className="text-outline dark:text-[#8ea0a0] text-sm transition-colors duration-300">
                Ao entrar, você concorda com nossos{" "}
                <a className="underline" href="#">
                  Termos de Uso
                </a>{" "}
                e{" "}
                <a className="underline" href="#">
                  Privacidade
                </a>
                .
              </p>
            </footer>
          </section>
        </main>

        <div className="fixed top-8 right-8 hidden md:flex items-center gap-4 bg-white/20 dark:bg-black/20 backdrop-blur-md p-2 rounded-full border border-white/30 dark:border-white/10 transition-colors duration-300">
          <button
            onClick={() => toggleTheme(false)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              !isDark
                ? "bg-white text-primary shadow-sm"
                : "text-[#8ea0a0] hover:bg-white/10"
            }`}
            aria-label="Tema claro"
          >
            <span className="material-symbols-outlined">light_mode</span>
          </button>
          <button
            onClick={() => toggleTheme(true)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              isDark
                ? "bg-on-surface-variant text-[#8ed2d4] shadow-sm"
                : "text-on-surface-variant hover:bg-white/10"
            }`}
            aria-label="Tema escuro"
          >
            <span className="material-symbols-outlined">dark_mode</span>
          </button>
        </div>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </>
  );
}
