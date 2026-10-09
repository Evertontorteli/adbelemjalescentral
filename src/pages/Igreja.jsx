import { Link } from 'react-router-dom';
import { MapPin, Users } from 'lucide-react';
import { ENDERECO, MAPS_URL } from '../config/contato.js';

const B = ({ children }) => <strong className="font-semibold text-[#374151]">{children}</strong>;

const LINHA_DO_TEMPO = [
  {
    marco: '1948',
    titulo: 'Origem',
    texto: (
      <>
        A Assembleia de Deus – Ministério do Belém em Jales/SP nasceu no final de 1948, quando o <B>Pr. Florentino Zacarias</B> chegou à região com sua família. Após dois anos de trabalho missionário, iniciou os cultos em Jales — primeiro debaixo de uma mangueira, depois nas casas dos irmãos.
      </>
    ),
  },
  {
    marco: '1970',
    titulo: 'Crescimento',
    texto: (
      <>
        Com o crescimento da igreja, foi necessário alugar um salão na Rua Oito. Em <B>30 de agosto de 1970</B>, foi inaugurado o templo próprio no Jardim América.
      </>
    ),
  },
  {
    marco: 'Décadas seguintes',
    titulo: 'Expansão',
    texto: (
      <>
        Durante <B>34 anos</B> de liderança, o Pr. Florentino expandiu a obra por toda a região, alcançando inclusive o Mato Grosso do Sul e o Triângulo Mineiro. Em seguida, o <B>Pr. Sebastião Umbelino de Oliveira</B> assumiu a presidência, conduzindo um período de grande crescimento e construindo o Centro de Eventos na Avenida Francisco Jales — hoje conhecido como o <B>Templo Central</B> das Assembleias de Deus Ministério Belém de Jales e região.
      </>
    ),
  },
  {
    marco: '2007',
    titulo: 'Continuidade',
    texto: (
      <>
        Em dezembro de 2007, a presidência foi transferida ao <B>Pr. Claudio de Oliveira</B>, que segue dando continuidade ao legado com dedicação e visão.
      </>
    ),
  },
  {
    marco: 'Hoje',
    titulo: 'Hoje',
    destaque: true,
    texto: (
      <>
        Atualmente, a igreja conta com milhares de membros, diversas congregações na cidade e região, além de missionários, atuando no Brasil e no exterior.
      </>
    ),
  },
];

const CARD_CLASS = 'rounded-2xl border border-[#e5e7eb]/80 bg-white shadow-[0_6px_20px_rgba(17,24,39,0.10)]';

export default function Igreja() {
  return (
    <div className="min-h-screen bg-white pt-8 pb-[calc(8rem+env(safe-area-inset-bottom))] lg:pt-28 lg:pb-24">
      <div className="mx-auto max-w-2xl px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-[#374151] md:text-4xl">Nossa História</h1>
          <p className="mt-1 text-sm text-[#4b5563] md:text-base">AD Belém – Ministério do Belém em Jales/SP</p>
        </header>

        <ol className="relative">
          {LINHA_DO_TEMPO.map((item, i) => {
            const ultimo = i === LINHA_DO_TEMPO.length - 1;
            return (
              <li key={item.titulo} className="relative flex gap-4 pb-8 last:pb-0">
                {/* Linha vertical ligando os marcos */}
                {!ultimo && <span className="absolute left-[11px] top-7 bottom-0 w-0.5 bg-[#e5e7eb]" aria-hidden />}
                <span
                  className={`relative z-10 mt-1 h-6 w-6 shrink-0 rounded-full border-4 ${
                    item.destaque ? 'border-[#374151] bg-[#374151]' : 'border-[#d1d5db] bg-white'
                  }`}
                  aria-hidden
                />
                <section className="min-w-0 flex-1" aria-labelledby={`marco-${i}`}>
                  {item.marco !== item.titulo && (
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">{item.marco}</p>
                  )}
                  <h2 id={`marco-${i}`} className="text-xl font-bold text-[#374151]">{item.titulo}</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#374151] [text-wrap:pretty] md:text-base">{item.texto}</p>
                </section>
              </li>
            );
          })}
        </ol>

        <section aria-labelledby="venha-visitar" className={`mt-10 p-5 text-center ${CARD_CLASS}`}>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6b7280]">Lugar de cura e recomeços</p>
          <h2 id="venha-visitar" className="mt-1 text-xl font-bold text-[#374151]">Venha nos visitar</h2>
          <address className="mt-2 not-italic text-sm leading-relaxed text-[#4b5563]">
            Templo Central · {ENDERECO.rua} – {ENDERECO.bairro}
            <br />
            {ENDERECO.cidade} · {ENDERECO.referencia}
          </address>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#374151] px-5 text-base font-semibold text-white transition-colors hover:bg-[#4b5563]"
            >
              <MapPin className="h-5 w-5" aria-hidden />
              Como chegar
            </a>
            <Link
              to="/departamentos"
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-[#6b7280]/30 bg-white px-5 text-base font-medium text-[#374151] transition-colors hover:bg-gray-50"
            >
              <Users className="h-5 w-5" aria-hidden />
              Departamentos
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
