export function Hero() {
  return (
    <section
      id="inicio"
      className="relative w-full"
      style={{ backgroundColor: "#598c71", color: "#fff" }}
    >
      <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <p className="font-serif italic text-lg md:text-xl mb-10 opacity-95">
          Introducción
        </p>
        <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] text-center">
          National Case Competition
        </h1>
        <p className="font-serif italic text-2xl md:text-3xl text-center mt-6 opacity-95">
          Vivir la consultoría desde la universidad
        </p>
        <p className="mx-auto max-w-[700px] text-center mt-10 text-base md:text-lg leading-relaxed opacity-95">
          El NCC es más que una competencia. Es una experiencia de transformación.
          Una forma de poner a prueba nuestras capacidades en condiciones reales,
          en equipo y con propósito. Creemos que los estudiantes no necesitan
          esperar a graduarse para enfrentar los desafíos del mundo profesional.
          Aquí se entrenan con rigor, compiten con ética y se proyectan hacia un
          futuro donde el pensamiento estratégico y la acción colectiva marcan
          la diferencia.
        </p>
        <p className="font-serif text-4xl md:text-6xl text-center mt-14">
          Train. Compete. Become.
        </p>
      </div>
    </section>
  );
}
