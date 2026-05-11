import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { inject as injectAnalytics, pageview } from '@vercel/analytics';
import { Navigation } from './components/Navigation.jsx';
import { Inicio } from './pages/Inicio.jsx';
import EventosPage from './pages/Eventos.jsx';
import IgrejaPage from './pages/Igreja.jsx';
import DoacaoPage from './pages/Doacao.jsx';
import DepartamentosPage from './pages/Departamentos.jsx';

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
      </Routes>
      <SpeedInsightsRouter />
      <VercelAnalytics />
    </BrowserRouter>
  );
}
