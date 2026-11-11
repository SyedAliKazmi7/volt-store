// Each key: [code, width in units (default 1), kind (default "alpha")]
// Every row adds up to 16 units.
const ROWS = [
  [
    ["Escape", 1, "accent"], ["Digit1"], ["Digit2"], ["Digit3"], ["Digit4"],
    ["Digit5"], ["Digit6"], ["Digit7"], ["Digit8"], ["Digit9"], ["Digit0"],
    ["Minus"], ["Equal"], ["Backspace", 2, "mod"], ["Delete", 1, "mod"],
  ],
  [
    ["Tab", 1.5, "mod"], ["KeyQ"], ["KeyW"], ["KeyE"], ["KeyR"], ["KeyT"],
    ["KeyY"], ["KeyU"], ["KeyI"], ["KeyO"], ["KeyP"], ["BracketLeft"],
    ["BracketRight"], ["Backslash", 1.5, "mod"], ["PageUp", 1, "mod"],
  ],
  [
    ["CapsLock", 1.75, "mod"], ["KeyA"], ["KeyS"], ["KeyD"], ["KeyF"],
    ["KeyG"], ["KeyH"], ["KeyJ"], ["KeyK"], ["KeyL"], ["Semicolon"],
    ["Quote"], ["Enter", 2.25, "accent"], ["PageDown", 1, "mod"],
  ],
  [
    ["ShiftLeft", 2.25, "mod"], ["KeyZ"], ["KeyX"], ["KeyC"], ["KeyV"],
    ["KeyB"], ["KeyN"], ["KeyM"], ["Comma"], ["Period"], ["Slash"],
    ["ShiftRight", 1.75, "mod"], ["ArrowUp", 1, "mod"], ["End", 1, "mod"],
  ],
  [
    ["ControlLeft", 1.25, "mod"], ["MetaLeft", 1.25, "mod"],
    ["AltLeft", 1.25, "mod"], ["Space", 6.25], ["AltRight", 1, "mod"],
    ["Fn", 1, "mod"], ["ControlRight", 1, "mod"], ["ArrowLeft", 1, "mod"],
    ["ArrowDown", 1, "mod"], ["ArrowRight", 1, "mod"],
  ],
];

// Flat list of keys with their x/z position, centred on the origin.
export const KEYS = ROWS.flatMap((row, rowIndex) => {
  let cursor = 0;
  return row.map(([code, w = 1, kind = "alpha"]) => {
    const key = { code, w, kind, x: cursor + w / 2 - 8, z: rowIndex - 2 };
    cursor += w;
    return key;
  });
});