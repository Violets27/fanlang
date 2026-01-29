let emotionWindows = [
  {
    time: "0:00",
    valence: -0.2,
    arousal: 0.7,
    tension: 0.8,
    primary: "Tension",
    secondary: ["Power", "Urgency"],
    reasons: [
      "Harmony is unresolved (cadence not completed).",
      "Dissonance increased in the chord stack.",
      "Rhythmic activity is high with dense onsets.",
      "Register climbed, adding perceived strain."
    ],
    changes: [
      "More instruments entered, increasing density and energy.",
      "A new chord added instability."
    ]
  },
  {
    time: "0:08",
    valence: -0.1,
    arousal: 0.6,
    tension: 0.7,
    primary: "Wonder",
    secondary: ["Tension", "Power"],
    reasons: [
      "Texture opened up, making the sound feel expansive.",
      "Melody climbed with longer sustains.",
      "Harmonic color shifted brighter without resolving fully."
    ],
    changes: [
      "Density dipped slightly, lowering intensity.",
      "Sustained tones increased, adding spaciousness."
    ]
  },
  {
    time: "0:16",
    valence: 0.1,
    arousal: 0.4,
    tension: 0.4,
    primary: "Tenderness",
    secondary: ["Peacefulness", "Nostalgia"],
    reasons: [
      "Rhythmic activity softened, reducing urgency.",
      "Harmony stabilized with clearer resolution.",
      "Lower register support made it feel grounded."
    ],
    changes: [
      "Cadence resolved, easing tension.",
      "Percussion dropped out, lowering energy."
    ]
  },
  {
    time: "0:24",
    valence: 0.2,
    arousal: 0.5,
    tension: 0.5,
    primary: "Power",
    secondary: ["Joyful Activation", "Wonder"],
    reasons: [
      "Rhythm thickened with steady accents.",
      "Bright tones returned in upper voices.",
      "Harmonic movement accelerated."
    ],
    changes: [
      "Percussion re-entered, lifting energy.",
      "Brighter chord voicing increased optimism."
    ]
  }
];

const emotionWheel = [
  "Tension",
  "Power",
  "Tenderness",
  "Nostalgia",
  "Wonder",
  "Transcendence",
  "Peacefulness",
  "Joyful Activation",
  "Sadness"
];

const chordTemplates = [
  { name: "Cmaj7", valence: 0.4, arousal: 0.3, tension: 0.2, hint: "warm stability" },
  { name: "Am7", valence: -0.1, arousal: 0.25, tension: 0.3, hint: "gentle minor color" },
  { name: "Bm7b5", valence: -0.3, arousal: 0.5, tension: 0.8, hint: "unstable pull" },
  { name: "E5", valence: 0.2, arousal: 0.75, tension: 0.5, hint: "driven weight" },
  { name: "Cmaj7#11", valence: 0.45, arousal: 0.35, tension: 0.55, hint: "bright lift" },
  { name: "Gsus2", valence: 0.15, arousal: 0.4, tension: 0.5, hint: "open suspension" },
  { name: "F#dim7", valence: -0.35, arousal: 0.6, tension: 0.85, hint: "sharp instability" },
  { name: "Dadd9", valence: 0.35, arousal: 0.25, tension: 0.2, hint: "soft openness" },
  { name: "Em", valence: -0.35, arousal: 0.3, tension: 0.45, hint: "somber shade" },
  { name: "A9", valence: 0.2, arousal: 0.7, tension: 0.55, hint: "energetic sparkle" }
];

const progressionTemplates = [
  { name: "I – V – vi – IV", valence: 0.3, arousal: 0.6, tension: 0.4, hint: "uplifting momentum" },
  { name: "i – iv – V", valence: -0.25, arousal: 0.5, tension: 0.7, hint: "dark pull" },
  { name: "vi – IV – I – V", valence: 0.1, arousal: 0.35, tension: 0.4, hint: "soft memory" },
  { name: "iiø7 – V7 – i", valence: -0.3, arousal: 0.55, tension: 0.8, hint: "tight release" },
  { name: "I – IV – I", valence: 0.35, arousal: 0.2, tension: 0.2, hint: "calm grounding" },
  { name: "I – II – V", valence: 0.3, arousal: 0.45, tension: 0.55, hint: "lifted wonder" }
];

