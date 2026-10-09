import { Link } from 'react-router-dom';
import { HandHeart, Heart, History, Users, MapPin, Instagram, Facebook } from 'lucide-react';
import { Footer } from '../components/Footer.jsx';
import { Apresentacao } from '../components/inicio/Apresentacao.jsx';
import { ProximosEventos } from '../components/inicio/ProximosEventos.jsx';
import { Pastor } from '../components/Pastor.jsx';
import { ENDERECO, MAPS_URL, ORACAO_URL, INSTAGRAM_URL, FACEBOOK_URL } from '../config/contato.js';

const ATALHOS = [
  { label: 'Pedido de oração', href: ORACAO_URL, Icon: HandHeart, externo: true },
  { label: 'Fazer uma doação', to: '/doacao', Icon: Heart },
  { label: 'Nossa história', to: '/igreja', Icon: History },
  { label: 'Departamentos', to: '/departamentos', Icon: Users },
];

const ATALHO_CLASS =
  'flex w-[6.25rem] shrink-0 snap-start flex-col items-center gap-2 rounded-2xl border border-[#e5e7eb]/80 bg-white px-1 py-3 text-center text-[#374151] shadow-[0_6px_20px_rgba(17,24,39,0.10)] transition-colors hover:bg-gray-50 active:bg-gray-100 md:w-auto md:flex-1';

/** Faixa de atalhos que desliza para o lado no celular; no computador cabem todos lado a lado. */
function Atalhos() {
  return (
    <nav
      aria-label="Atalhos"
      className="sem-barra-rolagem -mb-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pt-1 pb-4 md:overflow-visible"
    >
      {ATALHOS.map(({ label, to, href, Icon, externo }) => {
        const conteudo = (
          <>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f4f6]" aria-hidden>
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold leading-tight">{label}</span>
          </>
        );
        return externo ? (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={ATALHO_CLASS}>
            {conteudo}
          </a>
        ) : (
          <Link key={label} to={to} className={ATALHO_CLASS}>
            {conteudo}
          </Link>
        );
      })}
      {/* Espaço no fim da faixa: o padding direito some em listas com rolagem horizontal */}
      <span className="w-px shrink-0 md:hidden" aria-hidden />
    </nav>
  );
}

function OndeEstamos() {
  return (
    <section aria-labelledby="onde-estamos" className="px-4">
      <h2 id="onde-estamos" className="mb-3 text-lg font-semibold text-[#374151]">
        Onde estamos
      </h2>
      <div className="rounded-2xl border border-[#e5e7eb]/80 bg-white p-4 shadow-[0_6px_20px_rgba(17,24,39,0.10)]">
        <p className="text-base font-bold text-[#374151]">Templo Central</p>
        <address className="mt-1 not-italic text-sm leading-relaxed text-[#4b5563]">
          {ENDERECO.rua} – {ENDERECO.bairro}
          <br />
          {ENDERECO.cidade} · {ENDERECO.referencia}
        </address>
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#374151] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#4b5563]"
        >
          <MapPin className="h-4 w-4" aria-hidden />
          Como chegar
        </a>
      </div>
    </section>
  );
}

function RedesSociais() {
  const linkClass =
    'flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-[#6b7280]/30 bg-white px-4 text-sm font-medium text-[#374151] transition-colors hover:bg-gray-50';
  return (
    <section aria-labelledby="redes-sociais" className="px-4">
      <h2 id="redes-sociais" className="mb-3 text-lg font-semibold text-[#374151]">
        Siga a igreja
      </h2>
      <div className="flex gap-3">
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
          <Instagram className="h-5 w-5" aria-hidden />
          Instagram
        </a>
        <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
          <Facebook className="h-5 w-5" aria-hidden />
          Facebook
        </a>
      </div>
    </section>
  );
}

export function Inicio() {
  return (
    <div className="bg-white pb-[calc(7rem+env(safe-area-inset-bottom))] lg:pb-0">
      <Apresentacao />
      <div className="mx-auto flex max-w-3xl flex-col gap-8 pt-5 pb-10 lg:pt-0">
        <Atalhos />
        <ProximosEventos />
        <Pastor />
        <OndeEstamos />
        <RedesSociais />
      </div>
      <Footer />
    </div>
  );
}
