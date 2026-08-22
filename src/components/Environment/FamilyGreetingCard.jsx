export default function FamilyGreetingCard({
  imageSrc = "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800",
  message = "A família mandou um oi!",
}) {
  return (
    <div className="relative rounded-[2.5rem] overflow-hidden shadow-md min-h-[240px] flex flex-col justify-end p-6 h-full group">
      <img
        src={imageSrc}
        alt="Família"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      <div className="relative z-10 text-white">
        <p className="text-2xl font-extrabold tracking-tight drop-shadow-md">
          {message}
        </p>
      </div>
    </div>
  );
}
