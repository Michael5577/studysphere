import type { AmbientSoundId } from "@/lib/focus/ambient-types";

type Cleanup = () => void;

function getContext(): AudioContext {
  return new AudioContext();
}

function connectToMaster(
  ctx: AudioContext,
  master: GainNode,
  node: AudioNode,
  gain = 1,
): GainNode {
  const gainNode = ctx.createGain();
  gainNode.gain.value = gain;
  node.connect(gainNode);
  gainNode.connect(master);
  return gainNode;
}

function createNoiseBuffer(ctx: AudioContext, type: "white" | "pink" | "brown") {
  const bufferSize = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let lastBrown = 0;
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    let b3 = 0;
    let b4 = 0;
    let b5 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;

      if (type === "white") {
        data[i] = white * 0.45;
        continue;
      }

      if (type === "brown") {
        lastBrown = (lastBrown + 0.02 * white) / 1.02;
        data[i] = lastBrown * 3.5;
        continue;
      }

      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5) * 0.11;
    }
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
}

function startNoiseLayer(
  ctx: AudioContext,
  master: GainNode,
  type: "white" | "pink" | "brown",
  filter: { type: BiquadFilterType; frequency: number; q?: number },
  gain = 0.22,
): Cleanup {
  const source = createNoiseBuffer(ctx, type);
  const biquad = ctx.createBiquadFilter();
  biquad.type = filter.type;
  biquad.frequency.value = filter.frequency;
  biquad.Q.value = filter.q ?? 0.7;
  source.connect(biquad);
  connectToMaster(ctx, master, biquad, gain);
  source.start();

  return () => {
    source.stop();
    source.disconnect();
    biquad.disconnect();
  };
}

function playNoiseBurst(
  ctx: AudioContext,
  master: GainNode,
  options: {
    duration: number;
    filter: { type: BiquadFilterType; frequency: number; q?: number };
    peakGain: number;
    attack?: number;
    type?: "white" | "pink" | "brown";
  },
) {
  const source = createNoiseBuffer(ctx, options.type ?? "white");
  const filter = ctx.createBiquadFilter();
  filter.type = options.filter.type;
  filter.frequency.value = options.filter.frequency;
  filter.Q.value = options.filter.q ?? 1.2;

  const envelope = ctx.createGain();
  envelope.gain.value = 0.0001;
  source.connect(filter);
  filter.connect(envelope);
  envelope.connect(master);

  const now = ctx.currentTime;
  const attack = options.attack ?? 0.01;
  envelope.gain.exponentialRampToValueAtTime(options.peakGain, now + attack);
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + options.duration);

  source.start(now);
  source.stop(now + options.duration + 0.05);
}

