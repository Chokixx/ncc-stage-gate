import { Mail, Phone, Instagram, Linkedin } from "lucide-react";
import liaPhoto from "@/assets/team-lia.jpg";
import juanPhoto from "@/assets/team-juan-camilo.jpg";

const directors = [
  {
    name: "Lia Fonseca Riccardi",
    role: "Directora",
    photo: liaPhoto,
    email: "l.fonsecar@uniandes.edu.co",
    phone: "+57 316 550 0999",
    phoneRaw: "+573165500999",
  },
  {
    name: "Juan Camilo Ángel",
    role: "Director",
    photo: juanPhoto,
    email: "jc.angela1@uniandes.edu.co",
    phone: "+57 312 873 7409",
    phoneRaw: "+573128737409",
  },
];

export function Contacto() {
  return (
    <section id="contacto" className="w-full" style={{ backgroundColor: "#f1f1ed" }}>
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--ncc-deep)]">
            Contacto
          </h2>
          <p className="text-[var(--muted-foreground)] mt-4">
            ¿Tienes preguntas sobre el NCC? Escríbenos o contáctanos directamente.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12 auto-rows-fr">
          {directors.map((d) => (
            <article
              key={d.email}
              className="group bg-white rounded-xl border border-[var(--ncc-steel)] overflow-hidden shadow-[0_2px_12px_rgba(18,91,80,0.06)] hover:shadow-[0_8px_28px_rgba(18,91,80,0.12)] transition-shadow h-full"
            >
              <div className="flex flex-col sm:flex-row h-full">
                <div className="sm:w-56 sm:shrink-0 aspect-square sm:aspect-auto sm:self-stretch overflow-hidden bg-[var(--ncc-mint)]">
                  <img
                    src={d.photo}
                    alt={d.name}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col justify-center flex-1">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--ncc-medium)] font-medium">
                    {d.role}
                  </p>
                  <h3 className="font-serif text-2xl text-[var(--ncc-deep)] mt-1">
                    {d.name}
                  </h3>
                  <div className="mt-4 space-y-2 text-sm">
                    <a
                      href={`mailto:${d.email}`}
                      className="flex items-center gap-2.5 text-[var(--muted-foreground)] hover:text-[var(--ncc-deep)] transition-colors break-all"
                    >
                      <Mail className="h-4 w-4 shrink-0 text-[var(--ncc-medium)]" />
                      {d.email}
                    </a>
                    <a
                      href={`tel:${d.phoneRaw}`}
                      className="flex items-center gap-2.5 text-[var(--muted-foreground)] hover:text-[var(--ncc-deep)] transition-colors"
                    >
                      <Phone className="h-4 w-4 shrink-0 text-[var(--ncc-medium)]" />
                      {d.phone}
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div
          className="mt-6 rounded-xl p-7 md:p-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-[0_4px_18px_rgba(18,91,80,0.18)]"
          style={{ backgroundColor: "#125b50" }}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.18em] opacity-80">
              Correo oficial
            </p>
            <h3 className="font-serif text-2xl md:text-3xl mt-1">NCC</h3>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="mailto:ncc@uniandes.edu.co"
              className="inline-flex items-center gap-3 rounded-md bg-white/10 hover:bg-white/20 transition-colors px-5 py-3 text-sm font-medium"
            >
              <Mail className="h-4 w-4" />
              ncc@uniandes.edu.co
            </a>
            <a
              href="https://www.instagram.com/nationalcase/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram NCC"
              className="inline-flex items-center justify-center h-11 w-11 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/company/national-case/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn NCC"
              className="inline-flex items-center justify-center h-11 w-11 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
