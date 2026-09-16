/**
 * Validates the hand-authored demo script (scenarios.js) against the shell
 * that renders it and the engine that folds it. No DOM required: shell.js's
 * HOTSPOTS/TYPING_TARGETS are plain data exported before any document.*
 * call executes, so importing it in Node is safe.
 *
 * Goal: a copy edit to scenarios.js (a renamed id, a retyped selector, a
 * duplicated emphasis phrase, a typo'd content key) should make one of these
 * tests fail loudly instead of producing a silently dead demo step.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { SCENARIOS, CONTENT } from './scenarios.js';
import { HOTSPOTS, TYPING_TARGETS } from './shell.js';
import { initialState, applyBeat } from './engine.js';

const everyHotspot = new Set(Object.values(HOTSPOTS).flat());

test('every scenario has the required fields', () => {
  for (const scenario of SCENARIOS) {
    assert.ok(scenario.id, 'scenario needs an id');
    assert.ok(scenario.label, `${scenario.id} needs a label`);
    assert.ok(scenario.initial && scenario.initial.view, `${scenario.id} needs an initial view`);
    assert.ok(scenario.beats.length > 0, `${scenario.id} has no beats`);
  }
});

test('every spotlight is a hotspot the shell actually renders', () => {
  for (const scenario of SCENARIOS) {
    for (const [index, beat] of scenario.beats.entries()) {
      assert.ok(
        everyHotspot.has(beat.spotlight),
        `${scenario.id} beat ${index} points at ${beat.spotlight}, which no view renders`
      );
    }
  }
});

test('the spotlight for each beat exists in the view that beat runs in', () => {
  for (const scenario of SCENARIOS) {
    let state = initialState(scenario);
    for (const [index, beat] of scenario.beats.entries()) {
      const available = HOTSPOTS[state.view] || [];
      assert.ok(
        available.includes(beat.spotlight),
        `${scenario.id} beat ${index} spotlights ${beat.spotlight} while view is "${state.view}"`
      );
      state = applyBeat(state, beat, CONTENT);
    }
  }
});

test('every content key referenced by a beat exists', () => {
  for (const scenario of SCENARIOS) {
    for (const beat of scenario.beats) {
      const then = beat.then || {};
      if (then.push && then.push.chat) assert.ok(CONTENT[then.push.chat], `missing content: ${then.push.chat}`);
      if (then.populate && then.populate.wizard) assert.ok(CONTENT[then.populate.wizard], `missing content: ${then.populate.wizard}`);
    }
  }
});

test('no content entry is orphaned', () => {
  // "Used" has to include set-clause content references (e.g. actionCard),
  // not just push/populate — otherwise action-card-pending/completed would
  // read as orphaned even though renderActionCard() looks them up by key.
  const used = new Set();
  for (const scenario of SCENARIOS) {
    for (const beat of scenario.beats) {
      const then = beat.then || {};
      if (then.push && then.push.chat) used.add(then.push.chat);
      if (then.populate && then.populate.wizard) used.add(then.populate.wizard);
      if (then.set) {
        for (const value of Object.values(then.set)) {
          if (typeof value === 'string' && CONTENT[value]) used.add(value);
        }
      }
    }
  }
  const orphans = Object.keys(CONTENT).filter(key => !used.has(key));
  assert.deepEqual(orphans, [], `unused content entries: ${orphans.join(', ')}`);
});

test('every scenario folds from first beat to last without throwing', () => {
  for (const scenario of SCENARIOS) {
    let state = initialState(scenario);
    for (const beat of scenario.beats) state = applyBeat(state, beat, CONTENT);
    assert.equal(state.beatIndex, scenario.beats.length - 1);
  }
});

// --- Additional checks from review -----------------------------------

test('every emphasis phrase occurs exactly once in its own text', () => {
  for (const [key, entry] of Object.entries(CONTENT)) {
    if (!entry.emphasis) continue;
    for (const phrase of entry.emphasis) {
      let count = 0;
      let at = entry.text.indexOf(phrase);
      while (at !== -1) {
        count += 1;
        at = entry.text.indexOf(phrase, at + phrase.length);
      }
      assert.ok(count > 0, `${key} declares emphasis phrase "${phrase}" that does not occur in its text`);
      assert.ok(
        count === 1,
        `${key} declares emphasis phrase "${phrase}" that occurs ${count} times in its text (renderer bolds every occurrence)`
      );
    }
  }
});

test('every set value that looks like a content key resolves in CONTENT', () => {
  // scenarios.js has no marker distinguishing a content-key-valued `set`
  // field (e.g. actionCard) from a plain presentational one (e.g. view).
  // Every real CONTENT key is a multi-word kebab-case slug ('answer-ccpa',
  // 'action-card-pending', ...), while presentational values like the view
  // names ('home', 'answer', 'dialog') are single words with no hyphen. A
  // hyphen is therefore a reliable, data-driven signal that a `set` value is
  // meant to be a CONTENT lookup (mirroring what shell.js's renderActionCard
  // actually does with state.actionCard) without hardcoding the field name.
  for (const scenario of SCENARIOS) {
    for (const [index, beat] of scenario.beats.entries()) {
      const set = (beat.then && beat.then.set) || {};
      for (const [field, value] of Object.entries(set)) {
        if (typeof value === 'string' && value.includes('-')) {
          assert.ok(
            CONTENT[value],
            `${scenario.id} beat ${index} sets ${field} to '${value}', which is not a CONTENT key`
          );
        }
      }
    }
  }
});

test('every type clause has a valid `when`', () => {
  // `when` is presentational sequencing data for a later task's renderer
  // (engine.js never reads it — see engine.js's `applyBeat`, which only
  // touches `then.type.text`). Without this guard, a beat that omits `when`
  // would silently fall back to whatever a renderer's implementation
  // defaults to — the same class of silent failure the `when`-aware check
  // below exists to remove.
  for (const scenario of SCENARIOS) {
    for (const [index, beat] of scenario.beats.entries()) {
      if (!beat.then || !beat.then.type) continue;
      assert.ok(
        beat.then.type.when === 'before' || beat.then.type.when === 'after',
        `${scenario.id} beat ${index} has a type clause with no (or invalid) 'when'; expected 'before' or 'after', got ${JSON.stringify(beat.then.type.when)}`
      );
    }
  }
});

test('every type.into target exists in TYPING_TARGETS for the view its `when` names', () => {
  // A typed target can legitimately belong to either the view the beat
  // starts in (`when: 'before'`, e.g. beat 0 types into #prompt-bar while
  // still on "home", before the beat's own `set` moves to "answer") or the
  // view the beat's `set` moves into (`when: 'after'`, e.g. beat 1 types
  // into #copilot-chat-input, which only exists once that beat's `set`
  // opens "dialog"). Checking "either side" (without `when`) is a real gap:
  // a wrong target that happens to be valid on the side the typing does NOT
  // belong to would pass undetected. `when` removes the ambiguity — exactly
  // one view is authoritative per beat, and only that one is checked.
  for (const scenario of SCENARIOS) {
    let state = initialState(scenario);
    for (const [index, beat] of scenario.beats.entries()) {
      const nextState = applyBeat(state, beat, CONTENT);
      if (beat.then && beat.then.type) {
        const target = beat.then.type.into;
        const when = beat.then.type.when;
        const view = when === 'after' ? nextState.view : state.view;
        const available = TYPING_TARGETS[view] || [];
        assert.ok(
          available.includes(target),
          `${scenario.id} beat ${index} types into ${target} (when: '${when}'), which is not a typing target in view "${view}"`
        );
      }
      state = nextState;
    }
  }
});
