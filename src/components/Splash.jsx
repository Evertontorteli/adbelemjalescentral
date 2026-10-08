import { useEffect, useState } from 'react';
import svgPaths from '../imports/svg-cuvo98uzqz';

const CHAVE_SESSAO = 'splash-visto';
const DURACAO_MS = 1600;
const SAIDA_MS = 500;

function jaViuNestaSessao() {
  try {
    return sessionStorage.getItem(CHAVE_SESSAO) === '1';
  } catch {
    return false;
  }
}

/** Tela de entrada com a logo, exibida uma vez por abertura do app/site. */
export function Splash() {
  const [fase, setFase] = useState(() => (jaViuNestaSessao() ? 'fim' : 'visivel'));

  useEffect(() => {
    if (fase !== 'visivel') return undefined;
    try {
      sessionStorage.setItem(CHAVE_SESSAO, '1');
    } catch {
      // sem sessionStorage (aba privada): a tela aparece de novo na próxima vez, sem problema
    }
    const timer = setTimeout(() => setFase('saindo'), DURACAO_MS);
    return () => clearTimeout(timer);
  }, [fase]);

  useEffect(() => {
    if (fase !== 'saindo') return undefined;
    const timer = setTimeout(() => setFase('fim'), SAIDA_MS);
    return () => clearTimeout(timer);
  }, [fase]);

  if (fase === 'fim') return null;

  return (
    <div
      role="presentation"
      onClick={() => setFase('saindo')}
      className={`splash fixed inset-0 flex flex-col items-center justify-center px-6 text-center transition-opacity ${
        fase === 'saindo' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        zIndex: 2147483647,
        transitionDuration: `${SAIDA_MS}ms`,
        background: 'linear-gradient(to bottom, #f3f4f6 0%, #ffffff 100%)',
      }}
    >
      <img
        src="/static/LogoBleia.svg"
        alt=""
        className="splash-logo mb-6 size-24 object-contain drop-shadow-lg"
      />
      <svg
        className="splash-texto w-full max-w-xs"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 1051 148"
        role="img"
        aria-label="AD Belém Jales"
      >
        <g>
          <path d={svgPaths.p304b7c80} fill="#374151" />
          <path d={svgPaths.p8170a80} fill="#374151" />
          <path d={svgPaths.p38f2ec80} fill="#374151" />
          <path d={svgPaths.p341ae700} fill="#374151" />
          <path d={svgPaths.p3cf14940} fill="#374151" />
          <path d={svgPaths.p35520d80} fill="#374151" />
          <path d={svgPaths.p26eb7b80} fill="#374151" />
          <path d={svgPaths.p35290080} fill="#374151" />
          <path d={svgPaths.p2835e770} fill="#374151" />
          <path d={svgPaths.p28724580} fill="#374151" />
          <path d={svgPaths.p222b9c20} fill="#374151" />
          <path d={svgPaths.pf2e6e00} fill="#374151" />
        </g>
      </svg>
      <p className="splash-texto mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#374151]">
        Lugar de cura e recomeços
      </p>
      <p className="splash-texto mt-2 max-w-xs text-sm text-[#4b5563]">
        Uma igreja de portas abertas para sua família.
      </p>
      <style>{`
        @keyframes splash-flutuar {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes splash-entrar {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .splash-logo { animation: splash-flutuar 2.5s ease-in-out infinite; }
        .splash-texto { animation: splash-entrar 0.6s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .splash-logo, .splash-texto { animation: none; }
        }
      `}</style>
    </div>
  );
}
