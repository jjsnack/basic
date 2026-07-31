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
    // A harmonic minor, hollow square lead, quicker — moody 8-bar loop,
    // i–VI–iv–v, eighth-notes filled in with chromatic passing tones (G#
    // leading-tone, the classic minor/aug-2nd horror colour) instead of rests.
    dracula: {
      bpm: 84, wave: "square",
      lead: [69, 71, 72, 74, 76, 74, 72, 71, 74, 73, 72, 71, 69, 68, 67, 0,
             81, 80, 79, 77, 76, 74, 72, 71, 74, 73, 72, 72, 71, 72, 69, 0,
             76, 77, 79, 80, 81, 83, 84, 83, 83, 82, 81, 80, 79, 77, 76, 0,
             77, 76, 76, 74, 74, 72, 72, 71, 71, 69, 69, 68, 69, 75, 69, 0],
      bass: [45, 0, 0, 0, 0, 0, 0, 0, 41, 0, 0, 0, 0, 0, 0, 0,
             38, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0,
             45, 0, 0, 0, 0, 0, 0, 0, 41, 0, 0, 0, 0, 0, 0, 0,
             38, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 75, 0, 0, 0]
    },
    // F major, soft sine lead — a sweet, romantic 8-bar loop, I–vi–IV–V,
    // eighth-notes filled in with diatonic neighbour/passing tones so the
    // line flows instead of stepping on the quarter-note.
    valentine: {
      bpm: 84, wave: "sine",
      lead: [72, 70, 74, 76, 77, 79, 76, 77, 74, 70, 72, 70, 69, 70, 72, 74,
             77, 79, 81, 84, 79, 81, 77, 79, 76, 77, 74, 70, 72, 70, 69, 67,
             70, 72, 69, 70, 67, 69, 65, 65, 67, 70, 69, 70, 72, 76, 74, 76,
             77, 79, 76, 77, 74, 70, 72, 70, 69, 72, 67, 69, 65, 67, 0, 0],
      bass: [41, 0, 0, 0, 0, 0, 0, 0, 38, 0, 0, 0, 0, 0, 0, 0,
             34, 0, 0, 0, 0, 0, 0, 0, 36, 0, 0, 0, 0, 0, 0, 0,
             41, 0, 0, 0, 0, 0, 0, 0, 38, 0, 0, 0, 0, 0, 0, 0,
             34, 0, 0, 0, 0, 0, 0, 0, 36, 0, 0, 0, 0, 0, 0, 0]
    },
    // D major, warm triangle lead — a cozy folk 8-bar loop, I–V–vi–IV with a
    // plagal (IV→I) turnaround. Ink-on-cream, unhurried. Bass walks root-fifth
    // on beats 1 and 3 of every bar (oom-pah) instead of one held note per bar,
    // for a bit more of a beat under the melody.
    paper: {
      bpm: 76, wave: "triangle",
      lead: [74, 0, 78, 0, 81, 0, 78, 0, 76, 0, 74, 0, 71, 0, 74, 0,
             81, 0, 83, 0, 86, 0, 83, 0, 81, 0, 78, 0, 76, 0, 74, 0,
             79, 0, 78, 0, 76, 0, 74, 0, 76, 0, 78, 0, 81, 0, 83, 0,
             81, 0, 79, 0, 78, 0, 76, 0, 78, 0, 76, 0, 74, 0,  0, 0],
      bass: [38, 0, 0, 0, 45, 0, 0, 0, 45, 0, 0, 0, 40, 0, 0, 0,
             47, 0, 0, 0, 42, 0, 0, 0, 43, 0, 0, 0, 38, 0, 0, 0,
             38, 0, 0, 0, 45, 0, 0, 0, 45, 0, 0, 0, 40, 0, 0, 0,
             47, 0, 0, 0, 42, 0, 0, 0, 43, 0, 0, 0, 38, 0, 0, 0]
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
    },
    // D minor pentatonic, mellow triangle lead — an unhurried 4-bar woodland
    // loop, sparse like default/dracula (rests, not a filled-in line).
    forest: {
      bpm: 80, wave: "triangle",
      lead: [62, 0, 65, 0, 69, 0, 65, 0, 62, 0, 60, 0, 65, 0, 69, 0,
             72, 0, 69, 0, 65, 0, 69, 0, 62, 0, 65, 0, 60, 0, 62, 0],
      bass: [38, 0, 0, 0, 0, 0, 0, 0, 43, 0, 0, 0, 0, 0, 0, 0,
             41, 0, 0, 0, 0, 0, 0, 0, 38, 0, 0, 0, 0, 0, 0, 0]
    },
    // A I-vi-ii-V turnaround (the "rhythm changes" progression) — mellow
    // triangle lead instead of square for a warmer combo tone, syncopated
    // off-beat entrances instead of on-the-beat hits (no swing timing in the
    // engine, so the swing has to come from where the rests fall), a
    // chromatic blue-note resolution back to the tonic in bar 4. Bass keeps
    // the oom-pah spacing (root + a jazzier 3rd/7th colour tone per bar,
    // like paper's beats 1 and 3) rather than a continuous walk — the
    // engine's long note-ring would turn a true walking bass into mush.
    winebar: {
      bpm: 92, wave: "triangle",
      lead: [0, 69, 73, 0, 76, 0, 73, 69, 0, 66, 69, 0, 73, 0, 69, 66,
             0, 71, 74, 0, 78, 0, 74, 71, 0, 68, 71, 72, 0, 71, 69, 0],
      bass: [45, 0, 0, 0, 49, 0, 0, 0, 42, 0, 0, 0, 52, 0, 0, 0,
             47, 0, 0, 0, 50, 0, 0, 0, 40, 0, 0, 0, 44, 0, 0, 0]
    },
    // Bare octaves, no thirds — a stripped 4-bar loop, deliberately flat and
    // undecorated to match the theme's zero-colour palette.
    mono: {
      bpm: 84, wave: "square",
      lead: [60, 0, 0, 0, 60, 0, 0, 0, 65, 0, 0, 0, 65, 0, 0, 0,
             60, 0, 0, 0, 60, 0, 0, 0, 67, 0, 0, 0, 65, 0, 0, 0],
      bass: [48, 0, 0, 0, 0, 0, 0, 0, 53, 0, 0, 0, 0, 0, 0, 0,
             48, 0, 0, 0, 0, 0, 0, 0, 55, 0, 0, 0, 53, 0, 0, 0]
    }
  };
  if (typeof module !== "undefined" && module.exports) module.exports = TUNES;
  else root.TUNES = TUNES;
})(typeof window !== "undefined" ? window : this);
