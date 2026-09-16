import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, applyBeat, stateAt } from './engine.js';

const content = {
  'answer-demo': { text: 'Here is what California requires.' },
  'wizard-demo': { title: 'New consent model', fields: [{ id: 'name', label: 'Name', value: 'CCPA baseline' }] }
};

const scenario = {
  id: 'demo',
  initial: { view: 'home' },
  beats: [
    { spotlight: '#prompt-bar', await: 'click',
      then: { type: { into: '#prompt-bar', text: 'What does California require?' },
              push: { chat: 'answer-demo' } } },
    { spotlight: '#chip', await: 'click',
      then: { set: { view: 'wizard' }, populate: { wizard: 'wizard-demo' } } }
  ]
};

test('initialState starts before the first beat with an empty chat', () => {
  const s = initialState(scenario);
  assert.equal(s.view, 'home');
  assert.equal(s.beatIndex, -1);
  assert.deepEqual(s.chat, []);
  assert.equal(s.wizard, null);
});

test('a type beat records the typed text as a user message', () => {
  const s = applyBeat(initialState(scenario), scenario.beats[0], content);
  assert.equal(s.chat[0].role, 'user');
  assert.equal(s.chat[0].text, 'What does California require?');
  assert.equal(s.prompt, '');
});

test('a push beat appends the named content as an assistant message', () => {
  const s = applyBeat(initialState(scenario), scenario.beats[0], content);
  assert.equal(s.chat[1].role, 'assistant');
  assert.equal(s.chat[1].text, 'Here is what California requires.');
});

test('a populate beat marks every field as AI-sourced', () => {
  const s = stateAt(scenario, content, 1);
  assert.equal(s.view, 'wizard');
  assert.equal(s.wizard.fields[0].source, 'ai');
});

test('an unknown content key fails loudly', () => {
  const bad = { then: { push: { chat: 'does-not-exist' } } };
  assert.throws(() => applyBeat(initialState(scenario), bad, content), /does-not-exist/);
});

test('replaying to a beat equals stepping through to it', () => {
  let stepped = initialState(scenario);
  for (const beat of scenario.beats) stepped = applyBeat(stepped, beat, content);
  assert.deepEqual(stateAt(scenario, content, scenario.beats.length - 1), stepped);
});

test('reset returns exactly the initial state after advancing', () => {
  const before = initialState(scenario);
  const advanced = stateAt(scenario, content, 1);
  assert.ok(advanced.chat.length > 0, 'advancing should have produced messages');
  assert.equal(initialState(scenario).chat.length, 0);
  assert.deepEqual(initialState(scenario), before);
});

test('applyBeat does not mutate the state it is given', () => {
  const before = initialState(scenario);
  const snapshot = structuredClone(before);
  applyBeat(before, scenario.beats[0], content);
  assert.deepEqual(before, snapshot);
});

test('push beat deep-copies nested content to prevent aliasing', () => {
  const richContent = {
    'demo-with-array': { text: 'Response', citations: ['a', 'b'] }
  };
  const s = applyBeat(initialState(scenario), { then: { push: { chat: 'demo-with-array' } } }, richContent);
  const messageArray = s.chat[0].citations;
  messageArray[0] = 'mutated';
  assert.equal(richContent['demo-with-array'].citations[0], 'a', 'mutating returned chat should not affect content');
  assert.equal(s.chat[0].citations[0], 'mutated', 'returned message should reflect the mutation');
});

test('set clause rejects reserved keys with descriptive error', () => {
  const badBeat = { then: { set: { beatIndex: 99 } } };
  assert.throws(() => applyBeat(initialState(scenario), badBeat, content), /beatIndex/);
});
