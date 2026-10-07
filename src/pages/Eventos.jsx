import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle, Bell, BellOff, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

function WhatsAppIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
import { GOOGLE_CALENDAR_API_KEY as API_KEY, GOOGLE_CALENDAR_ID as CALENDAR_ID } from '../config/calendar.js';
import { isPushConfigured, VAPID_PUBLIC_KEY } from '../config/push.js';

function isImageAttachment(att) {
  if (att.mimeType?.startsWith('image/')) return true;
  if (!att.fileUrl) return false;
  const path = att.fileUrl.split('?')[0].toLowerCase();
  return /\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i.test(path);
}

function toDirectImageUrl(att) {
  const fileId = att.fileId ?? (att.fileUrl?.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1] ?? att.fileUrl?.match(/[?&]id=([a-zA-Z0-9_-]+)/)?.[1]);
  if (fileId) return `https://drive.google.com/uc?export=view&id=${fileId}`;
  if (att.fileUrl && !att.fileUrl.includes('drive.google.com')) return att.fileUrl;
  return null;
}

function getEventImageUrl(event) {
  const attachments = event.attachments ?? [];
  for (const att of attachments) {
    if (!att.fileUrl && !att.fileId) continue;
    if (!isImageAttachment(att)) continue;
    const direct = toDirectImageUrl(att);
    if (direct) return direct;
    if (att.fileUrl && !att.fileUrl.includes('drive.google.com')) return att.fileUrl;
  }
  if (event.description) {
    const imgMatch = event.description.match(/!\[[^\]]*\]\((https?:\/\/[^)]+)\)|<img[^>]+src=["'](https?:\/\/[^"']+)["']/i);
    if (imgMatch) return imgMatch[1] ?? null;
    const urlMatch = event.description.match(/(https?:\/\/[^\s<>"]+\.(?:jpg|jpeg|png|gif|webp))/i);
    if (urlMatch) return urlMatch[1];
  }
  return null;
}

function formatEventDateLong(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '—';
    const weekday = d.toLocaleDateString('pt-BR', { weekday: 'long' });
    const day = d.getDate();
    const month = d.toLocaleDateString('pt-BR', { month: 'long' });
    return `${weekday}, ${day} de ${month}`;
  } catch {
    return '—';
  }
}

/** Retorna o mesmo dia em meia-noite (UTC) para comparar apenas a data. */
function toCalendarDay(dateStr) {
  const d = new Date(dateStr);
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Formata uma ou duas datas: se start e end forem em dias diferentes, exibe as duas. */
function formatEventDateRangeLong(startStr, endStr, isAllDay) {
  const startFormatted = formatEventDateLong(startStr);
  if (!endStr || startFormatted === '—') return startFormatted;
  try {
    const startDay = toCalendarDay(startStr);
    const endDate = new Date(endStr);
    // No Google Calendar, all-day end é exclusivo (dia seguinte ao último)
    const endDayUtc = isAllDay
      ? Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) - 86400000
      : Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    if (startDay >= endDayUtc) return startFormatted;
    const lastDayDate = isAllDay ? (() => { const d = new Date(endStr); d.setUTCDate(d.getUTCDate() - 1); return d; })() : new Date(endStr);
    const endFormatted = formatEventDateLong(lastDayDate.toISOString());
    return `${startFormatted} a ${endFormatted}`;
  } catch {
    return startFormatted;
  }
}

