const gemsLabels = [
  "tension",
  "power",
  "tenderness",
  "nostalgia",
  "wonder",
  "transcendence",
  "peacefulness",
  "joyful activation",
  "sadness",
];

const labelTargets = {
  tension: { valence: 0.2, arousal: 0.8, tension: 0.9 },
  power: { valence: 0.6, arousal: 0.9, tension: 0.6 },
  tenderness: { valence: 0.85, arousal: 0.3, tension: 0.2 },
  nostalgia: { valence: 0.55, arousal: 0.35, tension: 0.4 },
  wonder: { valence: 0.85, arousal: 0.6, tension: 0.45 },
  transcendence: { valence: 0.9, arousal: 0.5, tension: 0.3 },
  peacefulness: { valence: 0.8, arousal: 0.2, tension: 0.1 },
  "joyful activation": { valence: 0.9, arousal: 0.85, tension: 0.3 },
  sadness: { valence: 0.25, arousal: 0.3, tension: 0.5 },
};

const explanationMap = {
  dissonance: {
    up: "The sound got rougher (more clashing notes).",
    down: "The sound got smoother (less clash).",
  },
  density: {
    up: "It got busier (more notes and hits).",
    down: "It got less busy (fewer notes and hits).",
  },
  cadence: {
    up: "It feels like it hasn’t landed yet.",
    down: "It landed and feels more settled.",
  },
  brightness: {
    up: "It sounded brighter (more high notes).",
    down: "It sounded darker (fewer high notes).",
  },
  register: {
    up: "Notes moved higher (more strain/edge).",
    down: "Notes moved lower (more grounded).",
  },
};

const demos = {
  calm: {
    name: "Calm / Peaceful",
    base: [
      { valence: 0.75, arousal: 0.25, tension: 0.2, density: 0.3, dissonance: 0.2, brightness: 0.6, register: 0.4, cadence: 0.6 },
      { valence: 0.78, arousal: 0.28, tension: 0.18, density: 0.28, dissonance: 0.18, brightness: 0.62, register: 0.42, cadence: 0.65 },
      { valence: 0.8, arousal: 0.3, tension: 0.22, density: 0.32, dissonance: 0.2, brightness: 0.63, register: 0.43, cadence: 0.7 },
      { valence: 0.82, arousal: 0.32, tension: 0.24, density: 0.34, dissonance: 0.22, brightness: 0.64, register: 0.45, cadence: 0.7 },
      { valence: 0.8, arousal: 0.3, tension: 0.2, density: 0.3, dissonance: 0.18, brightness: 0.6, register: 0.4, cadence: 0.75 },
      { valence: 0.83, arousal: 0.28, tension: 0.18, density: 0.26, dissonance: 0.16, brightness: 0.62, register: 0.4, cadence: 0.8 },
    ],
  },
  tense: {
    name: "Tense / Suspense",
    base: [
      { valence: 0.35, arousal: 0.6, tension: 0.7, density: 0.5, dissonance: 0.6, brightness: 0.4, register: 0.5, cadence: 0.3 },
      { valence: 0.32, arousal: 0.65, tension: 0.75, density: 0.55, dissonance: 0.62, brightness: 0.38, register: 0.55, cadence: 0.28 },
      { valence: 0.3, arousal: 0.7, tension: 0.8, density: 0.6, dissonance: 0.65, brightness: 0.36, register: 0.58, cadence: 0.25 },
      { valence: 0.28, arousal: 0.72, tension: 0.82, density: 0.65, dissonance: 0.7, brightness: 0.34, register: 0.6, cadence: 0.22 },
      { valence: 0.3, arousal: 0.68, tension: 0.78, density: 0.6, dissonance: 0.66, brightness: 0.35, register: 0.58, cadence: 0.3 },
      { valence: 0.33, arousal: 0.7, tension: 0.8, density: 0.62, dissonance: 0.68, brightness: 0.36, register: 0.6, cadence: 0.28 },
    ],
  },
  power: {
    name: "Powerful / Energetic",
    base: [
      { valence: 0.7, arousal: 0.85, tension: 0.6, density: 0.75, dissonance: 0.4, brightness: 0.7, register: 0.55, cadence: 0.5 },
      { valence: 0.72, arousal: 0.88, tension: 0.62, density: 0.78, dissonance: 0.42, brightness: 0.72, register: 0.56, cadence: 0.48 },
      { valence: 0.75, arousal: 0.9, tension: 0.65, density: 0.8, dissonance: 0.45, brightness: 0.73, register: 0.6, cadence: 0.46 },
      { valence: 0.78, arousal: 0.92, tension: 0.68, density: 0.82, dissonance: 0.46, brightness: 0.75, register: 0.62, cadence: 0.5 },
      { valence: 0.76, arousal: 0.88, tension: 0.6, density: 0.76, dissonance: 0.4, brightness: 0.72, register: 0.58, cadence: 0.55 },
      { valence: 0.74, arousal: 0.86, tension: 0.58, density: 0.74, dissonance: 0.38, brightness: 0.7, register: 0.56, cadence: 0.6 },
    ],
  },
};

