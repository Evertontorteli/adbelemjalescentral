import svgPaths from "../../imports/svg-cuvo98uzqz";
import { ChevronDown } from 'lucide-react';

function CamadaX2() {
  return (
    <div className="relative size-[140px] md:size-[180px] animate-float flex items-center justify-center">
      <img src="/static/LogoBleia.svg" alt="AD Belém Jales" className="block size-full object-contain drop-shadow-2xl" />
    </div>
  );
}

export function Apresentacao() {
  return (
    <section
      id="apresentacao"
      className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-12 pt-24 md:pt-32 animate-inicio-fade-in"
    >
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-inicio-bg"
          style={{ backgroundImage: 'url(/fundo_inicio.png)' }}
        />
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background: 'linear-gradient(to bottom right, #ffffff 0%, #f9fafb 35%, #f3f4f6 70%, #e5e7eb 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="flex justify-center mb-10 md:mb-12">
          <CamadaX2 />
        </div>
        <div className="mb-8 md:mb-10">
          <svg className="w-full max-w-4xl mx-auto drop-shadow-2xl" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1051 148">
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
        </div>
        <h1 className="text-[#374151] text-2xl sm:text-3xl md:text-5xl lg:text-6xl tracking-wide mb-6 drop-shadow-lg whitespace-nowrap text-center">
          LUGAR DE CURA E RECOMEÇOS
        </h1>
        <p className="text-[#374151]/90 text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Seja bem-vindo à AD Belém Jales.
          <br />
          Uma igreja de portas abertas para sua família.
        </p>
      </div>

      <a
        href="#pastor"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#374151]/80 hover:text-[#374151] transition-all duration-300 animate-bounce cursor-pointer"
      >
        <ChevronDown className="w-8 h-8" />
      </a>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 2.5s ease-in-out infinite; }
        @keyframes inicio-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-inicio-fade-in { animation: inicio-fade-in 1s ease-out forwards; }
        @keyframes inicio-bg {
          from { opacity: 0; transform: scale(1.05); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-inicio-bg { animation: inicio-bg 1.2s ease-out forwards; }
      `}</style>
    </section>
  );
}
