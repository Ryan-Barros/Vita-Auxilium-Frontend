import { useState, useMemo } from "react";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function ActivityCalendarView({
  activities = [],
  onToggleComplete,
  onEdit,
  onDelete,
  canManageActivities = false,
  canInteractActivities = true,
  onAddNewForDate,
}) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11
  
  // Format today YYYY-MM-DD
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(todayStr);
  };

  // Generate days matrix for calendar grid
  const calendarGrid = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days = [];
    
    // Padding days before 1st of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = String(currentMonth + 1).padStart(2, "0");
      const dayStr = String(day).padStart(2, "0");
      const fullDateStr = `${currentYear}-${monthStr}-${dayStr}`;

      const dayActivities = activities.filter((a) => a.date === fullDateStr);

      days.push({
        day,
        dateStr: fullDateStr,
        isCurrentMonth: true,
        activities: dayActivities,
        hasPending: dayActivities.some((a) => !a.completed),
        hasCompleted: dayActivities.some((a) => a.completed),
      });
    }

    return days;
  }, [currentYear, currentMonth, activities]);

  // Filter activities for the selected date
  const selectedDateActivities = useMemo(() => {
    return activities.filter((a) => a.date === selectedDate);
  }, [activities, selectedDate]);

  // Format selected date nicely
  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return "";
    const [y, m, d] = selectedDate.split("-");
    const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    return dateObj.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [selectedDate]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Calendar Grid Section (2 columns on lg) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-[#202524] p-6 rounded-3xl border border-outline-variant/30 shadow-xs space-y-6">
          {/* Header Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-extrabold text-on-surface dark:text-[#e1e3e0] capitalize">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={handleToday}
                className="px-3 py-1 bg-surface-container dark:bg-[#252a29] hover:bg-[#0d5c5a] hover:text-white rounded-xl text-xs font-bold text-secondary transition-all cursor-pointer"
              >
                Hoje
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl border border-outline-variant/30 text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                title="Mês Anterior"
              >
                <span className="material-symbols-outlined text-xl">chevron_left</span>
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl border border-outline-variant/30 text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                title="Próximo Mês"
              >
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 text-center font-bold text-xs text-secondary dark:text-[#b4cbcb] uppercase tracking-wider">
            {WEEKDAYS.map((wd) => (
              <div key={wd} className="py-2">
                {wd}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarGrid.map((item, index) => {
              if (!item.isCurrentMonth) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="h-16 md:h-20 rounded-2xl bg-surface-container-lowest/40 dark:bg-[#181b1a]/40"
                  />
                );
              }

              const isSelected = item.dateStr === selectedDate;
              const isToday = item.dateStr === todayStr;

              return (
                <button
                  key={item.dateStr}
                  onClick={() => setSelectedDate(item.dateStr)}
                  className={`h-16 md:h-20 p-2 rounded-2xl border transition-all flex flex-col justify-between items-start text-left cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? "border-[#0d5c5a] bg-[#0d5c5a]/10 ring-2 ring-[#0d5c5a]/30"
                      : isToday
                      ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20"
                      : "border-outline-variant/20 hover:border-[#0d5c5a]/50 bg-surface dark:bg-[#191c1b]"
                  }`}
                >
                  <span
                    className={`text-xs md:text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday
                        ? "bg-amber-500 text-white"
                        : isSelected
                        ? "bg-[#0d5c5a] text-white"
                        : "text-on-surface dark:text-[#e1e3e0]"
                    }`}
                  >
                    {item.day}
                  </span>

                  {/* Activity Indicators */}
                  {item.activities.length > 0 && (
                    <div className="flex items-center gap-1 w-full overflow-hidden pt-1">
                      {item.activities.slice(0, 3).map((act) => (
                        <span
                          key={act.id}
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            act.completed ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                      ))}
                      {item.activities.length > 3 && (
                        <span className="text-[9px] font-extrabold text-secondary">
                          +{item.activities.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Day Agenda Side Panel */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-[#202524] p-6 rounded-3xl border border-outline-variant/30 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
            <div>
              <span className="text-xs uppercase font-extrabold text-secondary dark:text-[#b4cbcb] tracking-wider">
                Agenda do Dia
              </span>
              <h3 className="text-base font-bold text-on-surface dark:text-[#e1e3e0] capitalize mt-0.5">
                {formattedSelectedDate}
              </h3>
            </div>

            {canManageActivities && (
              <button
                onClick={() => onAddNewForDate && onAddNewForDate(selectedDate)}
                className="p-2 bg-[#0d5c5a] hover:bg-[#084846] text-white rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                title="Adicionar Atividade nesta data"
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            )}
          </div>

          {/* Activities List for Selected Day */}
          {selectedDateActivities.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 bg-surface-container dark:bg-[#252a29] rounded-2xl flex items-center justify-center mx-auto text-secondary">
                <span className="material-symbols-outlined text-2xl">event_available</span>
              </div>
              <p className="text-xs text-secondary dark:text-[#b4cbcb]">
                Nenhuma atividade agendada para esta data.
              </p>
              {canManageActivities && (
                <button
                  onClick={() => onAddNewForDate && onAddNewForDate(selectedDate)}
                  className="text-[#0d5c5a] dark:text-[#8ed2d4] hover:underline text-xs font-bold cursor-pointer"
                >
                  + Agendar nova atividade
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {selectedDateActivities.map((act) => (
                <div
                  key={act.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    act.completed
                      ? "bg-surface dark:bg-[#191c1b] border-outline-variant/20 opacity-85"
                      : "bg-surface-container-low dark:bg-[#252a29] border-outline-variant/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-[#0d5c5a] dark:text-[#8ed2d4]">
                          schedule
                        </span>
                        <span className="text-xs font-extrabold text-[#0d5c5a] dark:text-[#8ed2d4]">
                          {act.time}
                        </span>
                      </div>
                      <h4
                        className={`text-sm font-bold text-on-surface dark:text-[#e1e3e0] ${
                          act.completed ? "line-through text-secondary" : ""
                        }`}
                      >
                        {act.title}
                      </h4>
                      {act.description && (
                        <p className="text-xs text-secondary dark:text-[#b4cbcb] line-clamp-2">
                          {act.description}
                        </p>
                      )}
                    </div>

                    {/* Completion button */}
                    {canInteractActivities && (
                      <button
                        onClick={() => onToggleComplete(act.id)}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
                          act.completed
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-white dark:bg-[#343a39] text-secondary hover:text-primary shadow-xs"
                        }`}
                        title={act.completed ? "Desmarcar" : "Concluir"}
                      >
                        <span className="material-symbols-outlined text-lg">
                          {act.completed ? "check_circle" : "radio_button_unchecked"}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Actions for Family */}
                  {canManageActivities && (
                    <div className="pt-2 mt-2 border-t border-outline-variant/20 flex items-center justify-end gap-2 text-xs">
                      <button
                        onClick={() => onEdit(act)}
                        className="text-secondary hover:text-[#0d5c5a] font-semibold cursor-pointer"
                      >
                        Editar
                      </button>
                      <span className="text-outline-variant">•</span>
                      <button
                        onClick={() => onDelete(act.id)}
                        className="text-secondary hover:text-red-600 font-semibold cursor-pointer"
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