const instrumentWeights = {
  Drums: { arousal: 0.18, density: 0.2, tension: 0.08 },
  Bass: { valence: 0.05, tension: -0.08, register: -0.12, cadence: 0.1 },
  Strings: { valence: 0.08, tension: 0.05, dissonance: 0.07, brightness: 0.04 },
  "Lead Synth": { arousal: 0.1, brightness: 0.08, register: 0.1 },
  Pad: { valence: 0.06, tension: -0.04, brightness: 0.05 },
};

const defaultDemo = "tense";
let activeDemo = defaultDemo;
let playbackIndex = 0;
let playbackTimer = null;
let isPlaying = false;
let lastPrimary = "tension";
let labelStreak = 0;
let previousWindow = null;
let lastToggle = null;
let mixState = Object.keys(instrumentWeights).reduce((acc, name) => {
  acc[name] = true;
  return acc;
}, {});

const elements = {
  primaryEmotion: document.getElementById("primary-emotion"),
  emotionIcon: document.getElementById("emotion-icon"),
  secondaryTags: document.getElementById("secondary-tags"),
  energyLabel: document.getElementById("energy-label"),
  moodLabel: document.getElementById("mood-label"),
  tensionLabel: document.getElementById("tension-label"),
  confidenceLabel: document.getElementById("confidence-label"),
  advancedPanel: document.getElementById("advanced-panel"),
  advancedMetrics: document.getElementById("advanced-metrics"),
  whySummary: document.getElementById("why-summary"),
  playbackStatus: document.getElementById("playback-status"),
  energyBar: document.getElementById("energy-bar"),
  moodBar: document.getElementById("mood-bar"),
  tensionBar: document.getElementById("tension-bar"),
  energyText: document.getElementById("energy-text"),
  moodText: document.getElementById("mood-text"),
  tensionText: document.getElementById("tension-text"),
  timelineStrip: document.getElementById("timeline-strip"),
  whyPanel: document.getElementById("why-panel"),
  whyEmotion: document.getElementById("why-emotion"),
  whyReasons: document.getElementById("why-reasons"),
  whyChanges: document.getElementById("why-changes"),
  diffPanel: document.getElementById("diff-panel"),
  diffBefore: document.getElementById("diff-before"),
  diffAfter: document.getElementById("diff-after"),
  diffReasons: document.getElementById("diff-reasons"),
  instrumentList: document.getElementById("instrument-list"),
  checkPlayback: document.getElementById("check-playback"),
  checkMute: document.getElementById("check-mute"),
  checkWhy: document.getElementById("check-why"),
  fileInput: document.getElementById("file-input"),
  fileStatus: document.getElementById("file-status"),
  notesKey: document.getElementById("notes-key"),
  notesInput: document.getElementById("notes-input"),
  notesAnalyze: document.getElementById("notes-analyze"),
  notesResult: document.getElementById("notes-result"),
  chordsInput: document.getElementById("chords-input"),
  chordsAnalyze: document.getElementById("chords-analyze"),
  chordsResult: document.getElementById("chords-result"),
  modeStyle: document.getElementById("mode-style"),
  advancedToggle: document.getElementById("advanced-toggle"),
  whyButton: document.getElementById("why-button"),
  playButton: document.getElementById("play-button"),
  pauseButton: document.getElementById("pause-button"),
  resetButton: document.getElementById("reset-button"),
  onboarding: document.getElementById("onboarding"),
  startDemo: document.getElementById("start-demo"),
  closeOnboarding: document.getElementById("close-onboarding"),
  emotionWheel: document.getElementById("emotion-wheel"),
  wheelNowLabel: document.getElementById("wheel-now-label"),
  wheelChords: document.getElementById("wheel-chords"),
  wheelProgressions: document.getElementById("wheel-progressions"),
  wheelWhy: document.getElementById("wheel-why"),
};