function formatTimeRange(start, end, isAllDay) {
  if (isAllDay || !start) return '';
  try {
    const startStr = new Date(start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
    if (!end) return startStr;
    const endStr = new Date(end).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${startStr} - ${endStr}`;
  } catch {
    return '';
  }
}

function getMonthBounds(month, year) {
  const timeMin = new Date(year, month, 1);
  const timeMax = new Date(year, month + 1, 0, 23, 59, 59);
  return {
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
  };
}

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

/** Extrai a cidade do endereço (ex.: "..., Palmeira d'Oeste - SP, ...", "Jales, SP" ou só "Jales"). */
function getCityFromLocation(location) {
  if (!location || !String(location).trim()) return null;
  const s = String(location).trim();
  // Padrão "Cidade - UF" no meio ou fim (ex.: Centro, Palmeira d'Oeste - SP, 15720-000)
  const cityMinusUF = [...s.matchAll(/,\s*([^,]+?)\s*-\s*[A-Z]{2}\b/gi)];
  if (cityMinusUF.length > 0) {
    const city = cityMinusUF[cityMinusUF.length - 1][1].trim();
    if (city.length > 0) return city;
  }
  // Padrão "Cidade/UF" (ex.: ..., Jales/SP)
  const citySlashUF = [...s.matchAll(/,\s*([^,/]+?)\s*\/\s*[A-Z]{2}\b/gi)];
  if (citySlashUF.length > 0) {
    const city = citySlashUF[citySlashUF.length - 1][1].trim();
    if (city.length > 0) return city;
  }
  const parts = s.split(',').map((p) => p.trim()).filter(Boolean);
  // Apenas a cidade (ex.: "Jales" ou "Palmeira d'Oeste")
  if (parts.length === 1) return parts[0];
  // "Cidade, UF, Brasil" no fim: último é país, penúltimo é UF → cidade é o anterior à UF
  if (parts.length >= 3 && /^[A-Z]{2}$/i.test(parts[parts.length - 2])) return parts[parts.length - 3];
  // "Cidade, UF" no fim: último trecho é sigla de estado (2 letras) → cidade é o anterior
  if (parts.length >= 2 && /^[A-Z]{2}$/i.test(parts[parts.length - 1])) return parts[parts.length - 2];
  return parts[parts.length - 1];
}

const BADGE_COLORS = [
  'bg-blue-100 text-blue-800',
  'bg-emerald-100 text-emerald-800',
  'bg-amber-100 text-amber-800',
  'bg-violet-100 text-violet-800',
  'bg-rose-100 text-rose-800',
  'bg-sky-100 text-sky-800',
  'bg-teal-100 text-teal-800',
  'bg-orange-100 text-orange-800',
  'bg-fuchsia-100 text-fuchsia-800',
  'bg-lime-100 text-lime-800',
];

function getBadgeColorForCity(city) {
  if (!city) return 'bg-[#e5e7eb] text-[#374151]';
  let hash = 0;
  const str = String(city).toLowerCase();
  for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i) | 0;
  const index = Math.abs(hash) % BADGE_COLORS.length;
  return BADGE_COLORS[index];
}

function getEventShareUrl(event) {
  if (typeof window === 'undefined' || !event?.id) return '';
  return `${window.location.origin}/evento/${encodeURIComponent(event.id)}`;
}

function buildWhatsAppShareText(event, start, isAllDay, dateRangeLabel, formatTimeRange) {
  const title = event.summary?.trim() || 'Evento';
  const timeLabel = formatTimeRange(start, event.end?.dateTime ?? event.end?.date, isAllDay);
  const link = getEventShareUrl(event) || (typeof window !== 'undefined' ? `${window.location.origin}/eventos` : '');
  const lines = [
    `*${title}*`,
    '',
    `📅 ${dateRangeLabel}`,
    ...(timeLabel ? [`🕐 ${timeLabel}`] : []),
    ...(event.location ? [`📍 ${event.location}`] : []),
    '',
    `Confira a programação: ${link}`,
  ];
  return lines.join('\n');
}

function shareOnWhatsApp(event) {
  const start = event.start?.dateTime || event.start?.date;
  const end = event.end?.dateTime || event.end?.date;
  const isAllDay = !!event.start?.date;
  const dateRangeLabel = formatEventDateRangeLong(start, end, isAllDay);
  const text = buildWhatsAppShareText(event, start, isAllDay, dateRangeLabel, formatTimeRange);
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
}

function getMapsUrl(location) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

function isSameDay(dateStr, ref) {
  const d = new Date(dateStr);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth() && d.getDate() === ref.getDate();
}

/** Nome do evento normalizado, para agrupar eventos iguais cadastrados avulsos no Google Calendar. */
function getTitleKey(event) {
  return (event.summary || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

/**
 * Separa os eventos do mês em programação semanal (repetições no Google Calendar
 * ou mesmo nome mais de uma vez no mês) e eventos especiais (aparecem uma vez só).
 */
function splitEvents(events) {
  const groups = new Map();
  for (const event of events) {
    const key = getTitleKey(event) || event.id;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(event);
  }
  const weekly = [];
  const special = [];
  for (const group of groups.values()) {
    if (group.length > 1 || group[0].recurringEventId) weekly.push(group);
    else special.push(group[0]);
  }
  return { weekly, special };
}

function getWeekdayLabel(group) {
  const weekdays = new Set(group.map((e) => new Date(e.start?.dateTime || e.start?.date).getDay()));
  if (weekdays.size !== 1) return null;
  const sample = new Date(group[0].start?.dateTime || group[0].start?.date);
  const weekday = sample.toLocaleDateString('pt-BR', { weekday: 'long' });
  const isWeekend = sample.getDay() === 0 || sample.getDay() === 6;
  return `${isWeekend ? 'Todo' : 'Toda'} ${weekday}`;
}

function ShareButton({ event, compact = false }) {
  return (
    <button
      type="button"
      onClick={() => shareOnWhatsApp(event)}
      className={
        compact
          ? 'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#6b7280]/30 bg-white text-[#374151] transition-colors hover:bg-gray-50 active:bg-gray-100'
          : 'inline-flex min-h-11 items-center gap-2 rounded-full border border-[#6b7280]/30 bg-white px-4 text-sm font-medium text-[#374151] transition-colors hover:bg-gray-50 active:bg-gray-100'
      }
      aria-label={`Enviar ${event.summary?.trim() || 'evento'} no WhatsApp`}
    >
      <WhatsAppIcon className={compact ? 'h-5 w-5' : 'h-4 w-4'} />
      {!compact && 'Enviar no WhatsApp'}
    </button>
  );
}

function MapsLink({ location }) {
  if (!location) return null;
  return (
    <a
      href={getMapsUrl(location)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-[#374151] underline decoration-[#6b7280]/50 underline-offset-2 hover:decoration-[#374151]"
    >
      <MapPin className="h-4 w-4 shrink-0" aria-hidden />
      Como chegar
    </a>
  );
}

function EventImage({ imageUrl, className }) {
  const [imgError, setImgError] = useState(false);
  if (!imageUrl || imgError) return null;
  return (
    <div className={`overflow-hidden bg-[#f3f4f6] ${className}`}>
      <img
        src={imageUrl}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

/** Evento que aparece uma vez no mês: cartão em destaque com a data em evidência. */
function SpecialEventCard({ event, today }) {
  const start = event.start?.dateTime || event.start?.date;
  const end = event.end?.dateTime || event.end?.date;
  const isAllDay = !!event.start?.date;
  const d = new Date(start);
  const city = getCityFromLocation(event.location);
  const timeLabel = formatTimeRange(start, end, isAllDay);
  const dateRangeLabel = formatEventDateRangeLong(start, end, isAllDay);
  const isToday = isSameDay(start, today);

  return (
    <article
      data-event-id={event.id || undefined}
      className="flex scroll-mt-6 flex-col overflow-hidden rounded-2xl border border-[#e5e7eb]/80 bg-white shadow-md"
    >
      <EventImage imageUrl={getEventImageUrl(event)} className="aspect-[16/9] w-full" />
      <div className="flex gap-4 p-4">
        <div
          className={`flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-xl ${
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
          {city && (
            <span className={`mb-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${getBadgeColorForCity(city)}`}>
              {city}
            </span>
          )}
          <h3 className="text-lg font-bold leading-snug text-[#374151]">{event.summary?.trim() || 'Sem título'}</h3>
          <p className="mt-1 text-sm text-[#4b5563]">
            {dateRangeLabel.charAt(0).toUpperCase() + dateRangeLabel.slice(1)}
            {timeLabel && <span className="font-semibold text-[#374151]"> · {timeLabel}</span>}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-[#e5e7eb] px-4 py-1.5">
        {event.location ? <MapsLink location={event.location} /> : <span />}
        <ShareButton event={event} compact />
      </div>
    </article>
  );
}

/** Culto que se repete no mês: um cartão só, com as datas em chips. */
function WeeklySeriesCard({ group, today }) {
  const first = group[0];
  const start = first.start?.dateTime || first.start?.date;
  const end = first.end?.dateTime || first.end?.date;
  const isAllDay = !!first.start?.date;
  const timeLabels = new Set(group.map((e) => formatTimeRange(e.start?.dateTime || e.start?.date, e.end?.dateTime || e.end?.date, !!e.start?.date)));
  const sameTime = timeLabels.size === 1;
  const timeLabel = sameTime ? formatTimeRange(start, end, isAllDay) : '';
  const weekdayLabel = getWeekdayLabel(group);
  const imageUrl = group.map(getEventImageUrl).find(Boolean);

  return (
    <article className="rounded-2xl border border-[#e5e7eb]/80 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <EventImage imageUrl={imageUrl} className="h-14 w-14 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-snug text-[#374151]">{first.summary?.trim() || 'Sem título'}</h3>
          <p className="mt-0.5 text-sm text-[#4b5563]">
            {weekdayLabel && <span className="first-letter:uppercase">{weekdayLabel}</span>}
            {weekdayLabel && timeLabel && ' · '}
            {timeLabel && <span className="font-semibold text-[#374151]">{timeLabel}</span>}
          </p>
        </div>
        <ShareButton event={first} compact />
      </div>
      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Datas">
        {group.map((event) => {
          const s = event.start?.dateTime || event.start?.date;
          const isToday = isSameDay(s, today);
          const d = new Date(s);
          const chipTime = sameTime ? '' : formatTimeRange(s, null, !!event.start?.date);
          return (
            <li
              key={event.id}
              data-event-id={event.id || undefined}
              className={`scroll-mt-6 rounded-full px-3 py-1.5 text-sm font-semibold ${
                isToday ? 'bg-[#374151] text-white' : 'bg-[#f3f4f6] text-[#374151]'
              }`}
            >
              {isToday ? 'Hoje' : `${d.getDate()}/${String(d.getMonth() + 1).padStart(2, '0')}`}
              {chipTime && <span className="font-normal"> · {chipTime}</span>}
            </li>
          );
        })}
      </ul>
      {first.location && (
        <div className="mt-1">
          <MapsLink location={first.location} />
        </div>
      )}
    </article>
  );
}

export default function Eventos() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const [pushError, setPushError] = useState(null);
  const [swReg, setSwReg] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      let items = [];

      const apiUrl = `/api/calendar-events?month=${month}&year=${year}`;
      const apiRes = await fetch(apiUrl, { signal: controller.signal });

      if (apiRes.ok) {
        const data = await apiRes.json();
        items = data.items || [];
      } else if (API_KEY && CALENDAR_ID) {
        const { timeMin, timeMax } = getMonthBounds(month, year);
        const calendarId = encodeURIComponent(CALENDAR_ID);
        const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?` +
          `key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&maxResults=50`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error?.message || `Erro ${res.status}`);
        }
        const data = await res.json();
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const startOfTodayMs = startOfToday.getTime();
        items = (data.items || []).filter((e) => {
          if (e.status === 'cancelled') return false;
          const start = e.start?.dateTime || e.start?.date;
          if (!start) return false;
          const d = new Date(start);
          const eventStartMs = e.start?.date
            ? new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
            : d.getTime();
          return eventStartMs >= startOfTodayMs;
        });
      } else {
        const data = await apiRes.json().catch(() => ({}));
        throw new Error(data.error || `Erro ${apiRes.status}`);
      }

      clearTimeout(timeoutId);
      setEvents(items);
    } catch (err) {
      setEvents([]);
      if (err?.name === 'AbortError') {
        setError('A requisição demorou demais. Tente novamente.');
      } else {
        setError(err instanceof Error ? err.message : 'Falha ao carregar eventos.');
      }
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (!isPushConfigured || typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) return;
    setPushSupported(true);
    navigator.serviceWorker.register(new URL('../sw.js', import.meta.url)).then((reg) => {
      setSwReg(reg);
      reg.pushManager.getSubscription().then((sub) => setPushSubscribed(!!sub));
    }).catch(() => setPushSupported(false));
  }, []);

  const urlBase = typeof window !== 'undefined' ? window.location.origin : '';

  const handlePushSubscribe = async () => {
    if (!swReg || !VAPID_PUBLIC_KEY || pushSubscribed) return;
    setPushError(null);
    setPushLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setPushError('Notificações foram bloqueadas.');
        setPushLoading(false);
        return;
      }
      const key = VAPID_PUBLIC_KEY.replace(/-/g, '+').replace(/_/g, '/');
      const keyBytes = Uint8Array.from(atob(key), (c) => c.charCodeAt(0));
      const sub = await swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: keyBytes,
      });
      const res = await fetch(`${urlBase}/api/push-subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPushError(data.error || 'Erro ao ativar lembretes.');
        return;
      }
      setPushSubscribed(true);
    } catch (err) {
      setPushError(err instanceof Error ? err.message : 'Erro ao ativar.');
    } finally {
      setPushLoading(false);
    }
  };

  const handlePushUnsubscribe = async () => {
    if (!swReg || !pushSubscribed) return;
    setPushError(null);
    setPushLoading(true);
    try {
      const sub = await swReg.pushManager.getSubscription();
      if (sub) {
        await fetch(`${urlBase}/api/push-unsubscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: sub.toJSON() }),
        });
        await sub.unsubscribe();
      }
      setPushSubscribed(false);
    } catch (err) {
      setPushError(err instanceof Error ? err.message : 'Erro ao desativar.');
    } finally {
      setPushLoading(false);
    }
  };

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);
  const [searchParams] = useSearchParams();
  const eventIdFromUrl = searchParams.get('e');

  useEffect(() => {
    if (!eventIdFromUrl || loading || events.length === 0) return;
    const decoded = decodeURIComponent(eventIdFromUrl);
    const found = events.some((ev) => ev.id === decoded);
    if (!found) return;
    const el = document.querySelector(`[data-event-id="${CSS.escape(decoded)}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [eventIdFromUrl, loading, events]);

  const minYear = years[0];
  const maxYear = years[years.length - 1];
  const canGoPrev = !(year === minYear && month === 0);
  const canGoNext = !(year === maxYear && month === 11);
  const isCurrentMonth = month === now.getMonth() && year === now.getFullYear();

  const goToMonth = (delta) => {
    const next = new Date(year, month + delta, 1);
    setMonth(next.getMonth());
    setYear(next.getFullYear());
  };

  const goToToday = () => {
    setMonth(now.getMonth());
    setYear(now.getFullYear());
  };

  const { weekly, special } = splitEvents(events);

  return (
    <div className="min-h-screen bg-white pt-8 pb-[calc(8rem+env(safe-area-inset-bottom))] lg:pt-28 lg:pb-24">
      <div className="max-w-5xl mx-auto px-4">
        <header className="mb-5 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#374151] tracking-tight">
            Eventos
          </h1>
          <p className="mt-1 text-[#4b5563] text-sm md:text-base">
            Confira a programação da igreja
          </p>
        </header>

        <nav aria-label="Escolher mês" className="mb-6 flex flex-col items-center gap-1">
          <div className="flex w-full max-w-sm items-center justify-between rounded-full border border-[#e5e7eb] bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => goToMonth(-1)}
              disabled={!canGoPrev}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#374151] transition-colors hover:bg-gray-100 active:bg-gray-200 disabled:opacity-30"
              aria-label="Mês anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <p className="text-base font-semibold text-[#374151]" aria-live="polite">
              {MONTHS[month]} {year}
            </p>
            <button
              type="button"
              onClick={() => goToMonth(1)}
              disabled={!canGoNext}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#374151] transition-colors hover:bg-gray-100 active:bg-gray-200 disabled:opacity-30"
              aria-label="Próximo mês"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          {!isCurrentMonth && (
            <button
              type="button"
              onClick={goToToday}
              className="min-h-11 px-3 text-sm font-medium text-[#374151] underline underline-offset-2"
            >
              Voltar para o mês atual
            </button>
          )}
        </nav>

        {isPushConfigured && pushSupported && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#e5e7eb]/80 bg-[#f9fafb] p-3">
            <Bell className="h-5 w-5 shrink-0 text-[#374151]" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-[#374151]">Lembrete no celular 1 hora antes de cada evento</p>
              {pushError && (
                <p className="mt-1 text-sm text-amber-600" role="alert">{pushError}</p>
              )}
            </div>
            {pushSubscribed ? (
              <button
                type="button"
                onClick={handlePushUnsubscribe}
                disabled={pushLoading}
                className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-[#6b7280]/30 bg-white px-3 text-sm font-medium text-[#374151] transition-colors hover:bg-gray-50"
                aria-label="Desativar lembretes"
              >
                <BellOff className="h-4 w-4" />
                {pushLoading ? 'Desativando…' : 'Desativar'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePushSubscribe}
                disabled={pushLoading}
                className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-[#374151] px-4 text-sm font-medium text-white transition-colors hover:bg-[#4b5563] disabled:opacity-70"
                aria-label="Ativar lembretes 1 hora antes"
              >
                {pushLoading ? 'Ativando…' : 'Ativar'}
              </button>
            )}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#6b7280]" aria-hidden />
            <p className="text-sm text-[#374151]">Carregando eventos...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 mb-6">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <p className="text-center text-[#374151] py-12">
            Nenhum evento encontrado para {MONTHS[month]} de {year}.
          </p>
        )}

        {!loading && special.length > 0 && (
          <section aria-labelledby="eventos-especiais" className="mb-10">
            <h2 id="eventos-especiais" className="mb-3 text-lg font-semibold text-[#374151]">
              Eventos especiais
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
              {special.map((event) => (
                <SpecialEventCard key={event.id} event={event} today={now} />
              ))}
            </div>
          </section>
        )}

        {!loading && weekly.length > 0 && (
          <section aria-labelledby="programacao-semanal">
            <h2 id="programacao-semanal" className="mb-3 text-lg font-semibold text-[#374151]">
              Programação semanal
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-4">
              {weekly.map((group) => (
                <WeeklySeriesCard key={group[0].id} group={group} today={now} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
