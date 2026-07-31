// Per-theme 8-bit soundtracks for the console. The player engine lives in
// console.js; this is just the note data. Each tune: { bpm, wave?, lead[],
// bass[] } — MIDI notes, 0 = rest, one bar = 8 eighth-notes. `wave` is the lead
// oscillator (bass is always a soft sine). Keyed by theme name; `default`
// covers light/dark/auto, and any theme without an entry falls back to it.
// The engine loops the arrays forever, so each phrase ends back on its tonic
// (bass on the dominant/sub-dominant) to make the wrap seamless. lead and bass
// must be the same length. Kept chill: slow tempo, sparse notes, lots of rests.
(function (root) {
  var TUNES = {
    // Calm C-major pentatonic — the original 4-bar loop. Bright and neutral.
    default: {
      bpm: 84, wave: "triangle",
      lead: [72, 0, 76, 0, 79, 0, 76, 0, 74, 0, 77, 0, 81, 0, 79, 0,
             72, 0, 76, 0, 84, 0, 79, 0, 81, 0, 79, 0, 76, 0, 74, 0],
      bass: [48, 0, 0, 0, 0, 0, 0, 0, 45, 0, 0, 0, 0, 0, 0, 0,
             41, 0, 0, 0, 0, 0, 0, 0, 43, 0, 0, 0, 0, 0, 0, 0]
    },
    // A natural minor, hollow square lead, slow — moody 8-bar loop, i–VI–iv–v.
    dracula: {
      bpm: 72, wave: "square",
      lead: [69, 0, 72, 0, 76, 0, 72, 0, 74, 0, 72, 0, 69, 0, 67, 0,
             81, 0, 79, 0, 76, 0, 72, 0, 74, 0, 72, 0, 71, 0, 69, 0,
             76, 0, 79, 0, 81, 0, 84, 0, 83, 0, 81, 0, 79, 0, 76, 0,
             77, 0, 76, 0, 74, 0, 72, 0, 71, 0, 69, 0, 69, 0,  0, 0],
      bass: [45, 0, 0, 0, 0, 0, 0, 0, 41, 0, 0, 0, 0, 0, 0, 0,
             38, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0,
             45, 0, 0, 0, 0, 0, 0, 0, 41, 0, 0, 0, 0, 0, 0, 0,
             38, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0]
    },
    // F major, soft sine lead — a sweet, romantic 8-bar loop, I–vi–IV–V.
    valentine: {
      bpm: 80, wave: "sine",
      lead: [72, 0, 74, 0, 77, 0, 76, 0, 74, 0, 72, 0, 69, 0, 72, 0,
             77, 0, 81, 0, 79, 0, 77, 0, 76, 0, 74, 0, 72, 0, 69, 0,
             70, 0, 69, 0, 67, 0, 65, 0, 67, 0, 69, 0, 72, 0, 74, 0,
             77, 0, 76, 0, 74, 0, 72, 0, 69, 0, 67, 0, 65, 0,  0, 0],
      bass: [41, 0, 0, 0, 0, 0, 0, 0, 38, 0, 0, 0, 0, 0, 0, 0,
             34, 0, 0, 0, 0, 0, 0, 0, 36, 0, 0, 0, 0, 0, 0, 0,
             41, 0, 0, 0, 0, 0, 0, 0, 38, 0, 0, 0, 0, 0, 0, 0,
             34, 0, 0, 0, 0, 0, 0, 0, 36, 0, 0, 0, 0, 0, 0, 0]
    },
    // D major, warm triangle lead — a cozy folk 8-bar loop, I–V–vi–IV with a
    // plagal (IV→I) turnaround. Ink-on-cream, unhurried.
    paper: {
      bpm: 76, wave: "triangle",
      lead: [74, 0, 78, 0, 81, 0, 78, 0, 76, 0, 74, 0, 71, 0, 74, 0,
             81, 0, 83, 0, 86, 0, 83, 0, 81, 0, 78, 0, 76, 0, 74, 0,
             79, 0, 78, 0, 76, 0, 74, 0, 76, 0, 78, 0, 81, 0, 83, 0,
             81, 0, 79, 0, 78, 0, 76, 0, 78, 0, 76, 0, 74, 0,  0, 0],
      bass: [38, 0, 0, 0, 0, 0, 0, 0, 45, 0, 0, 0, 0, 0, 0, 0,
             47, 0, 0, 0, 0, 0, 0, 0, 43, 0, 0, 0, 0, 0, 0, 0,
             38, 0, 0, 0, 0, 0, 0, 0, 45, 0, 0, 0, 0, 0, 0, 0,
             47, 0, 0, 0, 0, 0, 0, 0, 43, 0, 0, 0, 0, 0, 0, 0]
    },
    // D whole-tone, sine lead — no eighth-note rests, a continuous rippling
    // current instead of a beat-driven melody. Whole-tone (no semitones) is
    // the classic "underwater" scale (Debussy, water-level video game themes)
    // since it has no leading tone pulling anywhere — it just drifts. One
    // swelling 8-bar wave: rises to a crest in bar 5, recedes back to the
    // tonic to loop. Bass pedal follows the same swell (D, up to the tritone
    // G#, back to D) rather than outlining a chord progression.
    ocean: {
      bpm: 78, wave: "sine",
      lead: [62, 64, 66, 64, 62, 60, 58, 60,
             64, 66, 68, 66, 64, 62, 60, 62,
             66, 68, 70, 68, 66, 64, 62, 64,
             68, 70, 72, 70, 68, 66, 64, 66,
             70, 72, 74, 76, 74, 72, 70, 68,
             68, 66, 64, 62, 64, 66, 68, 70,
             64, 62, 60, 58, 60, 62, 64, 66,
             62, 60, 58, 56, 54, 52, 50, 50],
      bass: [38, 0, 0, 0, 0, 0, 0, 0, 38, 0, 0, 0, 0, 0, 0, 0,
             42, 0, 0, 0, 0, 0, 0, 0, 44, 0, 0, 0, 0, 0, 0, 0,
             44, 0, 0, 0, 0, 0, 0, 0, 42, 0, 0, 0, 0, 0, 0, 0,
             38, 0, 0, 0, 0, 0, 0, 0, 38, 0, 0, 0, 0, 0, 0, 0]
    }
  };
  if (typeof module !== "undefined" && module.exports) module.exports = TUNES;
  else root.TUNES = TUNES;
})(typeof window !== "undefined" ? window : this);
