import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, loginWithGoogle } from "../services/authService";
import { useToastStore } from "../stores/toastStore";
import { useAuthStore } from "../stores/authStore";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = (dark) => {
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  };

  const { user, status } = useAuthStore();

  useEffect(() => {
    if (status === "authenticated" && user) {
      useToastStore.getState().showToast("Bem vindo de volta!", "success");
      navigate("/home", { replace: true });
    }
  }, [status, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      await useAuthStore.getState().fetchUser();
      useToastStore.getState().showToast("Login realizado com sucesso!", "success");
      navigate("/home");
    } catch (err) {
      useToastStore.getState().showToast(
        err?.response?.data?.detail || "Email ou senha inválidos!",
        "error"
      );
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
                src={
                  new URL(
                    "../assets/images/elderly-couple.webp",
                    import.meta.url,
                  ).href
                }
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary dark:from-[#003738] via-transparent to-transparent z-[15]" />
          </section>

          <section className="p-8 md:p-16 flex flex-col justify-center bg-surface-container-lowest dark:bg-inverse-surface transition-colors duration-300">
            <div className="max-w-md mx-auto w-full">
              <header className="mb-8">
                <h3 className="text-4xl font-bold text-primary dark:text-[#8ed2d4] mb-4 tracking-tight transition-colors duration-300">
                  Bem-vindo
                </h3>
                <p className="text-secondary dark:text-secondary-fixed-dim text-lg transition-colors duration-300">
                  Acesse sua conta para continuar.
                </p>
              </header>

              {/* Botão de login com Google */}
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
                    ou entrar com e-mail
                  </span>
                  <div className="flex-grow border-t border-outline-variant/40 dark:border-[#3e4949]"></div>
                </div>
              </div>

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
                  <a
                    className="text-primary relative dark:text-[#8ed2d4] font-semibold text-lg hover:underline transition-all"
                    href="#"
                  >
                    Esqueci minha senha
                  </a>
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
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${!isDark
              ? "bg-white text-primary shadow-sm"
              : "text-[#8ea0a0] hover:bg-white/10"
              }`}
            aria-label="Tema claro"
          >
            <span className="material-symbols-outlined">light_mode</span>
          </button>
          <button
            onClick={() => toggleTheme(true)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark
              ? "bg-on-surface-variant text-[#8ed2d4] shadow-sm"
              : "text-on-surface-variant hover:bg-white/10"
              }`}
            aria-label="Tema escuro"
          >
            <span className="material-symbols-outlined">dark_mode</span>
          </button>
        </div>
      </div>
    </>
  );
}
