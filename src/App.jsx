import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { inject as injectAnalytics, pageview } from '@vercel/analytics';
import { Navigation } from './components/Navigation.jsx';
import { Inicio } from './pages/Inicio.jsx';
import EventosPage from './pages/Eventos.jsx';
import IgrejaPage from './pages/Igreja.jsx';
import DoacaoPage from './pages/Doacao.jsx';
import DepartamentosPage from './pages/Departamentos.jsx';
import EditalPage from './pages/Edital.jsx';

function SpeedInsightsRouter() {
  const location = useLocation();
  const insightsRef = useRef(null);

  useEffect(() => {
    if (!insightsRef.current) {
      insightsRef.current = injectSpeedInsights({ route: location.pathname });
    }
  }, []);

  useEffect(() => {
    if (insightsRef.current?.setRoute) {
      insightsRef.current.setRoute(location.pathname);
    }
  }, [location.pathname]);

  return null;
}

function VercelAnalytics() {
  const location = useLocation();
  const injected = useRef(false);

  useEffect(() => {
    if (!injected.current) {
      injectAnalytics();
      injected.current = true;
    }
  }, []);

  useEffect(() => {
    pageview({ path: location.pathname });
  }, [location.pathname]);

  return null;
}

const HIDE_EDITAL_MODAL_KEY = 'adbelemjales_hide_edital_modal';

function EditalWelcomeModal() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const hideModal = window.localStorage.getItem(HIDE_EDITAL_MODAL_KEY) === 'true';
    if (!hideModal && location.pathname !== '/edital') {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const closeModal = () => {
    if (dontShowAgain) {
      window.localStorage.setItem(HIDE_EDITAL_MODAL_KEY, 'true');
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-label="Comunicado de edital">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Fechar aviso"
        onClick={closeModal}
      />

      <div className="relative w-full max-w-2xl rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-2xl md:p-7">
        <button
          type="button"
          onClick={closeModal}
          aria-label="Fechar aviso"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-md text-lg leading-none text-[#6b7280] transition-colors hover:bg-[#f3f4f6] hover:text-[#111827]"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold text-[#111827] md:text-2xl">Edital de Convocação</h2>
        <p className="mt-2 text-sm text-[#6b7280]">Assembleia Geral Extraordinária</p>

        <div className="mt-4 max-h-[52vh] overflow-y-auto rounded-xl border border-[#e5e7eb] bg-[#fffefb] p-4 text-justify font-serif text-[1rem] leading-7 text-[#111827] md:p-5">
          <p>
            A Igreja Evangélica Assembleia de Deus em Jales convoca todos os membros em pleno gozo de seus direitos estatutários para
            reunirem-se em Assembleia Geral Extraordinária, a realizar-se no templo central da Igreja, situado à Avenida Francisco
            Jalles, nº 3575, Vila Maria, Jales/SP, no dia <strong>09 de maio de 2026</strong>, às <strong>19:30h</strong>, em primeira
            convocação, ou às <strong>19:45h</strong>, em segunda convocação.
          </p>
          <p className="mt-3">
            <strong>Ordem do dia:</strong>
          </p>
          <p className="mt-2">1. Leitura e ciência do Regimento Interno da Igreja.</p>
          <p className="mt-1">
            2. Reforma do Estatuto Social da Igreja, com apreciação e deliberação acerca das alterações, supressões e acréscimos
            propostos.
          </p>
          <p className="mt-4">Jales/SP, 09 de abril de 2026.</p>
          <p className="mt-2 font-semibold">Pr. Cláudio de Oliveira - Pastor Presidente</p>
        </div>

        <label className="mt-5 flex items-center gap-3 p-1 text-sm text-[#374151]">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="h-4 w-4 accent-[#374151]"
          />
          Não exibir novamente
        </label>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/edital"
            onClick={closeModal}
            className="inline-flex items-center rounded-lg border border-[#d1d5db] px-4 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f3f4f6]"
          >
            Abrir página completa
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/eventos" element={<EventosPage />} />
        <Route path="/igreja" element={<IgrejaPage />} />
        <Route path="/doacao" element={<DoacaoPage />} />
        <Route path="/departamentos" element={<DepartamentosPage />} />
        <Route path="/edital" element={<EditalPage />} />
      </Routes>
      <EditalWelcomeModal />
      <SpeedInsightsRouter />
      <VercelAnalytics />
    </BrowserRouter>
  );
}
