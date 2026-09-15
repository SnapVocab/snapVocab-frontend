// Workaround for https://github.com/nativewind/nativewind/issues/1812.
// Keep upgrade warnings visible, but never let prop serialization crash a screen.
// Applies to both package entry points and survives dependency reinstalls.
const fs = require('node:fs');
const path = require('node:path');

const root = path.dirname(require.resolve('react-native-css-interop/package.json'));
const targets = [
  ['src/runtime/native/render-component.tsx', 'object: any'],
  ['dist/runtime/native/render-component.js', 'object'],
];
for (const [relative, argument] of targets) {
  const file = path.join(root, relative);
  const source = fs.readFileSync(file, 'utf8');
  if (source.includes('function stringifyUnsafe(')) {
    console.log(`NativeWind diagnostic guard already installed: ${relative}`);
    continue;
  }
  const signature = `function stringify(${argument}) {`;
  if (!source.includes(signature)) {
    throw new Error(`NativeWind serializer changed: review issue #1812 workaround in ${relative}`);
  }
  const replacement = `function stringify(${argument}) {
  try {
    return stringifyUnsafe(object);
  } catch {
    return "[Props unavailable: diagnostic serialization failed]";
  }
}

function stringifyUnsafe(${argument}) {`;
  fs.writeFileSync(file, source.replace(signature, replacement));
  console.log(`Installed NativeWind diagnostic guard: ${relative}`);
}
