/**
 * Funções compartilhadas para ler os eventos do Google Calendar
 * (usadas na página Eventos e no bloco "Próximos eventos" do Início).
 */

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

export function getEventImageUrl(event) {
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

export function formatTimeRange(start, end, isAllDay) {
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

export function isSameDay(dateStr, ref) {
  const d = new Date(dateStr);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth() && d.getDate() === ref.getDate();
}

/** Busca os eventos de um mês pela API do site (proxy do Google Calendar). */
export async function fetchMonthEvents(month, year, signal) {
  const res = await fetch(`/api/calendar-events?month=${month}&year=${year}`, { signal });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Erro ${res.status}`);
  }
  const data = await res.json();
  return data.items || [];
}
