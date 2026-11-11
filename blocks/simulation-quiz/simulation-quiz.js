/**
 * simulation-quiz — insurance simulation form (index.css `.sim`): two tabs over a radio form
 * that GETs the recommendation results page.
 *
 * Authoring rows:
 *   row 1: [tab 1 <p>] [tab 2 <p>]
 *   one row per field: [label <p> (empty = same group as the field above)] [options <ul>]
 *     in order: gender, marital status, children, age (the results page's query keys)
 *   last row: [submit label <p>] [form action link <p>]
 *
 * Decode tier: template-slotted. Tab labels MOVE into `div[role=tab]` hosts, field labels into
 * the legend slot (a div, aria-labelledby on the fieldset), each option list MOVES into the
 * option grid and every <li> keeps its authored text, wrapped with a radio input in a <label>.
 * The submit label MOVES into a `div[role=button]` (EW7: no <button> hosts authored text).
 * Behaviour as live: progressive enable (children after marital status, age after both,
 * submit after all four), GET to the authored action. Tab 2 (ライフイベントから) has no panel
 * on the captured source (dynamics); it stays an inactive tab as observed.
 *
 * @variants compact (product: no tabs, the intro headings over a grey box of four dropdowns —
 *   gender, age, spouse, children — and a full-width submit; see decorateCompact)
 * @ew-exempt the action link paragraph is configuration (the form's action URL), not shown.
 */

const FIELDS = [
  ['gender', ['male', 'female']],
  ['maritalStatus', ['married', 'single']],
  ['children', ['hasChildren', 'noChildren']],
  ['age', ['20s', '30s', '40s', '50s', 'over60']],
];
const ARROW = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" '
  + 'xmlns="http://www.w3.org/2000/svg"><path d="M14.7 18.6007L13.4175 17.3407L17.5575 '
  + '13.2007H3V11.4007H17.5575L13.44 7.26073L14.7 6.00073L21 12.3007L14.7 18.6007Z"></path></svg>';

const COMPACT_FIELDS = [
  ['gender', ['male', 'female']],
  ['age', ['20s', '30s', '40s', '50s', 'over60']],
  ['maritalStatus', ['married', 'single']],
  ['children', ['hasChildren', 'noChildren']],
];
const CHEV = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" '
  + 'xmlns="http://www.w3.org/2000/svg"><path d="M10.332 6.00073L9 7.41073L13.3266 12.0007L9 '
  + '16.5907L10.332 18.0007L16 12.0007L10.332 6.00073Z"></path></svg>';

let uid = 0;

function el(tag, className, ...children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  e.append(...children.filter(Boolean));
  return e;
}

function cells(row) {
  return [...row.children].map((c) => [...c.children]);
}

function buildField(labelNodes, list, index) {
  const [name, values] = FIELDS[index] || [`field${index}`, []];
  const fieldset = el('fieldset', 'simulation-quiz-fieldset');
  if (labelNodes.length) {
    uid += 1;
    const legend = el('div', 'simulation-quiz-legend', ...labelNodes);
    legend.id = `simulation-quiz-legend-${uid}`;
    fieldset.setAttribute('aria-labelledby', legend.id);
    fieldset.append(legend);
  }
  if (list) {
    const items = [...list.querySelectorAll(':scope > li')];
    items.forEach((li, i) => {
      const input = document.createElement('input');
      input.type = 'radio';
      input.className = 'sr-only';
      input.name = name;
      input.value = values[i] || li.textContent;
      const text = el('span', 'simulation-quiz-label', ...li.childNodes);
      li.append(el('label', 'simulation-quiz-opt', input, text));
    });
    const grid = el('div', `simulation-quiz-grid simulation-quiz-grid-${items.length}`, list);
    fieldset.append(grid);
  }
  return fieldset;
}