const instruments = [
  { name: "Piano", active: true },
  { name: "Strings", active: true },
  { name: "Drums", active: true },
  { name: "Bass", active: true },
  { name: "Synth Pad", active: true }
];

const helpCopy = {
  Energy: "How fast or busy the music feels.",
  Mood: "More bright vs more dark.",
  Tension: "Feels like it’s waiting to land vs already landed.",
  Confidence: "High means musical cues agree. Low means cues are mixed."
};

let currentIndex = 0;
let isPlaying = false;
let detailedMode = false;
let advancedMode = false;
let stablePrimary = emotionWindows[0].primary;
let stableCount = 0;
let tooltipsEnabled = true;
let instrumentChangeNotes = null;
let instrumentChangeIndex = null;

const elements = {
  primaryEmotion: document.getElementById("primary-emotion"),
  secondaryEmotions: document.getElementById("secondary-emotions"),
  emotionIcon: document.getElementById("emotion-icon"),
  energyLabel: document.getElementById("energy-label"),
  moodLabel: document.getElementById("mood-label"),
  tensionLabel: document.getElementById("tension-label"),
  confidenceLabel: document.getElementById("confidence-label"),
  energyMeter: document.getElementById("energy-meter"),
  moodMeter: document.getElementById("mood-meter"),
  tensionMeter: document.getElementById("tension-meter"),
  quickReason: document.getElementById("quick-reason"),
  timelineStrip: document.getElementById("timeline-strip"),
  whyPanel: document.getElementById("why-panel"),
  whyList: document.getElementById("why-list"),
  changeList: document.getElementById("change-list"),
  whyEmotion: document.getElementById("why-emotion"),
  confidenceNote: document.getElementById("confidence-note"),
  advancedMetrics: document.getElementById("advanced-metrics"),
  advancedValues: document.getElementById("advanced-values"),
  instrumentList: document.getElementById("instrument-list"),
  differenceView: document.getElementById("difference-view"),
  beforeSummary: document.getElementById("before-summary"),
  afterSummary: document.getElementById("after-summary"),
  differenceReasons: document.getElementById("difference-reasons"),
  wheelList: document.getElementById("wheel-list"),
  wheelMarker: document.getElementById("wheel-marker"),
  wheelChords: document.getElementById("wheel-chords"),
  wheelProgressions: document.getElementById("wheel-progressions"),
  wheelReason: document.getElementById("wheel-reason"),
  tooltip: document.getElementById("tooltip"),
  onboarding: document.getElementById("onboarding"),
  modeHint: document.getElementById("mode-hint"),
  landingPanel: document.getElementById("landing-panel")
};

const confidenceFromValue = (value) => {
  if (value > 0.66) return "High";
  if (value > 0.4) return "Medium";
  return "Low";
};

const energyLabelFromArousal = (arousal) => {
  if (arousal > 0.7) return "High";
  if (arousal > 0.4) return "Medium";
  return "Low";
};

const moodLabelFromValence = (valence) => {
  if (valence > 0.2) return "Bright";
  if (valence < -0.2) return "Dark";
  return "Mixed";
};

const tensionLabelFromValue = (tension) => {
  if (tension > 0.7) return "Rising";
  if (tension > 0.4) return "Unresolved";
  return "Relaxed";
};

const getConfidence = (windowData) => {
  const agreement = 1 - Math.abs(windowData.valence) * 0.3 + windowData.arousal * 0.2 + windowData.tension * 0.2;
  return Math.min(1, Math.max(0, agreement));
};

