const path = require('path');
const serveStatic = require('serve-static');

// Em desenvolvimento, serve arquivos da pasta static em / (ex.: /LogoBleia.svg, /pastor.png)
const staticPath = path.join(__dirname, 'static');
// Em desenvolvimento, /api/calendar-events busca os eventos reais do site publicado (não precisa de .env)
const CALENDAR_API_ORIGIN = 'https://www.adbelemjales.com';
module.exports = function (app) {
  app.use(serveStatic(staticPath, { index: false }));
  app.use('/api/calendar-events', async (req, res) => {
    try {
      const upstream = await fetch(`${CALENDAR_API_ORIGIN}/api/calendar-events${req.url.slice(1)}`);
      res.statusCode = upstream.status;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(await upstream.text());
    } catch (err) {
      res.statusCode = 502;
      res.end(JSON.stringify({ error: 'Falha ao buscar eventos do site publicado.' }));
    }
  });
};