function wire(form, submit) {
  const val = (name) => form.querySelector(`input[name="${name}"]:checked`)?.value;
  const setDisabled = (name, dis) => {
    form.querySelectorAll(`input[name="${name}"]`).forEach((i) => {
      i.disabled = dis;
      if (dis) i.checked = false;
    });
  };
  const sync = () => {
    setDisabled('children', !val('maritalStatus'));
    setDisabled('age', !(val('maritalStatus') && val('children')));
    const ready = FIELDS.every(([name]) => val(name));
    submit.setAttribute('aria-disabled', ready ? 'false' : 'true');
    submit.tabIndex = ready ? 0 : -1;
  };
  const send = () => {
    if (submit.getAttribute('aria-disabled') === 'true') return;
    form.requestSubmit();
  };
  form.addEventListener('change', sync);
  submit.addEventListener('click', send);
  submit.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      send();
    }
  });
  sync();
}

// EW4: presentational clones drop the editor's indices.
function stripInstrumentation(node) {
  if (node.nodeType !== Node.ELEMENT_NODE) return node;
  const attrs = ['data-prose-index', 'data-image-index', 'data-block-index'];
  [node, ...node.querySelectorAll(attrs.map((a) => `[${a}]`).join(','))]
    .forEach((n) => attrs.forEach((a) => n.removeAttribute(a)));
  return node;
}

/**
 * compact — template-slotted: the intro headings MOVE into the intro slot, each field label
 * <p> into its label slot and each option <ul> into a listbox popup (every <li> keeps its
 * authored text and becomes an option); the trigger shows the `---` placeholder or an EW4
 * clone of the chosen option. A hidden input carries the query value. The submit label MOVES
 * into a div[role=button] (EW7), disabled until all four fields are chosen (as live).
 */
function buildSelect(labelNodes, list, index) {
  const [name, values] = COMPACT_FIELDS[index] || [`field${index}`, []];
  uid += 1;
  const labelId = `simulation-quiz-label-${uid}`;
  const label = el('div', 'simulation-quiz-field-label', ...labelNodes);
  label.id = labelId;
  const value = el('span', 'simulation-quiz-value');
  value.textContent = '---';
  const chev = el('span', 'simulation-quiz-chev');
  chev.innerHTML = CHEV;
  const trigger = el('div', 'simulation-quiz-trigger', value, chev);
  trigger.setAttribute('role', 'combobox');
  trigger.setAttribute('tabindex', '0');
  trigger.setAttribute('aria-labelledby', labelId);
  trigger.setAttribute('aria-expanded', 'false');
  trigger.dataset.empty = '';
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = name;
  const pop = el('div', 'simulation-quiz-options');
  pop.id = `${labelId}-options`;
  pop.hidden = true;
  trigger.setAttribute('aria-controls', pop.id);
  if (list) {
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-labelledby', labelId);
    [...list.querySelectorAll(':scope > li')].forEach((li, i) => {
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', 'false');
      li.dataset.value = values[i] || `${i}`;
    });
    pop.append(list);
  }
  const setOpen = (on) => {
    pop.hidden = !on;
    trigger.setAttribute('aria-expanded', on ? 'true' : 'false');
  };
  trigger.addEventListener('click', () => setOpen(pop.hidden));
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(pop.hidden);
    } else if (e.key === 'Escape') setOpen(false);
  });
  pop.addEventListener('click', (e) => {
    const li = e.target.closest('li[role="option"]');
    if (!li) return;
    pop.querySelectorAll('li[role="option"]')
      .forEach((o) => o.setAttribute('aria-selected', o === li ? 'true' : 'false'));
    input.value = li.dataset.value;
    const clones = [...li.childNodes].map((n) => stripInstrumentation(n.cloneNode(true)));
    value.replaceChildren(...clones);
    delete trigger.dataset.empty;
    setOpen(false);
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  const wrap = el('div', 'simulation-quiz-field-wrap', trigger, pop, input);
  return el('div', 'simulation-quiz-select', el('div', 'simulation-quiz-field', label, wrap));
}

function decorateCompact(block) {
  if (block.querySelector(':scope > .simulation-quiz-intro')) return;
  const intro = el('div', 'simulation-quiz-intro');
  const selects = el('div', 'simulation-quiz-selects');
  const box = el('div', 'simulation-quiz-box', selects);
  const form = el('form', 'simulation-quiz-form', box);
  form.method = 'get';
  let submit = null;
  let fieldIndex = 0;
  [...block.children].forEach((row) => {
    const nodes = cells(row).flat();
    const list = nodes.find((n) => n.matches('ul, ol'));
    const action = nodes.find((n) => n.matches('p') && n.querySelector('a[href]'));
    if (list) {
      selects.append(buildSelect(nodes.filter((n) => n !== list), list, fieldIndex));
      fieldIndex += 1;
    } else if (action) {
      form.action = action.querySelector('a[href]').getAttribute('href');
      submit = el('div', 'simulation-quiz-submit', ...nodes.filter((n) => n !== action));
      submit.setAttribute('role', 'button');
      submit.insertAdjacentHTML('beforeend', ARROW);
      box.append(submit);
    } else {
      nodes.forEach((n, i) => {
        intro.append(el('div', `simulation-quiz-intro-${i ? 'medium' : 'small'}`, n));
      });
    }
  });
  block.replaceChildren(intro, form);
  if (!submit) return;
  const sync = () => {
    const ready = [...form.querySelectorAll('input[type="hidden"]')].every((i) => i.value);
    submit.setAttribute('aria-disabled', ready ? 'false' : 'true');
    submit.tabIndex = ready ? 0 : -1;
  };
  const send = () => {
    if (submit.getAttribute('aria-disabled') !== 'true') form.submit();
  };
  form.addEventListener('change', sync);
  submit.addEventListener('click', send);
  submit.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      send();
    }
  });
  document.addEventListener('click', (e) => {
    if (!block.contains(e.target)) {
      block.querySelectorAll('.simulation-quiz-options').forEach((p) => { p.hidden = true; });
      block.querySelectorAll('.simulation-quiz-trigger')
        .forEach((t) => t.setAttribute('aria-expanded', 'false'));
    }
  });
  sync();
}