const mapFeaturesToEmotion = ({ valence, arousal, tension }) => {
  if (tension > 0.7 && arousal > 0.5) return { primary: "Tension", secondary: ["Power", "Urgency"] };
  if (valence > 0.3 && arousal > 0.55) return { primary: "Joyful Activation", secondary: ["Power", "Wonder"] };
  if (valence > 0.3 && arousal < 0.35) return { primary: "Peacefulness", secondary: ["Tenderness", "Wonder"] };
  if (valence < -0.2 && arousal < 0.4) return { primary: "Sadness", secondary: ["Nostalgia", "Tenderness"] };
  if (valence > 0.2 && tension > 0.5) return { primary: "Wonder", secondary: ["Tension", "Power"] };
  if (valence > 0.1 && arousal < 0.5) return { primary: "Tenderness", secondary: ["Peacefulness", "Nostalgia"] };
  return { primary: "Power", secondary: ["Tension", "Joyful Activation"] };
};

const describeWhy = ({ valence, arousal, tension, context }) => {
  const reasons = [];
  reasons.push(arousal > 0.6 ? "Rhythm feels busy and active." : "Rhythm feels steady and calm.");
  reasons.push(valence > 0.2 ? "Harmony feels brighter." : "Harmony feels darker.");
  reasons.push(tension > 0.6 ? "It feels unresolved or waiting to land." : "It feels settled and grounded.");
  if (context) reasons.push(context);
  return reasons;
};

const makeWindowFromFeatures = (features, timeLabel, context) => {
  const emotion = mapFeaturesToEmotion(features);
  return {
    time: timeLabel,
    valence: features.valence,
    arousal: features.arousal,
    tension: features.tension,
    primary: emotion.primary,
    secondary: emotion.secondary,
    reasons: describeWhy({ ...features, context }),
    changes: ["Listening for changes across the next beat."]
  };
};

const buildTimelineFromSequence = (sequence, baseLabel) => {
  emotionWindows = sequence.map((features, index) => {
    const timeLabel = `${baseLabel} ${index + 1}`;
    return makeWindowFromFeatures(features, timeLabel, "New harmonic event detected.");
  });
  currentIndex = 0;
  stablePrimary = emotionWindows[0].primary;
  stableCount = 0;
  renderTimeline();
  renderEmotion(currentIndex);
};

const applyStabilityFilter = (candidatePrimary) => {
  if (candidatePrimary === stablePrimary) {
    stableCount = Math.min(5, stableCount + 1);
    return stablePrimary;
  }
  if (stableCount >= 3) {
    stablePrimary = candidatePrimary;
    stableCount = 0;
    return stablePrimary;
  }
  stableCount += 1;
  return stablePrimary;
};

const iconForEmotion = (emotion) => {
  const mapping = {
    Tension: "⚡",
    Power: "🔥",
    Tenderness: "💛",
    Nostalgia: "🌙",
    Wonder: "✨",
    Transcendence: "🌌",
    Peacefulness: "🕊️",
    "Joyful Activation": "🎉",
    Sadness: "🌧️"
  };
  return mapping[emotion] || "🎵";
};

const setMeter = (element, value) => {
  const clamped = Math.min(1, Math.max(0, value));
  element.style.width = `${Math.round(clamped * 100)}%`;
};

const updatePlaybackPanels = () => {
  const timelinePanel = elements.timelineStrip.parentElement;
  timelinePanel.hidden = !(detailedMode || isPlaying);
};

