// Global sound manager — Web Audio API, no external files needed
class SoundManager {
  private ctx: AudioContext | null = null
  private ambientGain: GainNode | null = null
  private ambientOscs: OscillatorNode[] = []
  private noiseNode: AudioBufferSourceNode | null = null
  private _ambientPlaying = false
  private _enabled = false

  get enabled() { return this._enabled }
  get ambientPlaying() { return this._ambientPlaying }

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext()
    if (this.ctx.state === 'suspended') this.ctx.resume()
    return this.ctx
  }

  // ─── Ambient dark drone ───
  startAmbient() {
    if (this._ambientPlaying) return
    const ctx = this.getCtx()
    this._enabled = true
    this._ambientPlaying = true

    this.ambientGain = ctx.createGain()
    this.ambientGain.gain.setValueAtTime(0, ctx.currentTime)
    this.ambientGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2) // Fade in
    this.ambientGain.connect(ctx.destination)

    // Dark drone: layered low sine waves
    const freqs = [55, 58, 82, 110] // Low A, slightly detuned
    this.ambientOscs = freqs.map((freq, i) => {
      const osc = ctx.createOscillator()
      const oscGain = ctx.createGain()
      osc.type = i < 2 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      // Slow LFO on frequency for eerie movement
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.frequency.setValueAtTime(0.05 + i * 0.02, ctx.currentTime)
      lfoGain.gain.setValueAtTime(1.5, ctx.currentTime)
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)
      lfo.start()
      
      oscGain.gain.setValueAtTime(i < 2 ? 0.4 : 0.15, ctx.currentTime)
      osc.connect(oscGain)
      oscGain.connect(this.ambientGain!)
      osc.start()
      return osc
    })

    // Filtered noise for atmosphere (wind-like)
    const bufferSize = ctx.sampleRate * 4
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3
    
    this.noiseNode = ctx.createBufferSource()
    this.noiseNode.buffer = buffer
    this.noiseNode.loop = true
    
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'lowpass'
    noiseFilter.frequency.setValueAtTime(200, ctx.currentTime)
    
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.06, ctx.currentTime)
    
    this.noiseNode.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(this.ambientGain!)
    this.noiseNode.start()
  }

  stopAmbient() {
    if (!this._ambientPlaying || !this.ctx || !this.ambientGain) return
    const ctx = this.ctx
    this._ambientPlaying = false

    // Fade out
    this.ambientGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5)
    
    setTimeout(() => {
      this.ambientOscs.forEach(o => { try { o.stop() } catch {} })
      this.ambientOscs = []
      try { this.noiseNode?.stop() } catch {}
      this.noiseNode = null
    }, 1600)
  }

  toggleAmbient() {
    if (this._ambientPlaying) this.stopAmbient()
    else this.startAmbient()
    return this._ambientPlaying
  }

  // ─── Page turn sound ───
  playPageTurn() {
    const ctx = this.getCtx()
    const duration = 0.35

    // Filtered noise burst = paper rustling
    const bufferSize = Math.ceil(ctx.sampleRate * duration)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1)
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    // Bandpass filter for paper-like quality
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(3000, ctx.currentTime)
    filter.Q.setValueAtTime(0.8, ctx.currentTime)

    // Envelope: quick attack, medium decay
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start()
    source.stop(ctx.currentTime + duration)
  }

  // ─── Hover whisper sound ───
  playHover() {
    const ctx = this.getCtx()
    const duration = 0.15

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + duration)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  }
}

// Singleton
export const soundManager = typeof window !== 'undefined' ? new SoundManager() : null
