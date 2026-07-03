/**
 * Proxy server-side para eventos do Google Calendar.
 * A chave fica só no servidor (variáveis GOOGLE_CALENDAR_* na Vercel).
 */

const apiKey = process.env.VITE_GOOGLE_CALENDAR_API_KEY || process.env.GOOGLE_CALENDAR_API_KEY;
const calendarId = process.env.VITE_GOOGLE_CALENDAR_ID || process.env.GOOGLE_CALENDAR_ID;

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  if (!apiKey || !calendarId) {
    return res.status(503).json({
      error: 'Calendário ainda não configurado. Em breve você poderá ver os eventos aqui.',
    });
  }

  const month = Number.parseInt(req.query.month, 10);
  const year = Number.parseInt(req.query.year, 10);
  if (Number.isNaN(month) || Number.isNaN(year) || month < 0 || month > 11) {
    return res.status(400).json({ error: 'Parâmetros month e year inválidos.' });
  }

  const timeMin = new Date(year, month, 1).toISOString();
  const timeMax = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
  const calIdEnc = encodeURIComponent(calendarId);
  const url = `https://www.googleapis.com/calendar/v3/calendars/${calIdEnc}/events?` +
    `key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&maxResults=50`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const message = errData.error?.message || `Erro ${response.status}`;
      return res.status(502).json({ error: message });
    }

    const data = await response.json();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTodayMs = startOfToday.getTime();

    const items = (data.items || []).filter((e) => {
      if (e.status === 'cancelled') return false;
      const start = e.start?.dateTime || e.start?.date;
      if (!start) return false;
      const d = new Date(start);
      const eventStartMs = e.start?.date
        ? new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
        : d.getTime();
      return eventStartMs >= startOfTodayMs;
    });

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ items });
  } catch (err) {
    console.error('calendar-events error:', err);
    return res.status(500).json({ error: 'Falha ao carregar eventos.' });
  }
};