const renderEmotion = (index) => {
  const windowData = emotionWindows[index];
  const filteredPrimary = applyStabilityFilter(windowData.primary);
  const energy = energyLabelFromArousal(windowData.arousal);
  const mood = moodLabelFromValence(windowData.valence);
  const tension = tensionLabelFromValue(windowData.tension);
  const confidence = confidenceFromValue(getConfidence(windowData));

  elements.primaryEmotion.textContent = filteredPrimary;
  elements.emotionIcon.textContent = iconForEmotion(filteredPrimary);
  elements.secondaryEmotions.innerHTML = windowData.secondary
    .slice(0, 4)
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join("");
  elements.energyLabel.textContent = energy;
  elements.moodLabel.textContent = mood;
  elements.tensionLabel.textContent = tension;
  elements.confidenceLabel.textContent = confidence;
  elements.quickReason.textContent = `Why: ${windowData.reasons[0]}`;
  setMeter(elements.energyMeter, windowData.arousal);
  setMeter(elements.moodMeter, (windowData.valence + 1) / 2);
  setMeter(elements.tensionMeter, windowData.tension);

  elements.whyEmotion.textContent = filteredPrimary;
  const changeNotes = instrumentChangeIndex === index && instrumentChangeNotes
    ? [...windowData.changes, ...instrumentChangeNotes]
    : windowData.changes;
  elements.whyList.innerHTML = windowData.reasons.map((reason) => `<li>${reason}</li>`).join("");
  elements.changeList.innerHTML = changeNotes.map((change) => `<li>${change}</li>`).join("");
  elements.confidenceNote.textContent = `Confidence is ${confidence.toLowerCase()} because multiple musical cues point in the same direction.`;

  elements.advancedValues.textContent = `Valence ${windowData.valence.toFixed(2)}, Arousal ${windowData.arousal.toFixed(2)}, Tension ${windowData.tension.toFixed(2)}`;

  document.querySelectorAll(".timeline-segment").forEach((segment, idx) => {
    segment.classList.toggle("active", idx === index);
  });

  const activeSegment = document.querySelector(`.timeline-segment[data-index="${index}"]`);
  if (activeSegment) {
    activeSegment.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  const axisX = 50 + windowData.valence * 40;
  const axisY = 50 - windowData.arousal * 40;
  elements.wheelMarker.style.left = `${axisX}%`;
  elements.wheelMarker.style.top = `${axisY}%`;
};

const renderTimeline = () => {
  elements.timelineStrip.innerHTML = "";
  emotionWindows.forEach((windowData, index) => {
    const segment = document.createElement("div");
    segment.className = "timeline-segment";
    segment.dataset.index = index;
    segment.textContent = `${windowData.time} • ${windowData.primary}`;
    segment.addEventListener("mouseenter", () => {
      showTooltip(segment, `${windowData.primary}: ${windowData.reasons[0]}`);
    });
    segment.addEventListener("mouseleave", hideTooltip);
    segment.addEventListener("click", () => {
      currentIndex = index;
      renderEmotion(index);
    });
    elements.timelineStrip.appendChild(segment);
  });
};

const renderInstruments = () => {
  elements.instrumentList.innerHTML = "";
  instruments.forEach((instrument, index) => {
    const card = document.createElement("div");
    card.className = "instrument-card";
    const label = document.createElement("span");
    label.textContent = instrument.name;
    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.checked = instrument.active;
    toggle.addEventListener("change", () => handleInstrumentToggle(index));
    card.append(label, toggle);
    elements.instrumentList.appendChild(card);
  });
};

const summarizeEmotion = (windowData) => {
  return `Feels like: ${windowData.primary}. Energy: ${energyLabelFromArousal(windowData.arousal)}. Mood: ${moodLabelFromValence(windowData.valence)}. Tension: ${tensionLabelFromValue(windowData.tension)}.`;
};

const handleInstrumentToggle = (index) => {
  const before = { ...emotionWindows[currentIndex] };
  instruments[index].active = !instruments[index].active;

  const after = { ...emotionWindows[currentIndex] };
  if (instruments[index].name === "Drums" && !instruments[index].active) {
    after.arousal = Math.max(0, after.arousal - 0.25);
    after.primary = "Tension";
    after.secondary = ["Sadness", "Power"];
    after.reasons = [
      "Removing drums lowered rhythmic drive.",
      "Harmonic tension stayed present without percussive relief."
    ];
  }
  if (instruments[index].name === "Bass" && !instruments[index].active) {
    after.tension = Math.min(1, after.tension + 0.15);
    after.reasons = [...after.reasons, "Bass removal reduced grounding, increasing instability."];
  }

  const instrumentReason = instruments[index].active
    ? `${instruments[index].name} returned, restoring balance and energy.`
    : `${instruments[index].name} removal shifted the cue mix immediately.`;
  instrumentChangeNotes = [instrumentReason];
  instrumentChangeIndex = currentIndex;

  elements.beforeSummary.textContent = summarizeEmotion(before);
  elements.afterSummary.textContent = summarizeEmotion(after);
  const beforeConfidence = confidenceFromValue(getConfidence(before));
  const afterConfidence = confidenceFromValue(getConfidence(after));
  elements.differenceReasons.innerHTML = [
    `Energy changed because ${instruments[index].name} affects rhythmic density or grounding.`,
    "Mood shifted because brightness and stability cues changed.",
    `Confidence shifted from ${beforeConfidence} → ${afterConfidence} as cues changed.`
  ].map((reason) => `<li>${reason}</li>`).join("");
  elements.differenceView.hidden = false;

  renderEmotion(currentIndex);
  renderInstruments();
};

const renderWheel = () => {
  elements.wheelList.innerHTML = emotionWheel.map((emotion) => `<li>${emotion}</li>`).join("");
};

const renderWheelSuggestions = (emotion) => {
  const targets = {
    Tension: { valence: -0.2, arousal: 0.6, tension: 0.8 },
    Power: { valence: 0.2, arousal: 0.7, tension: 0.5 },
    Tenderness: { valence: 0.2, arousal: 0.3, tension: 0.3 },
    Nostalgia: { valence: -0.05, arousal: 0.3, tension: 0.4 },
    Wonder: { valence: 0.35, arousal: 0.45, tension: 0.6 },
    Transcendence: { valence: 0.4, arousal: 0.5, tension: 0.45 },
    Peacefulness: { valence: 0.3, arousal: 0.2, tension: 0.2 },
    "Joyful Activation": { valence: 0.35, arousal: 0.75, tension: 0.45 },
    Sadness: { valence: -0.4, arousal: 0.25, tension: 0.4 }
  };
  const target = targets[emotion] || targets.Tension;
  const score = (item) => Math.abs(item.valence - target.valence)
    + Math.abs(item.arousal - target.arousal)
    + Math.abs(item.tension - target.tension);
  const chords = [...chordTemplates].sort((a, b) => score(a) - score(b)).slice(0, 3);
  const progressions = [...progressionTemplates].sort((a, b) => score(a) - score(b)).slice(0, 3);
  elements.wheelChords.innerHTML = chords.map((chord) => `<li>${chord.name}</li>`).join("");
  elements.wheelProgressions.innerHTML = progressions.map((prog) => `<li>${prog.name}</li>`).join("");
  elements.wheelReason.textContent = `Matched by ${emotion.toLowerCase()} target cues: ${chords[0].hint}.`;
};

const showTooltip = (target, text) => {
  if (!tooltipsEnabled) return;
  elements.tooltip.textContent = text;
  elements.tooltip.hidden = false;
  const rect = target.getBoundingClientRect();
  elements.tooltip.style.top = `${rect.bottom + 8}px`;
  elements.tooltip.style.left = `${rect.left}px`;
};

const hideTooltip = () => {
  elements.tooltip.hidden = true;
};

const updateMode = (mode) => {
  document.querySelectorAll(".mode-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });

  document.querySelectorAll(".mode-panel").forEach((panel) => {
    panel.hidden = panel.id !== `mode-${mode}`;
  });

  const modeHints = {
    import: "Upload a song file. Press play. Watch how the feeling changes.",
    notes: "Pick a key, place notes, and we’ll tell you how it feels.",
    chords: "Type chords like Am / F / C / G and we’ll show the feeling.",
    wheel: "Pick a feeling, and we’ll suggest chords/progressions.",
    settings: "Choose how much detail you want to see."
  };
  elements.modeHint.textContent = modeHints[mode];
  elements.landingPanel.hidden = mode !== "import";
};

const handlePlay = () => {
  if (isPlaying) return;
  isPlaying = true;
  updatePlaybackPanels();
  playLoop();
};

const handlePause = () => {
  isPlaying = false;
  updatePlaybackPanels();
};

const playLoop = () => {
  if (!isPlaying) return;
  currentIndex = (currentIndex + 1) % emotionWindows.length;
  renderEmotion(currentIndex);
  setTimeout(playLoop, 1500);
};

const initTooltips = () => {
  document.querySelectorAll("button.help").forEach((button) => {
    button.addEventListener("mouseenter", () => {
      const term = button.dataset.help;
      showTooltip(button, `${term}: ${helpCopy[term]}`);
    });
    button.addEventListener("mouseleave", hideTooltip);
  });
};

const initWhyPanel = () => {
  document.getElementById("why-button").addEventListener("click", () => {
    if (!detailedMode) {
      detailedMode = true;
      document.getElementById("mode-toggle").textContent = "Detailed Mode";
      updatePlaybackPanels();
    }
    elements.whyPanel.hidden = !elements.whyPanel.hidden;
  });
};

const initModeToggle = () => {
  document.getElementById("mode-toggle").addEventListener("click", () => {
    detailedMode = !detailedMode;
    document.getElementById("mode-toggle").textContent = detailedMode ? "Detailed Mode" : "Simple Mode";
    updatePlaybackPanels();
    elements.whyPanel.hidden = !detailedMode;
  });

  document.getElementById("advanced-toggle").addEventListener("click", () => {
    advancedMode = !advancedMode;
    elements.advancedMetrics.hidden = !advancedMode;
    document.getElementById("advanced-toggle").classList.toggle("active", advancedMode);
  });
};

const initSettings = () => {
  const settingAdvanced = document.getElementById("setting-advanced");
  const settingDetailed = document.getElementById("setting-detailed");
  const settingTooltips = document.getElementById("setting-tooltips");

  settingAdvanced.addEventListener("change", () => {
    advancedMode = settingAdvanced.checked;
    elements.advancedMetrics.hidden = !advancedMode;
  });

  settingDetailed.addEventListener("change", () => {
    detailedMode = settingDetailed.checked;
    updatePlaybackPanels();
    elements.whyPanel.hidden = !detailedMode;
  });

  settingTooltips.addEventListener("change", () => {
    tooltipsEnabled = settingTooltips.checked;
    if (!tooltipsEnabled) hideTooltip();
  });
};

const initModeNav = () => {
  document.querySelectorAll(".mode-button").forEach((button) => {
    button.addEventListener("click", () => updateMode(button.dataset.mode));
  });
};

const initLanding = () => {
  document.querySelectorAll(".landing-button").forEach((button) => {
    button.addEventListener("click", () => {
      updateMode(button.dataset.landing);
      if (button.id === "landing-demo") {
        currentIndex = 0;
        renderEmotion(currentIndex);
        handlePlay();
      }
    });
  });
};

const initWheel = () => {
  renderWheel();
  renderWheelSuggestions("Tension");
  elements.wheelList.addEventListener("click", (event) => {
    if (event.target.tagName !== "LI") return;
    const emotion = event.target.textContent;
    renderWheelSuggestions(emotion);
  });
};

const initOnboarding = () => {
  const hasSeen = localStorage.getItem("fanlang-onboarding");
  if (!hasSeen) {
    elements.onboarding.hidden = false;
  }
  document.getElementById("onboarding-close").addEventListener("click", () => {
    elements.onboarding.hidden = true;
    localStorage.setItem("fanlang-onboarding", "true");
  });
  document.getElementById("onboarding-demo").addEventListener("click", () => {
    elements.onboarding.hidden = true;
    localStorage.setItem("fanlang-onboarding", "true");
    updateMode("import");
    handlePlay();
  });
};

const initDemoButtons = () => {
  document.querySelectorAll(".demo").forEach((button) => {
    button.addEventListener("click", () => {
      const demo = button.dataset.demo;
      if (demo === "calm") currentIndex = 2;
      if (demo === "tense") currentIndex = 0;
      if (demo === "power") currentIndex = 3;
      renderEmotion(currentIndex);
      handlePlay();
    });
  });
};

const parseChords = (text) => {
  return text
    .split(/[|,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const featuresFromChord = (chord) => {
  let valence = 0.2;
  let arousal = 0.4;
  let tension = 0.4;
  if (/m(?!aj)/i.test(chord)) valence -= 0.3;
  if (/dim|o/i.test(chord)) tension += 0.3;
  if (/sus/i.test(chord)) tension += 0.15;
  if (/7|9|11|13/.test(chord)) arousal += 0.15;
  if (/\#|b/.test(chord)) tension += 0.1;
  return {
    valence: Math.max(-1, Math.min(1, valence)),
    arousal: Math.max(0, Math.min(1, arousal)),
    tension: Math.max(0, Math.min(1, tension))
  };
};

const initChordAnalyzer = () => {
  const input = document.getElementById("chords-input");
  document.getElementById("analyze-chords").addEventListener("click", () => {
    const chords = parseChords(input.value);
    if (!chords.length) return;
    const sequence = chords.map((chord, index) => {
      const features = featuresFromChord(chord);
      return { ...features, label: `Chord ${index + 1}: ${chord}` };
    });
    emotionWindows = sequence.map((features, index) =>
      makeWindowFromFeatures(features, `Chord ${index + 1}`, `${sequence[index].label} detected.`)
    );
    currentIndex = 0;
    stablePrimary = emotionWindows[0].primary;
    stableCount = 0;
    renderTimeline();
    renderEmotion(currentIndex);
    handlePlay();
  });
};

const initNotesAnalyzer = () => {
  const keyInput = document.getElementById("notes-key");
  const notesInput = document.getElementById("notes-input");
  const stackedToggle = document.getElementById("notes-stacked");
  const harmonyToggle = document.getElementById("notes-harmony-toggle");
  const harmonyInput = document.getElementById("notes-harmony");
  document.getElementById("analyze-notes").addEventListener("click", () => {
    const notes = notesInput.value.trim();
    const noteCount = notes ? notes.split(/\s+/).length : 0;
    let valence = keyInput.value.includes("m") ? -0.2 : 0.25;
    let arousal = Math.min(0.8, noteCount / 10);
    let tension = stackedToggle.checked ? 0.6 : 0.35;
    if (harmonyToggle.checked && harmonyInput.value.trim()) {
      const harmony = featuresFromChord(harmonyInput.value.trim());
      valence += harmony.valence * 0.4;
      arousal = Math.max(arousal, harmony.arousal);
      tension = Math.max(tension, harmony.tension);
    }
    const sequence = [
      { valence, arousal, tension },
      { valence: valence + 0.05, arousal: Math.min(1, arousal + 0.1), tension },
      { valence, arousal: Math.max(0, arousal - 0.1), tension: Math.max(0, tension - 0.1) }
    ];
    buildTimelineFromSequence(sequence, "Beat");
    handlePlay();
  });
};

renderTimeline();
renderEmotion(currentIndex);
renderInstruments();
updateMode("import");
updatePlaybackPanels();
elements.whyPanel.hidden = !detailedMode;
initTooltips();
initWhyPanel();
initModeToggle();
initSettings();
initModeNav();
initLanding();
initWheel();
initOnboarding();
initDemoButtons();
initChordAnalyzer();
initNotesAnalyzer();

window.addEventListener("scroll", hideTooltip);

document.getElementById("play-button").addEventListener("click", handlePlay);
document.getElementById("pause-button").addEventListener("click", handlePause);
