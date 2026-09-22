/**
 * Pure state machine. Beats fold over state; the DOM is never consulted.
 * applyBeat returns the settled state at the END of a beat — animation is
 * presentational and lives in mount.js.
 */

export function initialState(scenario) {
  return {
    scenarioId: scenario.id,
    beatIndex: -1,
    view: scenario.initial.view,
    chat: [],
    wizard: null,
    prompt: ''
  };
}

function lookup(content, key) {
  const entry = content[key];
  if (!entry) throw new Error(`Unknown content key: ${key}`);
  return entry;
}

export function applyBeat(state, beat, content) {
  const then = beat.then || {};
  const next = { ...state, chat: state.chat.slice(), beatIndex: state.beatIndex + 1 };

  if (then.type) {
    next.chat.push({ role: 'user', text: then.type.text });
    next.prompt = '';
  }
  if (then.push && then.push.chat) {
    next.chat.push({ role: 'assistant', key: then.push.chat, ...structuredClone(lookup(content, then.push.chat)) });
  }
  if (then.set) {
    const reserved = ['scenarioId', 'beatIndex', 'chat'];
    for (const key of Object.keys(then.set)) {
      if (reserved.includes(key)) {
        throw new Error(`Cannot set reserved key: ${key}`);
      }
    }
    Object.assign(next, then.set);
  }
  if (then.populate && then.populate.wizard) {
    // structuredClone first, so the spread below copies detached data and the
    // wizard can never alias the CONTENT entry it came from.
    const source = structuredClone(lookup(content, then.populate.wizard));
    next.wizard = { ...source, fields: source.fields.map(field => ({ ...field, source: 'ai' })) };
  }
  return next;
}

export function stateAt(scenario, content, beatIndex) {
  let state = initialState(scenario);
  for (let i = 0; i <= beatIndex; i += 1) {
    state = applyBeat(state, scenario.beats[i], content);
  }
  return state;
}
