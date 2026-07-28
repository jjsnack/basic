// Per-theme 8-bit soundtracks for the console. The player engine lives in
// console.js; this is just the note data. Each tune: { bpm, wave?, lead[],
// bass[] } — MIDI notes, 0 = rest, 32 eighth-notes per loop. `wave` is the lead
// oscillator (bass is always a soft sine). Keyed by theme name; `default`
// covers light/dark/auto, and any theme without an entry falls back to it.
// Kept chill everywhere: slow tempo, sparse notes, lots of rests so it rings.
(function (root) {
  var TUNES = {
    // Calm C-major pentatonic — the original. Bright and neutral.
    default: {
      bpm: 84, wave: "triangle",
      lead: [72, 0, 76, 0, 79, 0, 76, 0, 74, 0, 77, 0, 81, 0, 79, 0,
             72, 0, 76, 0, 84, 0, 79, 0, 81, 0, 79, 0, 76, 0, 74, 0],
      bass: [48, 0, 0, 0, 0, 0, 0, 0, 45, 0, 0, 0, 0, 0, 0, 0,
             41, 0, 0, 0, 0, 0, 0, 0, 43, 0, 0, 0, 0, 0, 0, 0]
    },
    // A natural minor, slower and hollow (square lead) — moody but unhurried.
    dracula: {
      bpm: 72, wave: "square",
      lead: [69, 0, 72, 0, 76, 0, 72, 0, 74, 0, 72, 0, 69, 0, 67, 0,
             81, 0, 79, 0, 76, 0, 72, 0, 74, 0, 72, 0, 69, 0, 69, 0],
      bass: [45, 0, 0, 0, 0, 0, 0, 0, 41, 0, 0, 0, 0, 0, 0, 0,
             38, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0]
    },
    // F major, warm and sweet (soft sine lead) — a gentle, romantic lilt.
    valentine: {
      bpm: 80, wave: "sine",
      lead: [72, 0, 74, 0, 77, 0, 76, 0, 74, 0, 72, 0, 69, 0, 72, 0,
             77, 0, 81, 0, 79, 0, 77, 0, 76, 0, 74, 0, 72, 0, 72, 0],
      bass: [41, 0, 0, 0, 0, 0, 0, 0, 38, 0, 0, 0, 0, 0, 0, 0,
             34, 0, 0, 0, 0, 0, 0, 0, 36, 0, 0, 0, 0, 0, 0, 0]
    }
  };
  if (typeof module !== "undefined" && module.exports) module.exports = TUNES;
  else root.TUNES = TUNES;
})(typeof window !== "undefined" ? window : this);