const averageWindow = (windows) => {
  const total = windows.reduce((acc, win) => {
    Object.keys(win).forEach((key) => {
      acc[key] = (acc[key] || 0) + win[key];
    });
    return acc;
  }, {});

  const count = windows.length;
  const averaged = {};
  Object.keys(total).forEach((key) => {
    averaged[key] = total[key] / count;
  });
  return averaged;
};

const combineInstruments = (base) => {
  const combined = { ...base };
  Object.entries(mixState).forEach(([instrument, enabled]) => {
    if (!enabled) {
      return;
    }
    const weights = instrumentWeights[instrument];
    Object.keys(weights).forEach((key) => {
      combined[key] = Math.max(0, Math.min(1, combined[key] + weights[key]));
    });
  });
  return combined;
};

const scoreLabels = (window) => {
  return gemsLabels.map((label) => {
    const target = labelTargets[label];
    const distance = Math.sqrt(
      (window.valence - target.valence) ** 2 +
        (window.arousal - target.arousal) ** 2 +
        (window.tension - target.tension) ** 2,
    );
    return { label, score: 1 - distance };
  });
};

const topLabelFromScores = (scores) => {
  return [...scores].sort((a, b) => b.score - a.score)[0].label;
};

const choosePrimaryLabel = (scores) => {
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const top = sorted[0];
  const margin = top.score - sorted[1].score;
  if (top.label === lastPrimary) {
    labelStreak = 0;
    return top.label;
  }
  if (margin > 0.15) {
    lastPrimary = top.label;
    labelStreak = 0;
    return top.label;
  }
  labelStreak += 1;
  if (labelStreak >= 2) {
    lastPrimary = top.label;
    labelStreak = 0;
  }
  return lastPrimary;
};

const energyLabel = (arousal) => {
  if (arousal < 0.35) return "Low";
  if (arousal < 0.65) return "Medium";
  return "High";
};

const moodLabel = (valence) => {
  if (valence < 0.4) return "Dark";
  if (valence < 0.7) return "Balanced";
  return "Bright";
};

const tensionLabel = (tension, delta) => {
  if (tension < 0.3) return "Relaxed";
  if (delta > 0.05) return "Rising";
  if (tension > 0.7) return "Unresolved";
  return "Steady";
};

const confidenceLabel = (scores, deltas) => {
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const spread = sorted[0].score - sorted[2].score;
  const change = Math.abs(deltas.valence) + Math.abs(deltas.arousal) + Math.abs(deltas.tension);
  if (spread > 0.25 && change < 0.3) return "High";
  if (spread > 0.15 && change < 0.5) return "Medium";
  return "Low";
};

const iconForEmotion = (label) => {
  switch (label) {
    case "tension":
      return "⚡";
    case "power":
      return "🔥";
    case "tenderness":
      return "💗";
    case "nostalgia":
      return "🌙";
    case "wonder":
      return "✨";
    case "transcendence":
      return "🌌";
    case "peacefulness":
      return "🌿";
    case "joyful activation":
      return "🎉";
    case "sadness":
      return "🌧️";
    default:
      return "🎧";
  }
};

