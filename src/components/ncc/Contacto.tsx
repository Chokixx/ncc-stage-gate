import { Mail, Phone } from "lucide-react";

const contacts = [
  {
    name: "Lia Fonseca Riccardi",
    email: "l.fonsecar@uniandes.edu.co",
    phone: "+57 316 550 0999",
    phoneRaw: "+573165500999",
  },
  {
    name: "Juan Camilo Ángel",
    email: "jc.angela1@uniandes.edu.co",
    phone: "+57 312 873 7409",
    phoneRaw: "+573128737409",
  },
];

export function Contacto() {
  return (
    <section id="contacto" className="w-full" style={{ backgroundColor: "#f1f1ed" }}>
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--ncc-deep)]">
            Contacto
          </h2>
          <p className="text-[var(--muted-foreground)] mt-4">
            ¿Tienes preguntas sobre el NCC? Escríbenos o contáctanos directamente.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {contacts.map((c) => (
            <div
              key={c.email}
              className="bg-white rounded-lg border border-[var(--ncc-steel)] p-7 shadow-[0_2px_12px_rgba(18,91,80,0.06)]"
            >
              <h3 className="font-serif text-2xl text-[var(--ncc-deep)]">{c.name}</h3>
              <div className="mt-5 space-y-3 text-sm">
                <a
                  href={`mailto:${c.email}`}
                  className="flex items-center gap-3 text-[var(--muted-foreground)] hover:text-[var(--ncc-deep)] transition-colors break-all"
                >
                  <Mail className="h-4 w-4 shrink-0 text-[var(--ncc-medium)]" />
                  {c.email}
                </a>
                <a
                  href={`tel:${c.phoneRaw}`}
                  className="flex items-center gap-3 text-[var(--muted-foreground)] hover:text-[var(--ncc-deep)] transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0 text-[var(--ncc-medium)]" />
                  {c.phone}
                </a>
              </div>
            </div>
          ))}

          <div
            className="rounded-lg p-7 text-white shadow-[0_2px_12px_rgba(18,91,80,0.18)]"
            style={{ backgroundColor: "#125b50" }}
          >
            <h3 className="font-serif text-2xl">NCC</h3>
            <p className="text-sm opacity-85 mt-2">Correo oficial</p>
            <a
              href="mailto:ncc@uniandes.edu.co"
              className="mt-5 flex items-center gap-3 text-sm hover:opacity-90 break-all"
            >
              <Mail className="h-4 w-4 shrink-0" />
              ncc@uniandes.edu.co
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
