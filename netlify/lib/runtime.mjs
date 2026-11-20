import { createStore } from './store.mjs';
import { createCalendar } from './calendar.mjs';
import { createMailer } from './mail.mjs';

let deps;
export function getDeps() {
  if (!deps) deps = { store: createStore(), calendar: createCalendar(), mailer: createMailer() };
  return deps;
}

export function setDeps(d) {
  deps = d;
}
