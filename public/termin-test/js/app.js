import { api, esc, fmtLong, mountPicker } from './common.js';

const el = (id) => document.getElementById(id);
const state = { config: null, type: null, staff: 'any', slot: null };

function show(...ids) {
  for (const s of ['step-type', 'step-staff', 'step-time', 'step-form', 'done']) el(s).hidden = !ids.includes(s);
}

function renderTypes() {
  el('types').innerHTML = state.config.types
    .map(
      (t) => `<button type="button" class="card" data-type="${t.id}">
        <strong>${esc(t.title)}</strong> <span class="muted">${t.minutes} Minuten</span>
        <span class="desc">${esc(t.description)}</span>
      </button>`,
    )
    .join('');
  el('types').querySelectorAll('[data-type]').forEach((b) => b.addEventListener('click', () => chooseType(b.dataset.type)));
}

function chooseType(id) {
  state.type = state.config.types.find((t) => t.id === id);
  state.staff = 'any';
  state.slot = null;
  el('staff-list').innerHTML =
    `<button type="button" class="card" data-staff="any"><strong>Nächster freier Termin</strong><span class="desc">Du wirst einer verfügbaren Person zugeordnet.</span></button>` +
    state.type.staff.map((s) => `<button type="button" class="card" data-staff="${s.id}"><strong>${esc(s.name)}</strong></button>`).join('');
  el('staff-list').querySelectorAll('[data-staff]').forEach((b) => b.addEventListener('click', () => chooseStaff(b.dataset.staff)));
  el('picked-type').textContent = `${state.type.title}, ${state.type.minutes} Minuten`;
  // Gibt es nur eine Person, überspringen wir die Auswahl
  if (state.type.staff.length === 1) return chooseStaff(state.type.staff[0].id);
  show('step-type', 'step-staff');
  el('step-staff').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function chooseStaff(id) {
  state.staff = id;
  state.slot = null;
  el('step-form').hidden = true;
  show('step-type', 'step-staff', 'step-time');
  const person = state.type.staff.find((s) => s.id === id);
  el('picked-staff').textContent = person ? `bei ${person.name}` : 'beim nächsten freien Termin';
  mountPicker(el('picker'), {
    typeId: state.type.id,
    staffId: id,
    onPick: (slot) => {
      state.slot = slot;
      el('summary').textContent = `${state.type.title} (${state.type.minutes} Minuten): ${fmtLong(slot.start)}`;
      show('step-type', 'step-staff', 'step-time', 'step-form');
      el('step-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
  });
  el('step-time').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function submit(e) {
  e.preventDefault();
  const f = e.target;
  const btn = f.querySelector('button[type=submit]');
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
      source: f.source.value,
      consent: f.consent.checked,
      website: f.website.value,
    });
    const b = res.booking;
    el('done-text').innerHTML = `<strong>${esc(b.typeTitle)} mit ${esc(b.staffName)}</strong><br>${esc(fmtLong(b.start))}`;
    el('done-link').href = `termin.html?t=${encodeURIComponent(res.token)}`;
    show('done');
    el('done').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (ex) {
    err.textContent = ex.message;
    btn.disabled = false;
    btn.textContent = 'Termin verbindlich buchen';
    if (ex.code === 'slot_unavailable') {
      state.slot = null;
      chooseStaff(state.staff); // Zeiten neu laden
    }
  }
}

async function init() {
  try {
    state.config = await api('config');
  } catch (e) {
    el('types').innerHTML = `<p class="error">${esc(e.message)}</p>`;
    return;
  }
  el('testmodus').hidden = !state.config.testMode;
  const sel = el('source');
  sel.innerHTML = state.config.sources.map((s) => `<option value="${esc(s.id)}">${esc(s.label)}</option>`).join('');
  el('booking-form').addEventListener('submit', submit);
  renderTypes();
  show('step-type');
}
init();
