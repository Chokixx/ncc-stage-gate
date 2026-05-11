export function MisionVision() {
  return (
    <section
      className="w-full"
      style={{ backgroundColor: "#125b50", color: "#fff" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 md:gap-0">
        <div className="md:pr-12 md:border-r md:border-white/30">
          <h2 className="font-serif text-4xl md:text-5xl text-center mb-8">Misión</h2>
          <p className="text-base md:text-lg leading-relaxed text-justify max-w-md mx-auto">
            Diseñar y liderar una experiencia anual de formación que permita a
            estudiantes de negocios y carreras afines desarrollar habilidades reales
            en consultoría, pensamiento estratégico y resolución de problemas
            complejos, a través de espacios continuos de entrenamiento, conexión
            y competencia.
          </p>
        </div>
        <div className="md:pl-12">
          <h2 className="font-serif text-4xl md:text-5xl text-center mb-8">Visión</h2>
          <p className="text-base md:text-lg leading-relaxed text-justify max-w-md mx-auto">
            Convertirnos en la competencia universitaria de consultoría más
            influyente de Colombia y Latinoamérica, reconocida no solo por su
            excelencia académica y nivel competitivo, sino por la comunidad que
            construye, la red de talento que conecta y el impacto profesional que
            genera más allá del evento final.
          </p>
        </div>
      </div>
    </section>
  );
}
