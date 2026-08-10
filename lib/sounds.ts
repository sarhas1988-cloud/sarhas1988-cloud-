class SoundManager {
  private ctx: AudioContext | null = null
  private ambientGain: GainNode | null = null
  private ambientNodes: (OscillatorNode | AudioBufferSourceNode)[] = []
  private _ambientPlaying = false
  private _enabled = false

  get enabled() { return this._enabled }
  get ambientPlaying() { return this._ambientPlaying }

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext()
    if (this.ctx.state === 'suspended') this.ctx.resume()
    return this.ctx
  }

  // ─── AMBIENT: Dark horror atmosphere ───
  startAmbient() {
    if (this._ambientPlaying) return
    const ctx = this.getCtx()
    this._enabled = true
    this._ambientPlaying = true

    this.ambientGain = ctx.createGain()
    this.ambientGain.gain.setValueAtTime(0, ctx.currentTime)
    this.ambientGain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 3)
    this.ambientGain.connect(ctx.destination)

    // Deep sub-bass rumble
    const sub = ctx.createOscillator()
    sub.type = 'sine'
    sub.frequency.setValueAtTime(35, ctx.currentTime)
    const subGain = ctx.createGain()
    subGain.gain.setValueAtTime(0.5, ctx.currentTime)
    sub.connect(subGain)
    subGain.connect(this.ambientGain)
    sub.start()
    this.ambientNodes.push(sub)

    // Dissonant tritone drone (the devil's interval)
    const droneFreqs = [73.4, 103.8] // D2 and Ab2 — tritone
    droneFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)

      // Slow creepy pitch wobble
      const lfo = ctx.createOscillator()
      lfo.frequency.setValueAtTime(0.08 + i * 0.03, ctx.currentTime)
      const lfoGain = ctx.createGain()
      lfoGain.gain.setValueAtTime(3, ctx.currentTime)
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)
      lfo.start()

      // Tremolo for unease
      const tremolo = ctx.createOscillator()
      tremolo.frequency.setValueAtTime(0.3 + i * 0.15, ctx.currentTime)
      const tremoloGain = ctx.createGain()
      tremoloGain.gain.setValueAtTime(0.15, ctx.currentTime)
      tremolo.connect(tremoloGain)

      const oscGain = ctx.createGain()
      oscGain.gain.setValueAtTime(0.2, ctx.currentTime)
      tremoloGain.connect(oscGain.gain)

      // Dark lowpass filter
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(400, ctx.currentTime)
      filter.Q.setValueAtTime(2, ctx.currentTime)

      osc.connect(filter)
      filter.connect(oscGain)
      oscGain.connect(this.ambientGain!)
      osc.start()
      tremolo.start()
      this.ambientNodes.push(osc)
    })

    // Dark wind noise
    const windBuf = ctx.createBuffer(1, ctx.sampleRate * 6, ctx.sampleRate)
    const windData = windBuf.getChannelData(0)
    for (let i = 0; i < windData.length; i++) {
      windData[i] = (Math.random() * 2 - 1)
    }
    const wind = ctx.createBufferSource()
    wind.buffer = windBuf
    wind.loop = true

    const windFilter = ctx.createBiquadFilter()
    windFilter.type = 'bandpass'
    windFilter.frequency.setValueAtTime(300, ctx.currentTime)
    windFilter.Q.setValueAtTime(0.5, ctx.currentTime)

    // Slow filter sweep for movement
    const windLfo = ctx.createOscillator()
    windLfo.frequency.setValueAtTime(0.04, ctx.currentTime)
    const windLfoGain = ctx.createGain()
    windLfoGain.gain.setValueAtTime(200, ctx.currentTime)
    windLfo.connect(windLfoGain)
    windLfoGain.connect(windFilter.frequency)
    windLfo.start()

    const windGain = ctx.createGain()
    windGain.gain.setValueAtTime(0.2, ctx.currentTime)

    wind.connect(windFilter)
    windFilter.connect(windGain)
    windGain.connect(this.ambientGain!)
    wind.start()
    this.ambientNodes.push(wind)
  }

  stopAmbient() {
    if (!this._ambientPlaying || !this.ctx || !this.ambientGain) return
    this._ambientPlaying = false
    this.ambientGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2)
    setTimeout(() => {
      this.ambientNodes.forEach(n => { try { n.stop() } catch {} })
      this.ambientNodes = []
    }, 2200)
  }

  toggleAmbient() {
    if (this._ambientPlaying) this.stopAmbient()
    else this.startAmbient()
    return this._ambientPlaying
  }

  // ─── PAGE TURN: Layered paper rustle ───
  playPageTurn() {
    const ctx = this.getCtx()

    // 3 overlapping noise bursts = realistic paper sound
    const layers = [
      { delay: 0,    freq: 2500, q: 0.6, gain: 0.5,  dur: 0.25 },
      { delay: 0.04, freq: 4000, q: 0.8, gain: 0.35, dur: 0.20 },
      { delay: 0.10, freq: 1800, q: 0.5, gain: 0.4,  dur: 0.30 },
    ]

    layers.forEach((l) => {
      const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * l.dur), ctx.sampleRate)
      const data = buf.getChannelData(0)
      // Brownian noise (smoother than white noise = more paper-like)
      let last = 0
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1
        last = (last + (0.02 * white)) / 1.02
        data[i] = last * 35 // amplify
      }

      const src = ctx.createBufferSource()
      src.buffer = buf

      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(l.freq, ctx.currentTime)
      filter.Q.setValueAtTime(l.q, ctx.currentTime)

      const gain = ctx.createGain()
      const t = ctx.currentTime + l.delay
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(l.gain, t + 0.015)
      gain.gain.setValueAtTime(l.gain, t + l.dur * 0.3)
      gain.gain.exponentialRampToValueAtTime(0.001, t + l.dur)

      src.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      src.start(t)
      src.stop(t + l.dur)
    })
  }

  // ─── HOVER: Subtle dark tone ───
  playHover() {
    const ctx = this.getCtx()
    const dur = 0.18

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(600, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + dur)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + dur)
  }
}

export const soundManager = typeof window !== 'undefined' ? new SoundManager() : null
