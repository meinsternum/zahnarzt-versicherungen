export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export async function api(path, body) {
  const res = await fetch(`${location.origin}/api/${path}`, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : undefined);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || 'Es ist ein Fehler aufgetreten.'), { code: data.error, status: res.status });
  return data;
}

const tz = 'Europe/Berlin';
export const fmtLong = (iso) =>
  new Intl.DateTimeFormat('de-DE', { timeZone: tz, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso)) +
  ', ' +
  new Intl.DateTimeFormat('de-DE', { timeZone: tz, hour: '2-digit', minute: '2-digit' }).format(new Date(iso)) +
  ' Uhr';

// Zeigt freie Tage und Uhrzeiten. onPick(slot) wird bei Auswahl einer Uhrzeit aufgerufen.
export function mountPicker(root, { typeId, staffId, onPick, rescheduleToken }) {
  const state = { days: [], selectedDate: null, nextFrom: null, hasMore: false, loading: false, picked: null };

  async function load(from) {
    state.loading = true;
    render();
    try {
      const q = new URLSearchParams({ type: typeId, staff: staffId });
      if (from) q.set('from', from);
      if (rescheduleToken) q.set('reschedule', rescheduleToken);
      let data = await api(`slots?${q}`);
      state.days.push(...data.days);
      state.nextFrom = data.nextFrom;
      state.hasMore = data.hasMore;
      // Ist im ersten Zeitraum nichts frei, direkt weitersuchen
      let guard = 0;
      while (!state.days.length && state.hasMore && guard++ < 4) {
        q.set('from', state.nextFrom);
        data = await api(`slots?${q}`);
        state.days.push(...data.days);
        state.nextFrom = data.nextFrom;
        state.hasMore = data.hasMore;
      }
      if (!state.selectedDate && state.days[0]) state.selectedDate = state.days[0].date;
    } catch (e) {
      root.innerHTML = `<p class="error" role="alert">${esc(e.message)}</p>`;
      state.loading = false;
      return;
    }
    state.loading = false;
    render();
  }

  function render() {
    if (state.loading && !state.days.length) {
      root.innerHTML = '<p class="muted">Freie Termine werden geladen …</p>';
      return;
    }
    if (!state.days.length) {
      root.innerHTML = '<p class="muted">Aktuell sind keine freien Termine verfügbar. Schreib uns gern an <a href="mailto:hallo@meinsternum.de">hallo@meinsternum.de</a>.</p>';
      return;
    }
    const day = state.days.find((d) => d.date === state.selectedDate) || state.days[0];
    root.innerHTML = `
      <div class="chips" role="group" aria-label="Tag wählen">
        ${state.days.map((d) => `<button type="button" class="chip ${d.date === day.date ? 'on' : ''}" data-date="${d.date}" aria-pressed="${d.date === day.date}">${esc(d.label)}</button>`).join('')}
        ${state.hasMore ? `<button type="button" class="chip more" data-more ${state.loading ? 'disabled' : ''}>${state.loading ? '…' : 'Weitere Tage'}</button>` : ''}
      </div>
      <div class="chips times" role="group" aria-label="Uhrzeit wählen">
        ${day.slots.map((s) => `<button type="button" class="chip ${state.picked === s.start ? 'on' : ''}" data-start="${s.start}" aria-pressed="${state.picked === s.start}">${esc(s.time)}</button>`).join('')}
      </div>`;
    root.querySelectorAll('[data-date]').forEach((b) => b.addEventListener('click', () => { state.selectedDate = b.dataset.date; render(); }));
    root.querySelector('[data-more]')?.addEventListener('click', () => load(state.nextFrom));
    root.querySelectorAll('[data-start]').forEach((b) =>
      b.addEventListener('click', () => {
        state.picked = b.dataset.start;
        const slot = day.slots.find((s) => s.start === state.picked);
        render();
        onPick(slot);
      }),
    );
  }

  load();
}
