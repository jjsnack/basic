/* basic — a small floating terminal. No deps. Hidden until the launcher opens it;
   the page works fine without it. */
(function () {
  "use strict";

  // ---- pure core (side-effect-free so `node console.js` can self-check) ----

  function parse(input) {
    var parts = String(input).trim().split(/\s+/);
    return { name: (parts[0] || "").toLowerCase(), args: parts.slice(1) };
  }

  // Minimal FIGfont parser + renderer (full-width, no smushing). No deps.
  function parseFig(txt) {
    var lines = String(txt).split("\n");
    var head = lines[0].split(" ");
    var hard = head[0].slice(-1);            // hardblank char (last of signature)
    var height = parseInt(head[1], 10);
    var comment = parseInt(head[5], 10);
    if (!(height > 0)) return null;
    var map = {}, idx = 1 + comment;
    for (var c = 32; c <= 126; c++) {
      var glyph = [];
      for (var r = 0; r < height; r++) {
        var line = (lines[idx++] || "").replace(/\r$/, "");
        var end = line.slice(-1);
        if (end) line = line.replace(new RegExp(end.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "+$"), "");
        glyph.push(line.split(hard).join(" "));
      }
      map[c] = glyph;
    }
    return { height: height, map: map };
  }

  function banner(text, fig) {
    if (!fig) return [String(text)];
    var rows = [];
    for (var r = 0; r < fig.height; r++) rows.push("");
    var s = String(text);
    for (var i = 0; i < s.length; i++) {
      var g = fig.map[s.charCodeAt(i)] || fig.map[32];
      for (var r2 = 0; r2 < fig.height; r2++) rows[r2] += g[r2] || "";
    }
    // drop fully-blank leading/trailing rows some fonts pad with
    while (rows.length && !rows[0].trim()) rows.shift();
    while (rows.length && !rows[rows.length - 1].trim()) rows.pop();
    return rows;
  }

  // run(input, ctx) -> { lines:[{text}], clear?, close?, theme? }.  ctx.history: string[]
  function run(input, ctx) {
    var cmd = parse(input);
    var history = (ctx && ctx.history) || [];

    switch (cmd.name) {
      case "":
        return { lines: [] };

      case "help":
        return { lines: [
          { text: "commands" },
          { text: "  theme    : changes the theme of the site" },
          { text: "  music    : plays an 8-bit soundtrack" },
          { text: "  history  : shows command history" },
          { text: "  clear    : clears the screen" },
          { text: "  close    : closes the console" },
          { text: "  help     : this message" }
        ] };

      case "theme": {
        var sub = (cmd.args[0] || "").toLowerCase();
        // base modes first, then colour palettes (see main.css)
        var modes = ["light", "dark", "auto", "paper", "dracula", "valentine"];
        if (sub === "list") {
          return { lines: modes.map(function (m) { return { text: "   " + m }; }) };
        }
        if (sub === "set") {
          var mode = (cmd.args[1] || "").toLowerCase();
          if (modes.indexOf(mode) === -1) return { lines: [{ text: "usage: theme set <" + modes.join(" | ") + ">" }] };
          return { lines: [{ text: "theme set to " + mode + "." }], theme: mode };
        }
        return { lines: [
          { text: "Usage:  theme <subcommand> ..." },
          { text: "" },
          { text: "   Changes the theme of the site" },
          { text: "" },
          { text: "Subcommands:" },
          { text: "" },
          { text: "   list : List available themes" },
          { text: "   set  : Set the theme" }
        ] };
      }

      case "history":
        if (!history.length) return { lines: [{ text: "no history yet." }] };
        return { lines: history.map(function (h, i) {
          return { text: (i + 1 < 10 ? " " : "") + (i + 1) + "  " + h };
        }) };

      case "music": {
        var sub = (cmd.args[0] || "").toLowerCase();
        if (sub === "play") return { lines: [], music: "on" };
        if (sub === "stop") return { lines: [], music: "off" };
        if (sub === "volume") {
          var v = parseInt(cmd.args[1], 10);
          if (!(v >= 0 && v <= 10)) return { lines: [{ text: "usage: music volume <0-10>" }] };
          return { lines: [{ text: "volume set to " + v + "." }], volume: v };
        }
        return { lines: [
          { text: "Usage:  music <subcommand> ..." },
          { text: "" },
          { text: "   Play some tunes" },
          { text: "" },
          { text: "Subcommands:" },
          { text: "" },
          { text: "   play   : Play music" },
          { text: "   stop   : Stop music" },
          { text: "   volume : Set music volume [0-10]" }
        ] };
      }

      case "clear":
        return { lines: [], clear: true };

      case "close":
        return { lines: [{ text: "bye." }], close: true };

      default:
        return { lines: [{ text: cmd.name + ": command not found. Type `help`." }] };
    }
  }

  // ---- browser wiring ----

  if (typeof document !== "undefined") {
    var launch = document.querySelector(".console-launch");
    var root = document.querySelector(".console");
    if (launch && root) {
      var bar = root.querySelector(".console__bar");
      var log = root.querySelector(".console__log");
      var form = root.querySelector(".console__form");
      var input = root.querySelector(".console__input");
      var expandBtn = root.querySelector(".console__expand");
      var closeBtn = root.querySelector(".console__close");
      var cmdHistory = []; // local — do not shadow window.history

      var write = function (line, kind) {
        var el = document.createElement("div");
        el.className = "console__line" + (kind ? " console__line--" + kind : "");
        el.textContent = line.text;
        log.appendChild(el);
      };

      // ---- 8-bit soundtrack: calm C-major pentatonic, WebAudio, no assets ----
      // 32 eighth-notes. midi note, 0 = rest. Sparse melody that rings.
      var chiptune = (function () {
        var lead = [72, 0, 76, 0, 79, 0, 76, 0, 74, 0, 77, 0, 81, 0, 79, 0,
                    72, 0, 76, 0, 84, 0, 79, 0, 81, 0, 79, 0, 76, 0, 74, 0];
        var bass = [48, 0, 0, 0, 0, 0, 0, 0, 45, 0, 0, 0, 0, 0, 0, 0,
                    41, 0, 0, 0, 0, 0, 0, 0, 43, 0, 0, 0, 0, 0, 0, 0];
        var spn = 60 / 84 / 2; // seconds per eighth-note at a gentle 84bpm
        var ctx, master, timer, nextTime, step, playing = false, vol = 0.5;
        var freq = function (m) { return 440 * Math.pow(2, (m - 69) / 12); };
        var voice = function (m, t, dur, type, peak) { // peak: per-note gain (distinct from master vol)
          if (!m) return;
          var o = ctx.createOscillator(), g = ctx.createGain();
          o.type = type; o.frequency.value = freq(m);
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(peak, t + 0.04); // soft attack
          g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
          o.connect(g); g.connect(master); o.start(t); o.stop(t + dur);
        };
        var tick = function () {
          while (nextTime < ctx.currentTime + 0.12) {
            voice(lead[step], nextTime, spn * 2.2, "triangle", 0.14); // let it ring
            voice(bass[step], nextTime, spn * 7, "sine", 0.12);       // slow pad
            step = (step + 1) % lead.length;
            nextTime += spn;
          }
        };
        return {
          // Resolves once audio is actually running; rejects if the browser blocks it.
          on: function () {
            if (playing) return Promise.resolve();
            if (!ctx) {
              ctx = new (window.AudioContext || window.webkitAudioContext)();
              master = ctx.createGain(); master.gain.value = vol; master.connect(ctx.destination);
            }
            playing = true; step = 0;
            return Promise.resolve(ctx.resume()).then(function () {
              nextTime = ctx.currentTime + 0.05;
              tick(); timer = setInterval(tick, 25);
            }, function (err) { playing = false; throw err; });
          },
          off: function () { playing = false; clearInterval(timer); },
          setVolume: function (n) { vol = n / 10; if (master) master.gain.value = vol; }
        };
      })();

      var applyTheme = function (mode) {
        if (mode === "auto") { localStorage.removeItem("theme"); delete document.documentElement.dataset.theme; }
        else { localStorage.setItem("theme", mode); document.documentElement.dataset.theme = mode; }
      };

      var open = function () {
        root.hidden = false;
        launch.setAttribute("aria-expanded", "true");
        input.focus();
      };
      var close = function () {
        chiptune.off();
        root.hidden = true;
        root.classList.remove("console--docked");
        root.style.left = root.style.top = root.style.right = root.style.bottom = "";
        expandBtn.setAttribute("aria-pressed", "false");
        launch.setAttribute("aria-expanded", "false");
        launch.focus();
      };
      var toggleDock = function () {
        var docked = root.classList.toggle("console--docked");
        if (docked) { root.style.left = root.style.top = root.style.right = root.style.bottom = ""; }
        expandBtn.setAttribute("aria-pressed", docked ? "true" : "false");
        input.focus();
      };

      launch.addEventListener("click", open);
      closeBtn.addEventListener("click", close);
      expandBtn.addEventListener("click", toggleDock);

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !root.hidden) close();
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var value = input.value;
        write({ text: "$ " + value }, "cmd");
        if (value.trim()) cmdHistory.push(value.trim());
        var res = run(value, { history: cmdHistory });
        if (res.clear) log.innerHTML = "";
        res.lines.forEach(function (l) { write(l); });
        if (res.theme) applyTheme(res.theme);
        if (res.music === "on") {
          chiptune.on().then(
            function () { write({ text: "♪ music on" }); log.scrollTop = log.scrollHeight; },
            function () { write({ text: "music blocked by the browser — interact with the page and retry." }); log.scrollTop = log.scrollHeight; }
          );
        }
        if (res.music === "off") { chiptune.off(); write({ text: "music off" }); }
        if (res.volume != null) chiptune.setVolume(res.volume);
        input.value = "";
        log.scrollTop = log.scrollHeight;
        if (res.close) close();
      });

      root.querySelector(".console__screen").addEventListener("click", function () { input.focus(); });

      // Drag by the title bar (skipped while docked).
      bar.addEventListener("pointerdown", function (e) {
        if (e.target.closest(".console__btn") || root.classList.contains("console--docked")) return;
        var rect = root.getBoundingClientRect();
        var dx = e.clientX - rect.left, dy = e.clientY - rect.top;
        var move = function (ev) {
          var x = Math.max(0, Math.min(window.innerWidth - rect.width, ev.clientX - dx));
          var y = Math.max(0, Math.min(window.innerHeight - rect.height, ev.clientY - dy));
          root.style.left = x + "px"; root.style.top = y + "px";
          root.style.right = root.style.bottom = "auto";
        };
        var up = function () {
          document.removeEventListener("pointermove", move);
          document.removeEventListener("pointerup", up);
        };
        document.addEventListener("pointermove", move);
        document.addEventListener("pointerup", up);
      });

      write({ text: "\n" });
      write({ text: "type `help` to see available commands" });
      launch.hidden = false;

      // Banner: fetch the figfont (a cached, fingerprinted asset — not inlined
      // base64 per page) and render it above the welcome text once it arrives.
      if (root.dataset.fontSrc) {
        fetch(root.dataset.fontSrc).then(function (r) { return r.text(); }).then(function (txt) {
          var fig = null;
          try { fig = parseFig(txt); } catch (e) { fig = null; }
          var art = document.createElement("pre");
          art.className = "console__banner-art";
          art.setAttribute("aria-hidden", "true"); // decorative ASCII — keep it out of the aria-live log
          art.textContent = banner(root.dataset.title || "", fig).join("\n");
          log.insertBefore(art, log.firstChild);
        }).catch(function () {}); // no banner if the font can't load — page still works
      }
    }
  }

  // ---- self-check: `node assets/js/console.js` ----

  if (typeof module !== "undefined" && require.main === module) {
    var assert = require("assert");
    assert.strictEqual(run("", {}).lines.length, 0);
    assert.ok(/theme/.test(run("help", {}).lines[1].text));
    assert.strictEqual(run("theme set dark", {}).theme, "dark");
    assert.strictEqual(run("theme set dracula", {}).theme, "dracula");
    assert.strictEqual(run("theme set valentine", {}).theme, "valentine");
    assert.ok(/usage: theme set/.test(run("theme set purple", {}).lines[0].text));
    assert.ok(/dark/.test(run("theme list", {}).lines[1].text));
    assert.ok(/Subcommands/.test(run("theme", {}).lines[4].text));
    assert.strictEqual(run("music play", {}).music, "on");
    assert.strictEqual(run("music stop", {}).music, "off");
    assert.strictEqual(run("music volume 7", {}).volume, 7);
    assert.ok(/0-10/.test(run("music volume 99", {}).lines[0].text));
    assert.ok(/Subcommands/.test(run("music", {}).lines[4].text));
    assert.strictEqual(run("clear", {}).clear, true);
    assert.strictEqual(run("close", {}).close, true);
    assert.ok(/no history/.test(run("history", { history: [] }).lines[0].text));
    assert.ok(/theme dark/.test(run("history", { history: ["theme dark"] }).lines[0].text));
    assert.ok(/not found/.test(run("wat", {}).lines[0].text));
    assert.deepStrictEqual(banner("x", null), ["x"], "no font -> plain title");
    var flf = require("fs").readFileSync(__dirname + "/../figlet/heading.flf", "utf8");
    var fig = parseFig(flf);
    assert.ok(fig && fig.height > 0, "figfont parses");
    var b = banner("basic", fig);
    assert.ok(b.length > 0 && b.some(function (r) { return /\S/.test(r); }), "banner renders glyphs");
    console.log("console.js self-check passed\n" + b.join("\n"));
  }
})();
