export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export async function api(path, body) {
  const res = await fetch(`${location.origin}/api/${path}`, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : undefined);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || 'Es ist ein Fehler aufgetreten.'), { code: data.error, status: res.status });
  return data;
}

const tz = 'Europe/Berlin';
export const fmtDate = (iso) => new Intl.DateTimeFormat('de-DE', { timeZone: tz, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
export const fmtTime = (iso) => new Intl.DateTimeFormat('de-DE', { timeZone: tz, hour: '2-digit', minute: '2-digit' }).format(new Date(iso)) + ' Uhr';
export const fmtLong = (iso) => `${fmtDate(iso)}, ${fmtTime(iso)}`;

export const minutesLabel = (m) => [Math.floor(m / 60) ? `${Math.floor(m / 60)} Std.` : '', m % 60 ? `${m % 60} Min.` : ''].filter(Boolean).join(' ');

// Beschreibung zur gewählten Beratungsform (Abschlussseite und Verwaltung)
export function channelInfoHtml(channel, staffName, address) {
  if (channel === 'phone') return `${esc(staffName)} ruft dich zur vereinbarten Zeit an.`;
  if (channel === 'onsite') return `Wir treffen uns in unserem Büro: ${esc(address)}.`;
  return `So nimmst du teil: Öffne zur vereinbarten Zeit <a href="https://www.meinsternum.de/beratung">meinsternum.de/beratung</a> und klicke dort auf das Foto von ${esc(staffName)}. Du kommst direkt in den persönlichen Zoom-Raum.`;
}
export const OFFICE_ADDRESS = 'MEIN STERNUM Finanzberatung GmbH, Göppinger Str. 2a, 50739 Köln';

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const pad = (n) => String(n).padStart(2, '0');
const monthKey = (y, m) => `${y}-${pad(m + 1)}`; // m = 0..11
const dayLong = (date) => new Intl.DateTimeFormat('de-DE', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${date}T12:00:00Z`));
const monthTitle = (y, m) => new Intl.DateTimeFormat('de-DE', { timeZone: 'UTC', month: 'long', year: 'numeric' }).format(new Date(Date.UTC(y, m, 15)));
const todayBerlin = () => new Intl.DateTimeFormat('sv-SE', { timeZone: tz }).format(new Date()); // YYYY-MM-DD

// Monatskalender mit freien Tagen und Uhrzeiten. onPick(slot) wird bei Auswahl einer Uhrzeit aufgerufen.
export function mountPicker(root, { typeId, staffId, onPick, rescheduleToken }) {
  const today = todayBerlin();
  const state = { y: +today.slice(0, 4), m: +today.slice(5, 7) - 1, months: new Map(), date: null, picked: null, loading: true, error: '' };

  async function loadMonth(y, m) {
    const key = monthKey(y, m);
    if (state.months.has(key)) return state.months.get(key);
    const q = new URLSearchParams({ type: typeId, staff: staffId, from: `${key}-01`, days: '31' });
    if (rescheduleToken) q.set('reschedule', rescheduleToken);
    const data = await api(`slots?${q}`);
    // Das Abruffenster kann über den Monatswechsel hinausgehen; angezeigt werden nur Tage dieses Monats
    const byDate = new Map(data.days.filter((d) => d.date.startsWith(key)).map((d) => [d.date, d.slots]));
    const nextMonth = new Date(Date.UTC(y, m + 1, 1)).toISOString().slice(0, 10);
    const entry = { byDate, hasMore: data.hasMore || data.nextFrom > nextMonth };
    state.months.set(key, entry);
    return entry;
  }

  const step = (y, m, n) => {
    const d = new Date(Date.UTC(y, m + n, 1));
    return [d.getUTCFullYear(), d.getUTCMonth()];
  };

  // Sucht ab dem angezeigten Monat den nächsten Tag mit freien Zeiten
  async function findNext(fromDate) {
    let [y, m] = [state.y, state.m];
    for (let i = 0; i < 4; i++) {
      const entry = await loadMonth(y, m);
      const dates = [...entry.byDate.keys()].filter((d) => d > fromDate).sort();
      if (dates.length) return { y, m, date: dates[0] };
      if (!entry.hasMore) return null;
      [y, m] = step(y, m, 1);
    }
    return null;
  }

  async function init() {
    try {
      await loadMonth(state.y, state.m);
      const next = await findNext('0000-00-00');
      if (next) {
        state.y = next.y;
        state.m = next.m;
        state.date = next.date;
      }
    } catch (e) {
      state.error = e.message;
    }
    state.loading = false;
    render();
  }

  function render() {
    if (state.error) {
      root.innerHTML = `<p class="buch-fehler" role="alert">${esc(state.error)}</p>`;
      return;
    }
    if (state.loading) {
      root.innerHTML = '<p class="buch-leise">Freie Termine werden geladen …</p>';
      return;
    }
    const key = monthKey(state.y, state.m);
    const entry = state.months.get(key) || { byDate: new Map(), hasMore: false };
    const first = new Date(Date.UTC(state.y, state.m, 1));
    const offset = (first.getUTCDay() + 6) % 7; // Montag zuerst
    const count = new Date(Date.UTC(state.y, state.m + 1, 0)).getUTCDate();
    const canPrev = key > today.slice(0, 7);
    const canNext = entry.hasMore;
    let cells = '';
    for (let i = 0; i < offset; i++) cells += '<span></span>';
    for (let d = 1; d <= count; d++) {
      const date = `${key}-${pad(d)}`;
      const free = entry.byDate.has(date) && date >= today;
      cells += `<button type="button" class="buch-tag${date === state.date ? ' on' : ''}" data-date="${date}" ${free ? '' : 'disabled'} aria-pressed="${date === state.date}" aria-label="${esc(dayLong(date))}${free ? '' : ', keine Termine'}">${d}</button>`;
    }
    const slots = state.date ? state.months.get(state.date.slice(0, 7))?.byDate.get(state.date) || [] : [];
    const times = state.date
      ? slots.length
        ? `<div class="buch-zeiten" role="group" aria-label="Uhrzeit wählen">${slots.map((s) => `<button type="button" class="buch-zeit${state.picked === s.start ? ' on' : ''}" data-start="${s.start}" aria-pressed="${state.picked === s.start}">${esc(s.time)}</button>`).join('')}</div>`
        : '<p class="buch-leise">Keine Verfügbarkeit</p>'
      : '<p class="buch-leise">Aktuell sind keine freien Termine verfügbar. Schreib uns gern an <a href="mailto:hallo@meinsternum.de">hallo@meinsternum.de</a>.</p>';
    root.innerHTML = `<div class="buch-kal">
      <div class="buch-kal-links">
        <div class="buch-kal-kopf">
          <button type="button" class="buch-pfeil" data-nav="-1" aria-label="Vorheriger Monat" ${canPrev ? '' : 'disabled'}>‹</button>
          <strong>${esc(monthTitle(state.y, state.m))}</strong>
          <button type="button" class="buch-pfeil" data-nav="1" aria-label="Nächster Monat" ${canNext ? '' : 'disabled'}>›</button>
        </div>
        <div class="buch-kal-raster" role="group" aria-label="Tag wählen">
          ${WEEKDAYS.map((w) => `<span class="buch-wt" aria-hidden="true">${w}</span>`).join('')}${cells}
        </div>
      </div>
      <div class="buch-kal-rechts">
        ${state.date ? `<p class="buch-kal-tag">Verfügbarkeit für ${esc(dayLong(state.date))}</p>` : ''}
        ${times}
        <button type="button" class="knopf knopf-rand knopf-klein" data-next>Nächsten Termin finden</button>
        <p class="buch-leise buch-klein">Alle Zeiten in deutscher Zeit.</p>
      </div>
    </div>`;
    root.querySelectorAll('[data-nav]').forEach((b) =>
      b.addEventListener('click', async () => {
        [state.y, state.m] = step(state.y, state.m, +b.dataset.nav);
        state.date = null;
        state.loading = true;
        render();
        try {
          await loadMonth(state.y, state.m);
          const e = state.months.get(monthKey(state.y, state.m));
          state.date = [...e.byDate.keys()].sort().find((d) => d >= today) || null;
        } catch (e) {
          state.error = e.message;
        }
        state.loading = false;
        render();
      }),
    );
    root.querySelectorAll('[data-date]').forEach((b) => b.addEventListener('click', () => { state.date = b.dataset.date; render(); }));
    root.querySelector('[data-next]').addEventListener('click', async () => {
      const next = await findNext(state.date || today);
      if (next) {
        state.y = next.y;
        state.m = next.m;
        state.date = next.date;
        render();
      }
    });
    root.querySelectorAll('[data-start]').forEach((b) =>
      b.addEventListener('click', () => {
        state.picked = b.dataset.start;
        const slot = slots.find((s) => s.start === state.picked);
        render();
        onPick(slot);
      }),
    );
  }

  init();
}