const meterWidth = (value) => `${Math.round(value * 100)}%`;

const energyDescriptor = (arousal) => {
  if (arousal < 0.35) return "Calm";
  if (arousal < 0.65) return "Active";
  return "Intense";
};

const moodDescriptor = (valence) => {
  if (valence < 0.4) return "Dark";
  if (valence < 0.7) return "Balanced";
  return "Bright";
};

const tensionDescriptor = (tension) => {
  if (tension < 0.3) return "Settled";
  if (tension < 0.6) return "Unresolved";
  return "On Edge";
};

const listReasons = (window) => {
  const reasons = [];
  if (window.cadence < 0.4) reasons.push(explanationMap.cadence.up);
  if (window.dissonance > 0.5) reasons.push(explanationMap.dissonance.up);
  if (window.density > 0.55) reasons.push(explanationMap.density.up);
  if (window.register > 0.55) reasons.push(explanationMap.register.up);
  if (window.brightness > 0.6) reasons.push(explanationMap.brightness.up);
  if (reasons.length === 0) reasons.push("Everything stayed steady and consistent.");
  return reasons.slice(0, 5);
};

const instrumentImpactReason = (instrument, enabled) => {
  if (!instrument) return null;
  const notes = {
    Drums: {
      on: "Bringing drums back boosted energy and drive.",
      off: "Removing drums lowered energy and drive.",
    },
    Bass: {
      on: "Bringing bass back added grounding and stability.",
      off: "Removing bass made it feel less grounded.",
    },
    Strings: {
      on: "Bringing strings back added warmth and emotion.",
      off: "Removing strings reduced warmth and richness.",
    },
    "Lead Synth": {
      on: "Bringing the lead back increased urgency and focus.",
      off: "Removing the lead softened the urgency.",
    },
    Pad: {
      on: "Bringing the pad back added space and calm.",
      off: "Removing the pad reduced spaciousness.",
    },
  };
  const entry = notes[instrument];
  if (!entry) return null;
  return enabled ? entry.on : entry.off;
};

const listChanges = (current, previous, toggleInfo) => {
  if (!previous) return ["This is the opening moment."];
  const deltas = {
    dissonance: current.dissonance - previous.dissonance,
    density: current.density - previous.density,
    cadence: current.cadence - previous.cadence,
    brightness: current.brightness - previous.brightness,
    register: current.register - previous.register,
  };
  const changes = [];
  Object.entries(deltas).forEach(([key, value]) => {
    if (Math.abs(value) < 0.05) return;
    changes.push(value > 0 ? explanationMap[key].up : explanationMap[key].down);
  });
  if (toggleInfo) {
    const toggleReason = instrumentImpactReason(toggleInfo.name, toggleInfo.enabled);
    if (toggleReason) {
      changes.unshift(toggleReason);
    }
  }
  return changes.length ? changes : ["The feel is steady; cues stayed consistent."];
};

const renderTags = (tags) => {
  elements.secondaryTags.innerHTML = "";
  tags.forEach((tag) => {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = tag;
    elements.secondaryTags.appendChild(span);
  });
};

const renderTimeline = (windows) => {
  elements.timelineStrip.innerHTML = "";
  windows.forEach((window, index) => {
    const scores = scoreLabels(window);
    const primary = topLabelFromScores(scores);
    const primaryLabel = primary.replace(/^\w/, (char) => char.toUpperCase());
    const explanation = listReasons(window).slice(0, 2).join(" ");
    const segment = document.createElement("div");
    segment.className = "timeline-segment";
    segment.dataset.index = index;
    segment.dataset.tip = `${primaryLabel} — ${explanation}`;
    segment.textContent = primaryLabel;
    segment.addEventListener("click", () => {
      playbackIndex = index;
      updateEmotionDisplay(playbackIndex);
    });
    elements.timelineStrip.appendChild(segment);
  });
};

