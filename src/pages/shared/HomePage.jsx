export default function HomePage() {

  return (
    <div className="space-y-10">

      <header>
        <h1 className="text-4xl font-bold tracking-tight text-primary dark:text-[#8ed2d4] mb-2 transition-colors duration-300">
          Bem-vindo, Família
        </h1>
        <p className="text-secondary dark:text-[#b4cbcb] text-xl font-light transition-colors duration-300">
          Status atual de Dona Helena • Hoje, 24 de Outubro
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
        <div className="bg-surface-container-low dark:bg-[#2e312f] p-6 rounded-[2rem] hover:shadow-lg transition-all duration-300 group cursor-pointer border border-transparent hover:border-primary/20 dark:hover:border-[#8ed2d4]/20">
          <div className="bg-primary/10 dark:bg-[#8ed2d4]/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-primary dark:text-[#8ed2d4] text-3xl">
              event_available
            </span>
          </div>
          <span className="block text-secondary dark:text-[#b4cbcb] text-sm font-medium uppercase tracking-wider mb-1">
            Atividades Pendentes
          </span>
          <span className="text-4xl font-bold text-on-surface dark:text-[#e1e3e0]">
            03
          </span>
        </div>
    
        <div className="bg-surface-container-low dark:bg-[#2e312f] p-6 rounded-[2rem] hover:shadow-lg transition-all duration-300 group cursor-pointer border border-transparent hover:border-tertiary/20 dark:hover:border-tertiary-fixed-dim/20">
          <div className="bg-tertiary/10 dark:bg-tertiary-fixed-dim/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-tertiary dark:text-tertiary-fixed-dim text-3xl">
              notifications_active
            </span>
          </div>
          <span className="block text-secondary dark:text-[#b4cbcb] text-sm font-medium uppercase tracking-wider mb-1">
            Lembretes Ativos
          </span>
          <span className="text-4xl font-bold text-on-surface dark:text-[#e1e3e0]">
            05
          </span>
        </div>

        <div className="bg-surface-container-low dark:bg-[#2e312f] p-6 rounded-[2rem] hover:shadow-lg transition-all duration-300 group cursor-pointer border border-transparent hover:border-primary-container/20 dark:hover:border-primary-container/40">
          <div className="bg-primary-container/10 dark:bg-primary-container/30 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-primary-container dark:text-[#9fe4e6] text-3xl">
              watch
            </span>
          </div>
          <span className="block text-secondary dark:text-[#b4cbcb] text-sm font-medium uppercase tracking-wider mb-1">
            Monitoramento Relógio
          </span>
          <span className="text-2xl font-bold text-on-surface dark:text-[#e1e3e0]">
            Samsung Watch Ativo
          </span>
        </div>

        <div className="bg-surface-container-low dark:bg-[#2e312f] p-6 rounded-[2rem] hover:shadow-lg transition-all duration-300 group cursor-pointer border border-transparent hover:border-on-tertiary-fixed-variant/20 dark:hover:border-tertiary-fixed/30">
          <div className="bg-tertiary-fixed-dim/20 dark:bg-tertiary-fixed/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span
              className="material-symbols-outlined text-on-tertiary-fixed-variant dark:text-tertiary-fixed text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              sentiment_satisfied
            </span>
          </div>
          <span className="block text-secondary dark:text-[#b4cbcb] text-sm font-medium uppercase tracking-wider mb-1">
            Último Humor
          </span>
          <span className="text-2xl font-bold text-on-surface dark:text-[#e1e3e0]">
            Tranquila
          </span>
        </div>
      </section>

      <section>
        <div className="bg-surface-container-highest dark:bg-[#2e312f] p-8 md:p-10 rounded-[2.5rem] shadow-sm transition-colors duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h3 className="text-2xl font-bold text-on-surface dark:text-[#e1e3e0]">
              Próximas Atividades
            </h3>
            <button className="px-8 py-3 bg-primary hover:bg-primary-container text-on-primary font-bold rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
              <span className="material-symbols-outlined text-xl">add</span>
              Nova Atividade
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-4 rounded-3xl hover:bg-surface-container-low/60 dark:hover:bg-white/5 transition-colors">
              <div className="w-3 h-14 bg-secondary-container dark:bg-secondary-fixed-dim rounded-full mt-1 flex-shrink-0" />
              <div>
                <span className="text-sm font-bold text-primary dark:text-[#8ed2d4]">
                  14:00 • MEDICAMENTO
                </span>
                <p className="text-on-surface dark:text-[#e1e3e0] text-xl font-medium">
                  Anti-hipertensivo
                </p>
                <span className="text-sm text-secondary dark:text-[#b4cbcb]">
                  Aguardando registro • Dose: 1 comprimido
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-3xl hover:bg-surface-container-low/60 dark:hover:bg-white/5 transition-colors">
              <div className="w-3 h-14 bg-primary dark:bg-[#8ed2d4] rounded-full mt-1 flex-shrink-0" />
              <div>
                <span className="text-sm font-bold text-primary dark:text-[#8ed2d4]">
                  16:30 • FISIOTERAPIA
                </span>
                <p className="text-on-surface dark:text-[#e1e3e0] text-xl font-medium">
                  Caminhada Leve
                </p>
                <span className="text-sm text-secondary dark:text-[#b4cbcb]">
                  Agendado • Local: Jardim
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-3xl hover:bg-surface-container-low/60 dark:hover:bg-white/5 transition-colors">
              <div className="w-3 h-14 bg-tertiary dark:bg-tertiary-fixed-dim rounded-full mt-1 flex-shrink-0" />
              <div>
                <span className="text-sm font-bold text-tertiary dark:text-tertiary-fixed-dim">
                  19:00 • NUTRIÇÃO
                </span>
                <p className="text-on-surface dark:text-[#e1e3e0] text-xl font-medium">
                  Jantar
                </p>
                <span className="text-sm text-secondary dark:text-[#b4cbcb]">
                  Programado • Sopa de Legumes
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-3xl hover:bg-surface-container-low/60 dark:hover:bg-white/5 transition-colors">
              <div className="w-3 h-14 bg-outline-variant/60 dark:bg-outline-variant/40 rounded-full mt-1 flex-shrink-0" />
              <div>
                <span className="text-sm font-bold text-outline dark:text-[#bec9c8]">
                  21:00 • HIGIENE
                </span>
                <p className="text-on-surface dark:text-[#e1e3e0] text-xl font-medium">
                  Preparação para Dormir
                </p>
                <span className="text-sm text-secondary dark:text-[#b4cbcb]">
                  Rotina diária
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-3xl hover:bg-surface-container-low/60 dark:hover:bg-white/5 transition-colors">
              <div className="w-3 h-14 bg-outline-variant/60 dark:bg-outline-variant/40 rounded-full mt-1 flex-shrink-0" />
              <div>
                <span className="text-sm font-bold text-outline dark:text-[#bec9c8]">
                  Amanhã 08:00 • MEDICAMENTO
                </span>
                <p className="text-on-surface dark:text-[#e1e3e0] text-xl font-medium">
                  Vitamina D
                </p>
                <span className="text-sm text-secondary dark:text-[#b4cbcb]">
                  Programado
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center p-4 rounded-3xl border-2 border-dashed border-outline-variant dark:border-outline/40 hover:border-primary/50 dark:hover:border-[#8ed2d4]/50 transition-colors cursor-pointer group">
              <div className="text-center">
                <span className="material-symbols-outlined text-outline dark:text-[#bec9c8] group-hover:text-primary dark:group-hover:text-[#8ed2d4] transition-colors text-3xl">
                  more_horiz
                </span>
                <p className="text-sm font-medium text-secondary dark:text-[#b4cbcb] group-hover:text-primary dark:group-hover:text-[#8ed2d4] transition-colors">
                  Ver todas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

  );
}