export default function decorate(block) {
  if (block.classList.contains('compact')) {
    decorateCompact(block);
    return;
  }
  if (block.querySelector(':scope > .simulation-quiz-tabs')) return;
  const rows = [...block.children];
  const tabs = el('div', 'simulation-quiz-tabs');
  tabs.setAttribute('role', 'tablist');
  const fields = el('div', 'simulation-quiz-fields');
  const form = el('form', 'simulation-quiz-form', fields);
  form.method = 'get';
  let submit = null;
  let fieldIndex = 0;
  let group = null;

  rows.forEach((row, r) => {
    const [first = [], second = []] = cells(row);
    const list = [...first, ...second].find((n) => n.matches('ul, ol'));
    const action = second.find((n) => n.querySelector('a[href]'));
    if (r === 0 && !list) {
      [...first, ...second].forEach((p, i) => {
        const tab = el('div', `simulation-quiz-tab${i ? '' : ' is-active'}`, p);
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', i ? 'false' : 'true');
        tabs.append(tab);
      });
    } else if (list) {
      const labelNodes = first.filter((n) => n !== list);
      const fieldset = buildField(labelNodes, list, fieldIndex);
      fieldIndex += 1;
      if (!labelNodes.length && group) {
        // a field without its own label joins the group above (家族構成: spouse + children)
        if (!group.classList.contains('simulation-quiz-family')) {
          const family = el('div', 'simulation-quiz-family');
          group.replaceWith(family);
          family.append(group);
          group = family;
        }
        group.append(fieldset);
      } else {
        fields.append(fieldset);
        group = fieldset;
      }
    } else if (action) {
      form.action = action.querySelector('a[href]').getAttribute('href');
      submit = el('div', 'simulation-quiz-submit', ...first);
      submit.setAttribute('role', 'button');
      submit.insertAdjacentHTML('beforeend', ARROW);
      fields.append(el('div', 'simulation-quiz-submit-wrap', submit));
    }
  });

  block.replaceChildren(tabs, el('div', 'simulation-quiz-panel', form));
  if (submit) wire(form, submit);
}
