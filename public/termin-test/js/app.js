import { api, esc, fmtDate, fmtTime, mountPicker, minutesLabel, channelInfoHtml, OFFICE_ADDRESS } from './common.js';

const el = (id) => document.getElementById(id);
const state = { config: null, type: null, staff: 'any', slot: null };
const VIEWS = { staff: 'step-staff', time: 'step-time', form: 'step-form', done: 'done' };

function show(view) {
  for (const [v, id] of Object.entries(VIEWS)) el(id).hidden = v !== view;
  el('buchung').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const initials = (name) => name.trim().slice(0, 1).toUpperCase();
const staffTitle = (type, s) => (type.id === 'finanzierung' ? `${type.title} bei ${s.name}` : `${type.title} bei ${s.name}`);

function renderTypes() {
  const types = state.config.types.filter((t) => t.staff.length);
  el('types').innerHTML = types
    .map((t) => `<button type="button" class="buch-art${state.type?.id === t.id ? ' on' : ''}" data-type="${t.id}" aria-pressed="${state.type?.id === t.id}">${esc(t.title)}<span>${esc(minutesLabel(t.minutes))}</span></button>`)
    .join('');
  el('types').querySelectorAll('[data-type]').forEach((b) => b.addEventListener('click', () => setType(b.dataset.type)));
}

function renderStaff() {
  const t = state.type;
  const any =
    t.staff.length > 1
      ? `<article class="buch-karte"><span class="buch-avatar buch-avatar-alle" aria-hidden="true">★</span>
          <h3>Nächster freier Termin</h3><p>Du wirst einer Person zugeordnet, die als Nächstes Zeit hat.</p>
          <p class="buch-dauer">${esc(minutesLabel(t.minutes))}</p>
          <button type="button" class="knopf knopf-rand" data-staff="any">Termin buchen</button></article>`
      : '';
  el('staff-list').innerHTML =
    any +
    t.staff
      .map(
        (s) => `<article class="buch-karte">${s.photo ? `<img class="buch-foto" src="${esc(s.photo)}" alt="${esc(s.name)}" width="120" height="120" loading="lazy">` : `<span class="buch-avatar" aria-hidden="true">${esc(initials(s.name))}</span>`}
          <h3>${esc(staffTitle(t, s))}</h3><p>${esc(s.blurb)}</p>
          <p class="buch-dauer">${esc(minutesLabel(t.minutes))}</p>
          <button type="button" class="knopf knopf-rand" data-staff="${esc(s.id)}" aria-label="Termin buchen bei ${esc(s.name)}">Termin buchen</button></article>`,
      )
      .join('');
  el('staff-list').querySelectorAll('[data-staff]').forEach((b) => b.addEventListener('click', () => chooseStaff(b.dataset.staff)));
}

function setType(id) {
  state.type = state.config.types.find((t) => t.id === id);
  state.staff = 'any';
  state.slot = null;
  renderTypes();
  renderStaff();
}

function renderExternal() {
  const list = state.config.external || [];
  el('external').hidden = !list.length;
  el('external-list').innerHTML = list
    .map((l) => `<a class="buch-karte buch-karte-extern" href="${esc(l.url)}" target="_blank" rel="noopener"><h3>${esc(l.title)}</h3><p>${esc(l.description)}</p></a>`)
    .join('');
}

function personName() {
  return state.type.staff.find((s) => s.id === state.staff)?.name || '';
}

function chooseStaff(id) {
  state.staff = id;
  state.slot = null;
  el('picked-staff').textContent = `${state.type.title}, ${minutesLabel(state.type.minutes)}, ${id === 'any' ? 'nächster freier Termin' : `bei ${personName()}`}`;
  show('time');
  mountPicker(el('picker'), {
    typeId: state.type.id,
    staffId: id,
    onPick: (slot) => {
      state.slot = slot;
      el('summary-title').textContent = id === 'any' ? state.type.title : staffTitle(state.type, { name: personName() });
      el('summary-time').textContent = `${fmtDate(slot.start)} um ${fmtTime(slot.start).replace(' Uhr', '')}`;
      el('summary-meta').textContent = minutesLabel(state.type.minutes);
      show('form');
    },
  });
}

function renderChannels() {
  el('channels').innerHTML = state.config.channels
    .map((c, i) => `<label class="buch-radio"><input type="radio" name="channel" value="${esc(c.id)}" ${i === 0 ? 'checked' : ''}><span>${esc(c.label)}</span></label>`)
    .join('');
  const sync = () => {
    const phone = el('booking-form').channel.value === 'phone';
    el('booking-form').phone.required = phone;
    el('phone-hint').textContent = phone ? '(für die telefonische Beratung erforderlich)' : '(optional)';
  };
  el('channels').querySelectorAll('input').forEach((i) => i.addEventListener('change', sync));
  sync();
}

async function submit(e) {
  e.preventDefault();
  const f = e.target;
  const btn = el('submit-btn');
  const err = el('form-error');
  err.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Wird gebucht …';
  try {
    const res = await api('book', {
      type: state.type.id,
      staff: state.staff,
      start: state.slot.start,
      name: f.name.value,
      email: f.email.value,
      phone: f.phone.value,
      note: f.note.value,
      channel: f.channel.value,
      source: f.source.value,
      consent: f.consent.checked,
      website: f.website.value,
    });
    const b = res.booking;
    el('done-title').textContent = `${b.typeTitle} bei ${b.staffName}`;
    el('done-time').textContent = `${fmtDate(b.start)} um ${fmtTime(b.start).replace(' Uhr', '')}`;
    el('done-info').innerHTML = channelInfoHtml(b.channel, b.staffName, OFFICE_ADDRESS);
    el('done-link').href = `/termin-test/termin?t=${encodeURIComponent(res.token)}`;
    show('done');
  } catch (ex) {
    err.textContent = ex.message;
    if (ex.code === 'slot_unavailable') {
      state.slot = null;
      chooseStaff(state.staff); // Zeiten neu laden
    }
  } finally {
    btn.disabled = false;
    btn.textContent = 'Termin buchen';
  }
}

async function init() {
  try {
    state.config = await api('config');
  } catch (e) {
    el('types').innerHTML = '';
    el('load-error').textContent = e.message;
    el('load-error').hidden = false;
    return;
  }
  el('testmodus').hidden = !state.config.testMode;
  el('source').innerHTML = state.config.sources.map((s) => `<option value="${esc(s.id)}">${esc(s.label)}</option>`).join('');
  renderChannels();
  el('booking-form').addEventListener('submit', submit);
  document.querySelectorAll('[data-back]').forEach((b) => b.addEventListener('click', () => show(b.dataset.back)));
  renderExternal();
  const first = state.config.types.find((t) => t.id === 'erstgespraech' && t.staff.length) || state.config.types.find((t) => t.staff.length);
  setType(first.id);
}
init();
