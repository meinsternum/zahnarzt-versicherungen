import { api, esc, fmtDate, fmtTime, fmtLong, mountPicker, minutesLabel, channelInfoHtml, OFFICE_ADDRESS } from './common.js';

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
  if (booking.staffPhoto) { el('details-photo').src = booking.staffPhoto; el('details-photo').alt = booking.staffName; el('details-photo').hidden = false; }
  el('details-title').textContent = `${booking.typeTitle} bei ${booking.staffName}`;
  el('details-time').textContent = `${fmtDate(booking.start)} um ${fmtTime(booking.start).replace(' Uhr', '')} (${minutesLabel(booking.minutes)})${booking.status === 'cancelled' ? ', abgesagt' : ''}`;
  if (booking.status === 'confirmed') el('details-info').innerHTML = channelInfoHtml(booking.channel, booking.staffName, OFFICE_ADDRESS);
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

el('btn-cancel').addEventListener('click', () => {
  el('actions').hidden = true;
  el('cancel-confirm').hidden = false;
});
el('btn-cancel-no').addEventListener('click', () => {
  el('cancel-confirm').hidden = true;
  el('actions').hidden = false;
});
el('btn-cancel-yes').addEventListener('click', async () => {
  el('btn-cancel-yes').disabled = true;
  try {
    await api('cancel', { t: token });
    el('view').hidden = true;
    el('reschedule').hidden = true;
    el('result').hidden = false;
    el('result-title').textContent = 'Dein Termin wurde abgesagt';
    el('result-text').textContent = 'Du bekommst dazu eine Bestätigung per E-Mail.';
  } catch (e) {
    el('btn-cancel-yes').disabled = false;
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
