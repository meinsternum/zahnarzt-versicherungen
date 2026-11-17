import { api, esc, fmtLong, mountPicker } from './common.js';

const el = (id) => document.getElementById(id);
const token = new URLSearchParams(location.search).get('t');
let booking = null;
let newSlot = null;

function fail(msg) {
  el('loading').hidden = true;
  el('error').textContent = msg;
  el('error').hidden = false;
}

function renderView() {
  el('loading').hidden = true;
  el('view').hidden = false;
  el('details').innerHTML = `<strong>${esc(booking.typeTitle)} mit ${esc(booking.staffName)}</strong> (${booking.minutes} Minuten)<br>${esc(fmtLong(booking.start))}${booking.status === 'cancelled' ? '<br><em>Dieser Termin wurde abgesagt.</em>' : ''}`;
  if (booking.meetLink && booking.status === 'confirmed') {
    el('video').hidden = false;
    el('video').innerHTML = `Videolink: <a href="${esc(booking.meetLink)}">${esc(booking.meetLink)}</a>`;
  }
  const canChange = booking.changeable;
  el('actions').hidden = !canChange;
  el('locked').hidden = canChange || booking.status === 'cancelled';
  if (!canChange && booking.status === 'confirmed') el('locked').textContent = 'Kurz vor dem Termin geht das online nicht mehr. Bitte schreib uns an hallo@meinsternum.de.';
}

async function start() {
  if (!token) return fail('Dieser Link ist unvollständig. Bitte nutze den Link aus deiner Bestätigungs-E-Mail.');
  try {
    booking = await api(`booking?t=${encodeURIComponent(token)}`);
  } catch (e) {
    return fail(e.message);
  }
  renderView();
}

el('btn-cancel').addEventListener('click', async () => {
  if (!confirm('Möchtest du den Termin wirklich absagen?')) return;
  el('btn-cancel').disabled = true;
  try {
    await api('cancel', { t: token });
    el('view').hidden = true;
    el('reschedule').hidden = true;
    el('result').hidden = false;
    el('result-title').textContent = 'Dein Termin wurde abgesagt';
    el('result-text').textContent = 'Du bekommst dazu eine Bestätigung per E-Mail.';
  } catch (e) {
    el('btn-cancel').disabled = false;
    fail(e.message);
  }
});

el('btn-reschedule').addEventListener('click', () => {
  el('reschedule').hidden = false;
  mountPicker(el('picker'), {
    typeId: booking.typeId,
    staffId: booking.staffId,
    rescheduleToken: token,
    onPick: (slot) => {
      newSlot = slot;
      el('new-summary').hidden = false;
      el('new-summary').textContent = `Neu: ${fmtLong(slot.start)}`;
      el('btn-confirm-new').hidden = false;
    },
  });
  el('reschedule').scrollIntoView({ behavior: 'smooth' });
});

el('btn-confirm-new').addEventListener('click', async () => {
  el('btn-confirm-new').disabled = true;
  try {
    const res = await api('reschedule', { t: token, start: newSlot.start });
    el('view').hidden = true;
    el('reschedule').hidden = true;
    el('result').hidden = false;
    el('result-title').textContent = 'Dein Termin wurde verschoben';
    el('result-text').textContent = `Neu: ${fmtLong(res.booking.start)}. Die Bestätigung kommt per E-Mail.`;
  } catch (e) {
    el('btn-confirm-new').disabled = false;
    fail(e.message);
  }
});

start();