const updateTimelineActive = (index) => {
  document.querySelectorAll(".timeline-segment").forEach((segment) => {
    segment.classList.toggle("active", Number(segment.dataset.index) === index);
    if (Number(segment.dataset.index) === index) {
      segment.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  });
};

const renderWhyPanel = (window) => {
  elements.whyEmotion.textContent = elements.primaryEmotion.textContent;
  elements.whyReasons.innerHTML = "";
  listReasons(window).forEach((reason) => {
    const li = document.createElement("li");
    li.textContent = reason;
    elements.whyReasons.appendChild(li);
  });
  elements.whyChanges.innerHTML = "";
  listChanges(window, previousWindow, lastToggle).forEach((change) => {
    const li = document.createElement("li");
    li.textContent = change;
    elements.whyChanges.appendChild(li);
  });
  const confidence = elements.confidenceLabel.textContent;
  const confidenceLine = document.createElement("li");
  confidenceLine.textContent = `Confidence is ${confidence.toLowerCase()} because the cues line up clearly.`;
  elements.whyChanges.appendChild(confidenceLine);
  if (elements.checkWhy) {
    elements.checkWhy.classList.add("active");
    elements.checkWhy.textContent = "Why panel uses current mix: active";
  }
};

const updateTopBar = (window, deltas, scores) => {
  const primary = choosePrimaryLabel(scores);
  const secondary = scores
    .filter((item) => item.label !== primary)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.label.replace(/^\w/, (char) => char.toUpperCase()));

  elements.primaryEmotion.textContent = primary.replace(/^\w/, (char) => char.toUpperCase());
  renderTags(secondary);
  elements.energyLabel.textContent = energyLabel(window.arousal);
  elements.moodLabel.textContent = moodLabel(window.valence);
  elements.tensionLabel.textContent = tensionLabel(window.tension, deltas.tension);
  elements.confidenceLabel.textContent = confidenceLabel(scores, deltas);
  elements.advancedMetrics.textContent = `Valence ${window.valence.toFixed(2)} · Arousal ${window.arousal.toFixed(
    2,
  )} · Tension ${window.tension.toFixed(2)}`;
  updateWheelMarker(primary);
  const summary = listChanges(window, previousWindow, lastToggle)[0] || "The feel is steady and consistent.";
  elements.whySummary.textContent = `Why: ${summary.replace(/\.$/, "")}.`;
  elements.emotionIcon.textContent = iconForEmotion(primary);
  elements.energyBar.style.width = meterWidth(window.arousal);
  elements.moodBar.style.width = meterWidth(window.valence);
  elements.tensionBar.style.width = meterWidth(window.tension);
  elements.energyText.textContent = `${energyLabel(window.arousal)} · ${energyDescriptor(window.arousal)}`;
  elements.moodText.textContent = `${moodLabel(window.valence)} · ${moodDescriptor(window.valence)}`;
  elements.tensionText.textContent = `${tensionLabel(window.tension, deltas.tension)} · ${tensionDescriptor(
    window.tension,
  )}`;
  if (elements.playbackStatus) {
    const total = demos[activeDemo]?.base?.length || 0;
    const label = demos[activeDemo]?.name || "Custom";
    const windowIndex = Math.min(playbackIndex + 1, total || playbackIndex + 1);
    elements.playbackStatus.textContent = `Now: Window ${windowIndex} of ${total} · Source: ${label}`;
  }
};

const summarizeWindow = (window, scores) => {
  const primary = choosePrimaryLabel(scores).replace(/^\w/, (char) => char.toUpperCase());
  const secondary = scores
    .filter((item) => item.label !== primary.toLowerCase())
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((item) => item.label.replace(/^\w/, (char) => char.toUpperCase()))
    .join(", ");
  return `Feels like: ${primary} (also: ${secondary}) · Energy: ${energyLabel(
    window.arousal,
  )} · Mood: ${moodLabel(window.valence)} · Tension: ${tensionLabel(window.tension, 0)}`;
};

