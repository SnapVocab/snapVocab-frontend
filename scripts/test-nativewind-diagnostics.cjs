const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Exercise the installed diagnostic code without booting React Native.
const root = path.dirname(require.resolve('react-native-css-interop/package.json'));
const source = fs.readFileSync(path.join(root, 'dist/runtime/native/render-component.js'), 'utf8');
const start = source.indexOf('function printUpgradeWarning(');
const end = source.indexOf('function getDebugReplacer(');
assert.ok(start >= 0 && end > start, 'Diagnostic implementation must be found');
const logs = [];
const context = { console: { log: (message) => logs.push(message) } };
vm.runInNewContext(source.slice(start, end), context);
assert.deepEqual(JSON.parse(context.stringify({ label: 'Create topic', count: 1 })), {
  label: 'Create topic', count: 1,
});
const circular = {};
circular.self = circular;
assert.match(context.stringify(circular), /Circular/);
const props = { children: { context: {
  get getKey() { throw new Error("Couldn't find a navigation context"); },
} } };
assert.doesNotThrow(() => context.printUpgradeWarning('Component needs upgrading', props));
assert.match(logs[0], /Component needs upgrading/);
assert.match(logs[0], /Props unavailable/);
console.log('PASS: normal props, circular props, and throwing navigation getters; warning retained.');