function playTonePing(
  ctx: AudioContext,
  master: GainNode,
  frequency: number,
  duration: number,
  peakGain: number,
  type: OscillatorType = "sine",
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.value = 0.0001;
  osc.connect(gain);
  gain.connect(master);

  const now = ctx.currentTime;
  gain.gain.exponentialRampToValueAtTime(peakGain, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function playFrequencySweep(
  ctx: AudioContext,
  master: GainNode,
  startFrequency: number,
  endFrequency: number,
  duration: number,
  peakGain: number,
  type: OscillatorType = "sine",
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  gain.gain.value = 0.0001;
  osc.connect(gain);
  gain.connect(master);

  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(startFrequency, now);
  osc.frequency.exponentialRampToValueAtTime(
    Math.max(20, endFrequency),
    now + duration,
  );
  gain.gain.exponentialRampToValueAtTime(peakGain, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function scheduleRandomEvents(
  callback: () => void,
  minMs: number,
  maxMs: number,
  chance = 1,
): Cleanup {
  let timeoutId = 0;

  function scheduleNext() {
    const delay = minMs + Math.random() * (maxMs - minMs);
    timeoutId = window.setTimeout(() => {
      if (Math.random() <= chance) {
        callback();
      }
      scheduleNext();
    }, delay);
  }

  scheduleNext();

  return () => window.clearTimeout(timeoutId);
}

function startAmplitudeModulatedTones(
  ctx: AudioContext,
  master: GainNode,
  frequencies: number[],
  baseGain: number,
): Cleanup {
  const cleanups: Cleanup[] = [];

  for (const frequency of frequencies) {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = frequency;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = frequency * 1.6;
    filter.Q.value = 6;

    const amp = ctx.createGain();
    amp.gain.value = baseGain;

    osc.connect(filter);
    filter.connect(amp);
    connectToMaster(ctx, master, amp, 1);
    osc.start();

    const interval = window.setInterval(() => {
      const now = ctx.currentTime;
      amp.gain.setTargetAtTime(
        baseGain * (0.2 + Math.random() * 1.4),
        now,
        0.04 + Math.random() * 0.08,
      );
    }, 120 + Math.random() * 220);

    cleanups.push(() => {
      window.clearInterval(interval);
      osc.stop();
      osc.disconnect();
      filter.disconnect();
      amp.disconnect();
    });
  }

  return () => cleanups.forEach((cleanup) => cleanup());
}

function startWindTone(
  ctx: AudioContext,
  master: GainNode,
  baseFrequency: number,
  gain: number,
): Cleanup {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = baseFrequency;

  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.07;

  const lfoGain = ctx.createGain();
  lfoGain.gain.value = baseFrequency * 0.15;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);

  const amp = ctx.createGain();
  amp.gain.value = gain;

  const lfoAmp = ctx.createOscillator();
  lfoAmp.type = "sine";
  lfoAmp.frequency.value = 0.05;
  const lfoAmpGain = ctx.createGain();
  lfoAmpGain.gain.value = gain * 0.45;
  lfoAmp.connect(lfoAmpGain);
  lfoAmpGain.connect(amp.gain);

  osc.connect(amp);
  connectToMaster(ctx, master, amp, 1);

  osc.start();
  lfo.start();
  lfoAmp.start();

  return () => {
    osc.stop();
    lfo.stop();
    lfoAmp.stop();
    osc.disconnect();
    lfo.disconnect();
    lfoGain.disconnect();
    lfoAmp.disconnect();
    lfoAmpGain.disconnect();
    amp.disconnect();
  };
}

/* ─── Lo-fi: music-first, almost no noise ───────────────────────── */

function startLofi(ctx: AudioContext, master: GainNode): Cleanup {
  const cleanups: Cleanup[] = [];

  const bass = ctx.createOscillator();
  bass.type = "sine";
  bass.frequency.value = 55;
  const bassGain = ctx.createGain();
  bassGain.gain.value = 0.08;
  bass.connect(bassGain);
  connectToMaster(ctx, master, bassGain, 1);
  bass.start();

  const chords = [
    [220, 261.63, 329.63],
    [196, 233.08, 293.66],
    [174.61, 207.65, 261.63],
    [246.94, 293.66, 369.99],
  ];

  let chordIndex = 0;

  function playChord(frequencies: number[]) {
    const chordGain = ctx.createGain();
    chordGain.gain.value = 0;
    chordGain.connect(master);

    const oscillators: OscillatorNode[] = [];

    for (const frequency of frequencies) {
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = frequency;

      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.03;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 900;

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(chordGain);
      osc.start();
      oscillators.push(osc);
    }

    const now = ctx.currentTime;
    chordGain.gain.setValueAtTime(0, now);
    chordGain.gain.linearRampToValueAtTime(0.75, now + 1.5);
    chordGain.gain.linearRampToValueAtTime(0.45, now + 8);
    chordGain.gain.linearRampToValueAtTime(0, now + 11);

    cleanups.push(() => {
      oscillators.forEach((osc) => {
        osc.stop();
        osc.disconnect();
      });
      chordGain.disconnect();
    });
  }

  playChord(chords[0]!);
  const chordInterval = window.setInterval(() => {
    chordIndex = (chordIndex + 1) % chords.length;
    playChord(chords[chordIndex]!);
  }, 11_000);

  let beatStep = 0;
  const beatInterval = window.setInterval(() => {
    beatStep += 1;

    if (beatStep % 2 === 1) {
      playTonePing(ctx, master, 52, 0.12, 0.12, "sine");
    }

    playTonePing(ctx, master, 9000, 0.025, 0.015, "square");
  }, 480);

  const crackle = scheduleRandomEvents(
    () => {
      playNoiseBurst(ctx, master, {
        duration: 0.015,
        filter: { type: "highpass", frequency: 3500, q: 1 },
        peakGain: 0.008,
        type: "white",
      });
    },
    1200,
    5000,
    0.35,
  );

  return () => {
    window.clearInterval(chordInterval);
    window.clearInterval(beatInterval);
    bass.stop();
    bass.disconnect();
    bassGain.disconnect();
    crackle();
    cleanups.forEach((cleanup) => cleanup());
  };
}

/* ─── Rain: droplet pings dominate, not static hiss ─────────────── */

function playRainDrop(ctx: AudioContext, master: GainNode) {
  const start = 1400 + Math.random() * 1800;
  const end = 280 + Math.random() * 220;
  playFrequencySweep(ctx, master, start, end, 0.04 + Math.random() * 0.03, 0.08);

  playNoiseBurst(ctx, master, {
    duration: 0.03,
    filter: { type: "bandpass", frequency: 2600 + Math.random() * 800, q: 5 },
    peakGain: 0.02,
    type: "white",
  });
}

function startRain(ctx: AudioContext, master: GainNode): Cleanup {
  const wash = startNoiseLayer(
    ctx,
    master,
    "pink",
    { type: "bandpass", frequency: 700, q: 0.2 },
    0.035,
  );

  const droplets = scheduleRandomEvents(
    () => playRainDrop(ctx, master),
    60,
    280,
    0.95,
  );

  const heavy = scheduleRandomEvents(
    () => {
      for (let i = 0; i < 4 + Math.floor(Math.random() * 4); i++) {
        window.setTimeout(() => playRainDrop(ctx, master), i * (30 + Math.random() * 40));
      }
    },
    2500,
    6000,
    0.55,
  );

  const thunder = scheduleRandomEvents(
    () => {
      playNoiseBurst(ctx, master, {
        duration: 3 + Math.random() * 2,
        filter: { type: "lowpass", frequency: 70, q: 0.2 },
        peakGain: 0.06,
        attack: 0.5,
        type: "brown",
      });
    },
    30_000,
    60_000,
    0.3,
  );

  return () => {
    wash();
    droplets();
    heavy();
    thunder();
  };
}

/* ─── Library: quiet room + sparse paper events ─────────────────── */

function startLibrary(ctx: AudioContext, master: GainNode): Cleanup {
  const room = startNoiseLayer(
    ctx,
    master,
    "brown",
    { type: "lowpass", frequency: 140, q: 0.4 },
    0.018,
  );

  const pageTurns = scheduleRandomEvents(
    () => {
      playNoiseBurst(ctx, master, {
        duration: 0.28 + Math.random() * 0.18,
        filter: { type: "bandpass", frequency: 520 + Math.random() * 180, q: 1.4 },
        peakGain: 0.045,
        attack: 0.03,
        type: "pink",
      });
    },
    3500,
    9000,
    0.75,
  );

  const footsteps = scheduleRandomEvents(
    () => {
      for (let step = 0; step < 2 + Math.floor(Math.random() * 3); step++) {
        window.setTimeout(() => {
          playTonePing(ctx, master, 90 + Math.random() * 25, 0.06, 0.02, "sine");
        }, step * 380);
      }
    },
    14_000,
    28_000,
    0.45,
  );

  const clock = scheduleRandomEvents(
    () => playTonePing(ctx, master, 880, 0.06, 0.008, "sine"),
    20_000,
    40_000,
    0.25,
  );

  return () => {
    room();
    pageTurns();
    footsteps();
    clock();
  };
}

/* ─── Café: tonal voices + clinks, not rain hiss ─────────────────── */

function startCafe(ctx: AudioContext, master: GainNode): Cleanup {
  const murmur = startAmplitudeModulatedTones(
    ctx,
    master,
    [188, 204, 226, 248, 312, 336],
    0.012,
  );

  const clinks = scheduleRandomEvents(
    () => {
      playTonePing(
        ctx,
        master,
        1600 + Math.random() * 1400,
        0.12 + Math.random() * 0.08,
        0.02,
        "triangle",
      );
    },
    1800,
    5500,
    0.8,
  );

  const steam = scheduleRandomEvents(
    () => {
      playNoiseBurst(ctx, master, {
        duration: 1.5 + Math.random(),
        filter: { type: "highpass", frequency: 5200, q: 0.5 },
        peakGain: 0.012,
        attack: 0.2,
        type: "white",
      });
    },
    12_000,
    25_000,
    0.4,
  );

  return () => {
    murmur();
    clinks();
    steam();
  };
}

/* ─── Forest: wind tones + birds + crickets ─────────────────────── */

function startForest(ctx: AudioContext, master: GainNode): Cleanup {
  const windLow = startWindTone(ctx, master, 72, 0.05);
  const windMid = startWindTone(ctx, master, 118, 0.025);

  const birds = scheduleRandomEvents(
    () => {
      const base = 1800 + Math.random() * 1200;
      const chirps = 2 + Math.floor(Math.random() * 4);

      for (let i = 0; i < chirps; i++) {
        window.setTimeout(() => {
          playFrequencySweep(
            ctx,
            master,
            base + Math.random() * 300,
            base - 400 - Math.random() * 300,
            0.07 + Math.random() * 0.05,
            0.035,
          );
        }, i * (70 + Math.random() * 50));
      }
    },
    2500,
    7000,
    0.85,
  );

  const crickets = scheduleRandomEvents(
    () => {
      for (let i = 0; i < 5; i++) {
        window.setTimeout(() => {
          playTonePing(ctx, master, 4500 + Math.random() * 600, 0.035, 0.006, "square");
        }, i * 80);
      }
    },
    8000,
    16_000,
    0.55,
  );

  return () => {
    windLow();
    windMid();
    birds();
    crickets();
  };
}

/* ─── Brown / white: opposite ends of the spectrum ───────────────── */

function startBrown(ctx: AudioContext, master: GainNode): Cleanup {
  return startNoiseLayer(
    ctx,
    master,
    "brown",
    { type: "lowpass", frequency: 160, q: 0.3 },
    0.35,
  );
}

function startWhite(ctx: AudioContext, master: GainNode): Cleanup {
  return startNoiseLayer(
    ctx,
    master,
    "white",
    { type: "highpass", frequency: 4200, q: 0.35 },
    0.22,
  );
}

export class FocusAmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private cleanup: Cleanup | null = null;
  private activeId: AmbientSoundId = "silence";
  private volume = 0.42;
  private muted = false;

  getActiveId() {
    return this.activeId;
  }

  getVolume() {
    return this.volume;
  }

  isMuted() {
    return this.muted;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    this.applyOutputGain();
  }

  setVolume(value: number) {
    this.volume = Math.min(1, Math.max(0, value));
    this.applyOutputGain();
  }

  private applyOutputGain() {
    if (!this.master) {
      return;
    }

    const output = this.muted || this.volume <= 0 ? 0 : this.volume;

    this.master.gain.setTargetAtTime(
      output,
      this.master.context.currentTime,
      0.06,
    );
  }

  private async ensureContext() {
    if (!this.ctx) {
      this.ctx = getContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : this.volume;
      this.master.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
  }

  async start(id: AmbientSoundId) {
    this.cleanup?.();
    this.cleanup = null;

    this.activeId = id;

    if (id === "silence" || this.muted || this.volume <= 0) {
      return;
    }

    await this.ensureContext();

    if (!this.ctx || !this.master) {
      return;
    }

    this.applyOutputGain();

    const ctx = this.ctx;
    const master = this.master;

    switch (id) {
      case "lofi":
        this.cleanup = startLofi(ctx, master);
        break;
      case "rain":
        this.cleanup = startRain(ctx, master);
        break;
      case "library":
        this.cleanup = startLibrary(ctx, master);
        break;
      case "cafe":
        this.cleanup = startCafe(ctx, master);
        break;
      case "forest":
        this.cleanup = startForest(ctx, master);
        break;
      case "brown":
        this.cleanup = startBrown(ctx, master);
        break;
      case "white":
        this.cleanup = startWhite(ctx, master);
        break;
      default:
        break;
    }
  }

  async stop() {
    this.cleanup?.();
    this.cleanup = null;
  }

  async pause() {
    await this.stop();
  }

  async dispose() {
    await this.stop();

    if (this.master) {
      this.master.disconnect();
      this.master = null;
    }

    if (this.ctx) {
      await this.ctx.close();
      this.ctx = null;
    }
  }
}

let sharedEngine: FocusAmbientEngine | null = null;

export function getFocusAmbientEngine() {
  if (!sharedEngine) {
    sharedEngine = new FocusAmbientEngine();
  }

  return sharedEngine;
}
