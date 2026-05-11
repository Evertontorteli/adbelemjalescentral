import svgPaths from "../imports/svg-cuvo98uzqz";
import { ExternalLink } from 'lucide-react';

function InstagramIcon() {
  return (
    <div className="relative size-12 md:size-14">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 42">
        <g clipPath="url(#clip0_pastor_instagram)">
          <path d={svgPaths.p1afd3500} fill="#E1306C" />
        </g>
        <defs>
          <clipPath id="clip0_pastor_instagram">
            <rect fill="white" height="42" width="42" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export function Pastor() {
  return (
    <section className="py-20 md:py-32 px-4 bg-gradient-to-b from-gray-50 to-white" id="pastor">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-block mb-4">
            <span className="text-[#374151] tracking-widest uppercase text-sm">Nossa liderança</span>
          </div>
          <h2 className="text-[#374151] text-4xl md:text-6xl lg:text-7xl">
            PASTOR LOCAL
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-10 flex flex-col items-center gap-8">
              {/* Círculo: foto com enquadramento que mantém a cabeça inteira visível */}
              <div className="shrink-0 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden ring-4 ring-white shadow-xl bg-gray-100">
                <img
                  src="/static/pastor.png"
                  alt="Pastor local"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            <div className="flex-1 text-left min-w-0">
              <h3 className="text-[#374151] text-2xl md:text-3xl mb-4">
                Palavra do Pastor
              </h3>
              <div className="text-[#374151] leading-relaxed space-y-4 text-base md:text-lg mb-6">
                <p>
                  Estar à frente da Assembleia de Deus, Ministério do Belém, é um chamado que abraço com honra e gratidão. Meu compromisso é servir, acolher e interceder por cada pessoa que busca direção, consolo ou um lugar onde se sinta em casa.
                </p>
                <p>
                  Nossa igreja é construída com amor e dedicação para ser um ambiente familiar, onde a graça de Deus se manifesta e a comunhão com Ele se fortalece. O templo foi preparado para acolher toda a família, oferecendo espaço e cuidado para crianças, adolescentes, jovens e adultos, com iniciativas desenvolvidas com carinho, como a musicalização.
                </p>
                <p>
                  Acima de tudo, buscamos ser instrumentos de paz e transformação, refletindo os ensinamentos de Jesus em cada atitude. Convido você a caminhar conosco e a experimentar o poder transformador do amor de Deus.
                </p>
                <p>
                  Conte comigo. Juntos, seguiremos firmes nessa jornada de fé.
                </p>
                <p className="font-medium">
                  Com carinho,<br />
                  Pr. Claudio Oliveira
                </p>
              </div>
              <a
                href="https://instagram.com/pc_oliveira1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#374151] px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl border border-[#6b7280]/30"
              >
                <InstagramIcon />
                <span>@pc_oliveira1</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