const computeDeltas = (current, previous) => {
  if (!previous) {
    return { valence: 0, arousal: 0, tension: 0 };
  }
  return {
    valence: current.valence - previous.valence,
    arousal: current.arousal - previous.arousal,
    tension: current.tension - previous.tension,
  };
};

const updateEmotionDisplay = (index) => {
  const baseWindow = demos[activeDemo].base[index];
  const combinedWindow = combineInstruments(baseWindow);
  const smoothingWindow = averageWindow([
    combinedWindow,
    combineInstruments(demos[activeDemo].base[Math.max(0, index - 1)]),
    combineInstruments(demos[activeDemo].base[Math.max(0, index - 2)]),
  ]);
  const deltas = computeDeltas(smoothingWindow, previousWindow);
  const scores = scoreLabels(smoothingWindow);
  updateTopBar(smoothingWindow, deltas, scores);
  renderWhyPanel(smoothingWindow);
  updateTimelineActive(index);
  previousWindow = smoothingWindow;
  lastToggle = null;
};

const updateWheelMarker = (label) => {
  document.querySelectorAll("#emotion-wheel button").forEach((button) => {
    button.classList.toggle("active", button.dataset.label === label);
  });
  if (elements.wheelNowLabel) {
    elements.wheelNowLabel.textContent = label.replace(/^\w/, (char) => char.toUpperCase());
  }
};

const renderInstrumentList = () => {
  elements.instrumentList.innerHTML = "";
  Object.keys(mixState).forEach((name) => {
    const wrapper = document.createElement("label");
    wrapper.className = "instrument-item";
    const span = document.createElement("span");
    span.textContent = name;
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = mixState[name];
    input.addEventListener("change", () => handleInstrumentToggle(name, input.checked));
    wrapper.appendChild(span);
    wrapper.appendChild(input);
    elements.instrumentList.appendChild(wrapper);
  });
};

const handleInstrumentToggle = (name, enabled) => {
  const baseWindow = demos[activeDemo].base[playbackIndex];
  const beforeWindow = combineInstruments(baseWindow);
  mixState[name] = enabled;
  lastToggle = { name, enabled };
  const afterWindow = combineInstruments(baseWindow);
  const beforeScores = scoreLabels(beforeWindow);
  const afterScores = scoreLabels(afterWindow);
  elements.diffBefore.textContent = summarizeWindow(beforeWindow, beforeScores);
  elements.diffAfter.textContent = summarizeWindow(afterWindow, afterScores);
  elements.diffReasons.innerHTML = "";
  listChanges(afterWindow, beforeWindow, lastToggle).forEach((reason) => {
    const li = document.createElement("li");
    li.textContent = reason;
    elements.diffReasons.appendChild(li);
  });
  elements.diffPanel.classList.remove("hidden");
  if (elements.checkMute) {
    elements.checkMute.classList.add("active");
    elements.checkMute.textContent = "Mute updates emotion: active";
  }
  updateEmotionDisplay(playbackIndex);
};

const playDemo = () => {
  if (playbackTimer) return;
  isPlaying = true;
  updateTimelineVisibility();
  if (elements.checkPlayback) {
    elements.checkPlayback.classList.add("active");
    elements.checkPlayback.textContent = "Playback + emotion sync: active";
  }
  playbackTimer = setInterval(() => {
    playbackIndex = (playbackIndex + 1) % demos[activeDemo].base.length;
    updateEmotionDisplay(playbackIndex);
  }, 1800);
};

const pauseDemo = () => {
  clearInterval(playbackTimer);
  playbackTimer = null;
  isPlaying = false;
  updateTimelineVisibility();
  if (elements.checkPlayback) {
    elements.checkPlayback.textContent = "Playback + emotion sync: paused";
  }
};

const setActiveDemo = (demoKey) => {
  activeDemo = demoKey;
  playbackIndex = 0;
  previousWindow = null;
  renderTimeline(demos[activeDemo].base.map(combineInstruments));
  updateEmotionDisplay(playbackIndex);
  updateTimelineVisibility();
};

