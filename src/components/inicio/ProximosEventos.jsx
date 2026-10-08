import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { fetchMonthEvents, formatTimeRange, isSameDay } from '../../utils/eventos.js';

const QUANTIDADE = 3;

function getStart(event) {
  return event.start?.dateTime || event.start?.date;
}

/** Ainda não terminou (eventos de hoje que já acabaram ficam de fora). */
function isUpcoming(event, now) {
  const end = event.end?.dateTime || event.end?.date || getStart(event);
  return new Date(end).getTime() > now.getTime();
}

/** Próximos eventos do Google Calendar (mês atual e, se precisar, o seguinte). */
export function ProximosEventos() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const now = new Date();
    (async () => {
      try {
        let items = (await fetchMonthEvents(now.getMonth(), now.getFullYear(), controller.signal))
          .filter((e) => isUpcoming(e, now));
        if (items.length < QUANTIDADE) {
          const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          const more = await fetchMonthEvents(next.getMonth(), next.getFullYear(), controller.signal);
          items = items.concat(more);
        }
        setEvents(items.slice(0, QUANTIDADE));
      } catch (err) {
        if (err?.name !== 'AbortError') setError(true);
      }
    })();
    return () => controller.abort();
  }, []);

  const today = new Date();

  return (
    <section aria-labelledby="proximos-eventos" className="px-4">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 id="proximos-eventos" className="text-lg font-semibold text-[#374151]">
          Próximos eventos
        </h2>
        <Link to="/eventos" className="inline-flex min-h-11 items-center text-sm font-medium text-[#374151] underline underline-offset-2">
          Ver todos
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e5e7eb]/80 bg-white shadow-[0_6px_20px_rgba(17,24,39,0.10)]">
        {events === null && !error && (
          <ul aria-label="Carregando eventos">
            {Array.from({ length: QUANTIDADE }, (_, i) => (
              <li key={i} className="flex items-center gap-4 border-b border-[#e5e7eb] p-4 last:border-b-0">
                <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-[#f3f4f6]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-[#f3f4f6]" />
                  <div className="h-3 w-1/3 animate-pulse rounded bg-[#f3f4f6]" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {(error || (events && events.length === 0)) && (
          <Link to="/eventos" className="flex min-h-11 items-center justify-between gap-3 p-4 text-sm text-[#374151]">
            {error ? 'Não foi possível carregar agora. Ver programação' : 'Nenhum evento nos próximos dias. Ver programação'}
            <ChevronRight className="h-5 w-5 shrink-0 text-[#6b7280]" aria-hidden />
          </Link>
        )}

        {events && events.length > 0 && (
          <ul>
            {events.map((event) => {
              const start = getStart(event);
              const d = new Date(start);
              const isToday = isSameDay(start, today);
              const timeLabel = formatTimeRange(start, event.end?.dateTime || event.end?.date, !!event.start?.date);
              return (
                <li key={event.id} className="border-b border-[#e5e7eb] last:border-b-0">
                  <Link
                    to={`/eventos?e=${encodeURIComponent(event.id)}&m=${d.getMonth()}&y=${d.getFullYear()}`}
                    className="flex items-center gap-4 p-4 transition-colors hover:bg-gray-50 active:bg-gray-100"
                  >
                    <div
                      className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl ${
                        isToday ? 'bg-[#374151] text-white' : 'bg-[#f3f4f6] text-[#374151]'
                      }`}
                      aria-hidden
                    >
                      <span className="text-[11px] font-semibold uppercase leading-none">
                        {isToday ? 'Hoje' : d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
                      </span>
                      <span className="mt-1 text-2xl font-bold leading-none">{d.getDate()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-bold text-[#374151]">{event.summary?.trim() || 'Evento'}</p>
                      <p className="text-sm text-[#4b5563]">
                        <span className="sr-only">{d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}, </span>
                        {timeLabel || 'Dia todo'}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-[#6b7280]" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
