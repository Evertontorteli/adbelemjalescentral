import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar as CalendarIcon, Loader2, AlertCircle, Bell, BellOff } from 'lucide-react';

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

function getDayMonth(dateStr) {
  if (!dateStr) return { day: '—', month: '' };
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return { day: '—', month: '' };
    return {
      day: d.getDate().toString(),
      month: d.toLocaleDateString('pt-BR', { month: 'long' }),
    };
  } catch {
    return { day: '—', month: '' };
  }
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

function formatEventDate(dateStr, isAllDay) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '—';
    if (isAllDay) {
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    }
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
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
  const title = event.summary || 'Evento';
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

function EventCard({ event, start, isAllDay, imageUrl, city, badgeColorClass, dateRangeLabel, formatTimeRange }) {
  const [imgError, setImgError] = useState(false);
  const showImage = imageUrl != null && !imgError;
  const timeLabel = formatTimeRange(start, event.end?.dateTime ?? event.end?.date, isAllDay);

  const handleShareWhatsApp = () => {
    const text = buildWhatsAppShareText(event, start, isAllDay, dateRangeLabel, formatTimeRange);
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const showBadge = city != null && String(city).trim() !== '';

  return (
    <article
      data-event-id={event.id || undefined}
      className="flex flex-col overflow-hidden rounded-2xl bg-white p-4 w-full min-h-0 transition-all duration-300 hover:shadow-xl shadow-lg border border-[#e5e7eb]/80"
    >
      {showBadge && (
        <div className="mb-2">
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${badgeColorClass}`}>
            {city}
          </span>
        </div>
      )}
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-[26px] font-bold text-[#374151] leading-tight mt-0">
            {event.summary || 'Sem título'}
          </h2>
          {event.location && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-[24px] block text-[#374151] text-sm leading-snug line-clamp-2 underline decoration-[#6b7280]/50 underline-offset-2 hover:decoration-[#374151] transition-colors"
            >
              {event.location}
            </a>
          )}
        </div>
        {showImage ? (
          <div className="w-[100px] h-[100px] shrink-0 rounded-xl overflow-hidden bg-[#f3f4f6]">
            <img
              src={imageUrl}
              alt=""
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className="w-[100px] h-[100px] shrink-0 rounded-xl bg-[#f3f4f6] flex items-center justify-center">
            <CalendarIcon className="h-10 w-10 text-[#6b7280]/60" aria-hidden />
          </div>
        )}
      </div>
      <div className="mt-3 pt-2 flex items-center justify-between gap-2 border-t border-[#e5e7eb]">
        <p className="text-sm font-semibold text-[#374151]">
          {dateRangeLabel}
        </p>
        {timeLabel && (
          <p className="text-sm font-semibold text-[#374151] shrink-0 ml-auto">
            {timeLabel}
          </p>
        )}
      </div>
      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#374151] border border-[#6b7280]/30 rounded-full px-4 py-2 text-sm font-medium transition-all shadow-sm hover:shadow"
          aria-label="Enviar no WhatsApp"
        >
          <WhatsAppIcon className="w-4 h-4" />
          Enviar no WhatsApp
        </button>
      </div>
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

  return (
    <div className="min-h-screen bg-white pt-24 pb-40 md:pt-28 md:pb-24">
      <div className="max-w-5xl mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#374151] tracking-tight">
            Eventos
          </h1>
          <p className="mt-2 text-[#374151] text-sm md:text-base">
            Confira a programação da igreja
          </p>
        </header>

        <div className="mb-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-6 py-4">
          <span className="text-sm font-semibold text-[#374151] tracking-wide shrink-0">Filtrar por:</span>
          <div className="flex flex-nowrap items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center sm:justify-start">
            <div className="flex items-center gap-2">
              <label htmlFor="month" className="text-sm font-medium text-[#374151] shrink-0">Mês</label>
              <select
                id="month"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="rounded-full border border-[#6b7280]/30 bg-white hover:bg-gray-50 text-[#374151] text-sm pl-4 pr-9 py-3 min-h-[2.75rem] min-w-[10rem] w-auto leading-normal transition-all shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#374151]/30 focus:ring-offset-2 appearance-none"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i}>{m}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="year" className="text-sm font-medium text-[#374151] shrink-0">Ano</label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="rounded-full border border-[#6b7280]/30 bg-white hover:bg-gray-50 text-[#374151] text-sm pl-4 pr-9 py-3 min-h-[2.75rem] min-w-[5.5rem] w-auto leading-normal transition-all shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#374151]/30 focus:ring-offset-2 appearance-none"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isPushConfigured && pushSupported && (
          <div className="mb-6 mx-4 rounded-2xl border border-[#e5e7eb]/80 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-[#374151] mb-2">
              Receba um lembrete no celular 1 hora antes de cada evento
            </p>
            {pushError && (
              <p className="text-sm text-amber-600 mb-2" role="alert">{pushError}</p>
            )}
            {pushSubscribed ? (
              <button
                type="button"
                onClick={handlePushUnsubscribe}
                disabled={pushLoading}
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#374151] border border-[#6b7280]/30 rounded-full px-4 py-2 text-sm font-medium transition-all shadow-sm"
                aria-label="Desativar lembretes"
              >
                <BellOff className="w-4 h-4" />
                {pushLoading ? 'Desativando…' : 'Desativar lembretes'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePushSubscribe}
                disabled={pushLoading}
                className="inline-flex items-center gap-2 bg-[#374151] hover:bg-[#4b5563] text-white rounded-full px-4 py-2 text-sm font-medium transition-all shadow-sm disabled:opacity-70"
                aria-label="Ativar lembretes 1 hora antes"
              >
                <Bell className="w-4 h-4" />
                {pushLoading ? 'Ativando…' : 'Ativar lembretes'}
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

        {!loading && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {events.map((event) => {
              const start = event.start?.dateTime || event.start?.date;
              const end = event.end?.dateTime || event.end?.date;
              const isAllDay = !!event.start?.date;
              const imageUrl = getEventImageUrl(event);
              const city = getCityFromLocation(event.location);
              const badgeColorClass = getBadgeColorForCity(city);
              const dateRangeLabel = formatEventDateRangeLong(start, end, isAllDay);
              return (
                <EventCard
                  key={event.id}
                  event={event}
                  start={start}
                  isAllDay={isAllDay}
                  imageUrl={imageUrl}
                  city={city}
                  badgeColorClass={badgeColorClass}
                  dateRangeLabel={dateRangeLabel}
                  formatTimeRange={formatTimeRange}
                />
              );
            })}
          </div>
        )}

        <div className="h-40 md:h-24 w-full flex-shrink-0" aria-hidden />
      </div>
    </div>
  );
}
