import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { INSTAGRAM_PASTOR_URL } from '../config/contato.js';

const PARAGRAFOS = [
  'Estar à frente da Assembleia de Deus, Ministério do Belém, é um chamado que abraço com honra e gratidão. Meu compromisso é servir, acolher e interceder por cada pessoa que busca direção, consolo ou um lugar onde se sinta em casa.',
  'Nossa igreja é construída com amor e dedicação para ser um ambiente familiar, onde a graça de Deus se manifesta e a comunhão com Ele se fortalece. O templo foi preparado para acolher toda a família, oferecendo espaço e cuidado para crianças, adolescentes, jovens e adultos, com iniciativas desenvolvidas com carinho, como a musicalização.',
  'Acima de tudo, buscamos ser instrumentos de paz e transformação, refletindo os ensinamentos de Jesus em cada atitude. Convido você a caminhar conosco e a experimentar o poder transformador do amor de Deus.',
  'Conte comigo. Juntos, seguiremos firmes nessa jornada de fé.',
];

export function Pastor() {
  const [aberto, setAberto] = useState(false);

  return (
    <section id="pastor" aria-labelledby="palavra-pastor" className="px-4">
      <h2 id="palavra-pastor" className="mb-3 text-lg font-semibold text-[#374151]">
        Palavra do Pastor
      </h2>
      <div className="rounded-2xl border border-[#e5e7eb]/80 bg-white p-4 shadow-[0_6px_20px_rgba(17,24,39,0.10)]">
        <div className="flex items-center gap-4">
          <img
            src="/static/pastor-480.jpg"
            alt="Pr. Claudio Oliveira"
            width="64"
            height="64"
            loading="lazy"
            className="h-16 w-16 shrink-0 rounded-full object-cover object-top bg-[#f3f4f6]"
          />
          <div className="min-w-0">
            <p className="text-base font-bold text-[#374151]">Pr. Claudio Oliveira</p>
            <a
              href={INSTAGRAM_PASTOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-sm text-[#4b5563] underline decoration-[#6b7280]/50 underline-offset-2"
            >
              @pc_oliveira1 no Instagram
            </a>
          </div>
        </div>

        <div id="mensagem-pastor" className="mt-3 space-y-3 text-[15px] leading-relaxed text-[#374151]">
          <p className={aberto ? '' : 'line-clamp-3'}>{PARAGRAFOS[0]}</p>
          {aberto && (
            <>
              {PARAGRAFOS.slice(1).map((p) => <p key={p}>{p}</p>)}
              <p className="font-medium">Com carinho,<br />Pr. Claudio Oliveira</p>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls="mensagem-pastor"
          className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[#374151]"
        >
          {aberto ? 'Mostrar menos' : 'Ler mensagem completa'}
          <ChevronDown className={`h-4 w-4 transition-transform ${aberto ? 'rotate-180' : ''}`} aria-hidden />
        </button>
      </div>
    </section>
  );
}