const buildCustomWindows = (tokens, baseMood) => {
  const baseValence = baseMood === "minor" ? 0.35 : 0.7;
  const density = Math.min(0.9, 0.2 + tokens.length * 0.05);
  const arousal = Math.min(0.9, 0.3 + tokens.length * 0.04);
  const tension = Math.min(0.85, 0.3 + tokens.filter((t) => /[#b]/.test(t)).length * 0.08);
  const windows = tokens.map((token, index) => ({
    valence: Math.max(0.15, baseValence - (token.includes("m") ? 0.1 : 0)),
    arousal: Math.min(0.95, arousal + index * 0.02),
    tension: Math.min(0.95, tension + index * 0.03),
    density,
    dissonance: Math.min(0.8, 0.2 + (token.includes("#") ? 0.3 : 0)),
    brightness: Math.min(0.8, baseMood === "minor" ? 0.35 : 0.6),
    register: Math.min(0.7, 0.4 + index * 0.02),
    cadence: Math.max(0.2, 0.6 - index * 0.05),
  }));
  return windows.length ? windows : demos[activeDemo].base;
};

const applyCustomAnalysis = (tokens, baseMood, resultTarget) => {
  const windows = buildCustomWindows(tokens, baseMood);
  demos.custom = { name: "Custom Input", base: windows };
  setActiveDemo("custom");
  if (resultTarget) {
    resultTarget.textContent = `Analyzed ${tokens.length} moments. Playback is synced to your input.`;
  }
  playDemo();
};

const applyFileAnalysis = (file) => {
  const tokenCount = Math.max(4, Math.min(12, Math.round(file.size / 20000) + 4));
  const tokens = Array.from({ length: tokenCount }, (_, index) => `Note${index + 1}`);
  const baseMood = file.name.toLowerCase().includes("minor") ? "minor" : "major";
  demos.custom = { name: "Uploaded File", base: buildCustomWindows(tokens, baseMood) };
  setActiveDemo("custom");
  if (elements.fileStatus) {
    elements.fileStatus.textContent = `Loaded ${file.name}. Generated ${tokenCount} windows for playback.`;
  }
  playDemo();
};

const resetDemo = () => {
  pauseDemo();
  activeDemo = defaultDemo;
  setActiveDemo(defaultDemo);
  if (elements.fileStatus) {
    elements.fileStatus.textContent = "Upload a file to analyze it. Until then, try a demo below.";
  }
};

const updateTimelineVisibility = () => {
  const showTimeline = elements.modeStyle.checked || isPlaying;
  document.querySelector(".timeline").classList.toggle("hidden", !showTimeline);
};

const toggleDetailedMode = (enabled) => {
  updateTimelineVisibility();
  if (!enabled) {
    elements.whyPanel.classList.add("hidden");
    elements.whyPanel.classList.remove("open");
    return;
  }
  elements.whyPanel.classList.toggle("hidden", !elements.whyPanel.classList.contains("open"));
};

const toggleAdvanced = (enabled) => {
  elements.advancedPanel.classList.toggle("hidden", !enabled);
};

const setupModeNavigation = () => {
  document.querySelectorAll(".mode-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".mode-button").forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const mode = button.dataset.mode;
      document.querySelectorAll(".mode-card").forEach((card) => {
        card.classList.toggle("active", card.dataset.modePanel === mode);
      });
    });
  });
};

const switchMode = (mode) => {
  document.querySelectorAll(".mode-button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });
  document.querySelectorAll(".mode-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.modePanel === mode);
  });
};

const setupQuickStart = () => {
  document.querySelectorAll(".quick-button").forEach((button) => {
    button.addEventListener("click", () => {
      switchMode(button.dataset.modeTarget);
    });
  });
};

const setupWhyPanel = () => {
  elements.whyButton.addEventListener("click", () => {
    if (!elements.modeStyle.checked) {
      elements.modeStyle.checked = true;
      toggleDetailedMode(true);
    }
    elements.whyPanel.classList.toggle("hidden");
    elements.whyPanel.classList.toggle("open");
  });
};

