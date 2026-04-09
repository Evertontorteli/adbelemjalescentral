import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronUp, Home, Calendar, Heart, Church, Users, FileText, X } from 'lucide-react';
function LogoSmall() {
  return (
    <div className="relative size-10 shrink-0 flex items-center justify-center">
      <img src="/static/LogoBleia.svg" alt="AD Belém Jales" className="block size-full object-contain" />
    </div>
  );
}

const menuItemsDesktop = [
  { label: 'Início', to: '/' },
  { label: 'Eventos', to: '/eventos' },
  { label: 'Igreja', to: '/igreja' },
  { label: 'Doação', to: '/doacao' },
  { label: 'Departamentos', to: '/departamentos' },
  { label: 'Edital', to: '/edital' }
];

const menuItemsMobileMain = [
  { label: 'Início', to: '/', Icon: Home },
  { label: 'Eventos', to: '/eventos', Icon: Calendar },
  { label: 'Doação', to: '/doacao', Icon: Heart }
];

const menuItemsMobileMais = [
  { label: 'Igreja', to: '/igreja', Icon: Church },
  { label: 'Departamentos', to: '/departamentos', Icon: Users },
  { label: 'Edital', to: '/edital', Icon: FileText }
];

const DESKTOP_BREAKPOINT_PX = 1024;

function isMobileItemActive(pathname, to) {
  if (to === '/') return pathname === '/';
  return pathname === to || pathname.startsWith(to + '/');
}

export function Navigation() {
  const { pathname } = useLocation();
  const [isMaisOpen, setIsMaisOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth >= DESKTOP_BREAKPOINT_PX
  );

  const isMaisActive = pathname === '/igreja' || pathname === '/departamentos' || pathname === '/edital';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT_PX}px)`);
    const handleChange = (e) => setIsDesktop(e.matches);
    setIsDesktop(mql.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  const handleLinkClick = () => {
    setIsMaisOpen(false);
  };

  const headerScrolledClass = isScrolled
    ? 'bg-white shadow-lg'
    : 'bg-white/95 backdrop-blur-sm shadow-md';

  return (
    <>
      {isDesktop && (
        <header
          aria-label="Navegação principal"
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerScrolledClass}`}
        >
          <nav className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between h-20">
              <Link
                to="/"
                className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
              >
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  <LogoSmall />
                </div>
                <span className="text-[#374151] tracking-wide">AD BELÉM JALES</span>
              </Link>
              <div className="flex items-center gap-1">
                {menuItemsDesktop.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="px-4 py-2 text-[#374151] hover:text-[#374151] transition-all duration-300 relative group"
                  >
                    <span className="relative z-10">{item.label}</span>
                    <span className="absolute inset-0 bg-[#e5e7eb]/60 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" />
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </header>
      )}

      {isMaisOpen && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 99999 }}
          aria-modal="true"
          role="dialog"
          aria-label="Mais opções"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Fechar"
            onClick={() => setIsMaisOpen(false)}
          />
          <div
            className="absolute w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-xl"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 100000 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-medium text-[#374151]">Mais opções</h2>
              <button
                type="button"
                className="rounded-lg p-2 text-[#374151] hover:bg-[#e5e7eb]/50"
                aria-label="Fechar"
                onClick={() => setIsMaisOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {menuItemsMobileMais.map((item) => {
                const Icon = item.Icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={handleLinkClick}
                    className="flex items-center gap-4 rounded-xl border border-[#e5e7eb] bg-white py-4 px-5 text-[#374151] transition-colors hover:bg-gray-50 active:bg-gray-100"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <Icon className="h-6 w-6 text-[#374151]" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!isDesktop && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e5e7eb] rounded-t-[2rem] shadow-[0_-4px_24px_rgba(0,0,0,0.12)] safe-area-pb pt-3 pb-4 px-3">
          <div className="flex items-stretch max-w-lg mx-auto">
            {menuItemsMobileMain.map((item) => {
              const Icon = item.Icon;
              const active = isMobileItemActive(pathname, item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={handleLinkClick}
                  className={`flex-1 py-3 px-2 flex flex-col items-center gap-1.5 text-sm transition-colors touch-manipulation ${
                    active
                      ? 'font-bold text-[#1f2937] hover:text-[#1f2937] active:bg-[#e5e7eb]/30'
                      : 'font-medium text-[#374151] hover:text-[#374151] active:bg-[#e5e7eb]/30'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-[#1f2937]' : ''}`} strokeWidth={active ? 2.5 : 2} />
                  <span className={active ? 'font-bold' : ''}>{item.label}</span>
                </Link>
              );
            })}
            <button
              type="button"
              aria-label="Abrir mais opções"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMaisOpen(true);
              }}
              className={`flex-1 py-3 px-2 flex flex-col items-center gap-1.5 text-sm transition-colors touch-manipulation ${
                isMaisActive
                  ? 'font-bold text-[#1f2937] hover:text-[#1f2937] active:bg-[#e5e7eb]/30'
                  : 'font-medium text-[#374151] hover:text-[#374151] active:bg-[#e5e7eb]/30'
              }`}
            >
              <ChevronUp className={`w-5 h-5 shrink-0 ${isMaisActive ? 'text-[#1f2937]' : ''}`} strokeWidth={isMaisActive ? 2.5 : 2} />
              <span className={isMaisActive ? 'font-bold' : ''}>Mais</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