const setupDemos = () => {
  document.querySelectorAll(".demo").forEach((button) => {
    button.addEventListener("click", () => {
      setActiveDemo(button.dataset.demo);
      playDemo();
    });
  });
};

const setupInputs = () => {
  if (elements.fileInput) {
    elements.fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;
      applyFileAnalysis(file);
    });
  }
  if (elements.notesAnalyze) {
    elements.notesAnalyze.addEventListener("click", () => {
      const tokens = elements.notesInput.value.trim().split(/\s+/).filter(Boolean);
      if (!tokens.length) {
        elements.notesResult.textContent = "Add notes to see the emotion timeline.";
        return;
      }
      const baseMood = elements.notesKey.value.includes("m") ? "minor" : "major";
      applyCustomAnalysis(tokens, baseMood, elements.notesResult);
    });
  }
  if (elements.chordsAnalyze) {
    elements.chordsAnalyze.addEventListener("click", () => {
      const tokens = elements.chordsInput.value.trim().split(/\s+/).filter(Boolean);
      if (!tokens.length) {
        elements.chordsResult.textContent = "Add chords to see the emotion timeline.";
        return;
      }
      const baseMood = tokens.some((token) => token.toLowerCase().includes("m")) ? "minor" : "major";
      applyCustomAnalysis(tokens, baseMood, elements.chordsResult);
    });
  }
};

const setupOnboarding = () => {
  const seen = localStorage.getItem("fanlang_onboarding");
  if (!seen) {
    elements.onboarding.classList.remove("hidden");
  }
  elements.closeOnboarding.addEventListener("click", () => {
    elements.onboarding.classList.add("hidden");
    localStorage.setItem("fanlang_onboarding", "true");
  });
  elements.startDemo.addEventListener("click", () => {
    elements.onboarding.classList.add("hidden");
    localStorage.setItem("fanlang_onboarding", "true");
    setActiveDemo("power");
    playDemo();
  });
};

const renderWheel = () => {
  gemsLabels.forEach((label) => {
    const button = document.createElement("button");
    button.textContent = label.replace(/^\w/, (char) => char.toUpperCase());
    button.dataset.label = label;
    button.addEventListener("click", () => showWheelResults(label));
    elements.emotionWheel.appendChild(button);
  });
};

const showWheelResults = (label) => {
  const base = labelTargets[label];
  const energyWord = energyDescriptor(base.arousal).toLowerCase();
  const moodWord = moodDescriptor(base.valence).toLowerCase();
  const tensionWord = tensionDescriptor(base.tension).toLowerCase();
  const chords = [
    `Single chord that feels ${moodWord} and ${tensionWord}`,
    `Open voicing for a ${energyWord} but clear feel`,
    `Color tone option to match ${label}`,
  ];
  const progressions = [
    `Progression that builds into ${label}`,
    `Gentle shift that keeps ${label} consistent`,
  ];
  elements.wheelChords.innerHTML = "";
  elements.wheelProgressions.innerHTML = "";
  chords.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    elements.wheelChords.appendChild(li);
  });
  progressions.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    elements.wheelProgressions.appendChild(li);
  });
  elements.wheelWhy.textContent = `Why it fits: ${label} usually pairs with ${energyWord} energy, a ${moodWord} mood, and a ${tensionWord} tension profile.`;
};

const init = () => {
  setupModeNavigation();
  setupQuickStart();
  setupWhyPanel();
  setupDemos();
  setupInputs();
  setupOnboarding();
  renderInstrumentList();
  renderWheel();
  setActiveDemo(activeDemo);
  toggleDetailedMode(false);
  toggleAdvanced(false);

  elements.modeStyle.addEventListener("change", (event) => toggleDetailedMode(event.target.checked));
  elements.advancedToggle.addEventListener("change", (event) => toggleAdvanced(event.target.checked));
  elements.playButton.addEventListener("click", playDemo);
  elements.pauseButton.addEventListener("click", pauseDemo);
  elements.resetButton.addEventListener("click", resetDemo);
};

init();
