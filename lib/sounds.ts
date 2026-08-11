class SoundManager {
  private ctx: AudioContext | null = null
  private ambientAudio: HTMLAudioElement | null = null
  private pageTurnAudio: HTMLAudioElement | null = null
  private _ambientPlaying = false

  get ambientPlaying() { return this._ambientPlaying }

  private init() {
    // Pre-load audio files
    if (!this.pageTurnAudio) {
      this.pageTurnAudio = new Audio('/sounds/page-turn.mp3')
      this.pageTurnAudio.volume = 0.8
    }
    if (!this.ambientAudio) {
      this.ambientAudio = new Audio('/sounds/ambient-horror.mp3')
      this.ambientAudio.loop = true
      this.ambientAudio.volume = 0.4
    }
  }

  // ─── AMBIENT HORROR ───
  startAmbient() {
    if (this._ambientPlaying) return
    this.init()
    this._ambientPlaying = true
    if (this.ambientAudio) {
      this.ambientAudio.currentTime = 0
      this.ambientAudio.volume = 0
      this.ambientAudio.play().catch(() => {})
      // Fade in
      let vol = 0
      const fade = setInterval(() => {
        vol += 0.02
        if (vol >= 0.4) { vol = 0.4; clearInterval(fade) }
        if (this.ambientAudio) this.ambientAudio.volume = vol
      }, 50)
    }
  }

  stopAmbient() {
    if (!this._ambientPlaying || !this.ambientAudio) return
    this._ambientPlaying = false
    // Fade out
    const audio = this.ambientAudio
    let vol = audio.volume
    const fade = setInterval(() => {
      vol -= 0.02
      if (vol <= 0) { vol = 0; clearInterval(fade); audio.pause() }
      audio.volume = vol
    }, 50)
  }

  toggleAmbient() {
    if (this._ambientPlaying) this.stopAmbient()
    else this.startAmbient()
    return this._ambientPlaying
  }

  // ─── PAGE TURN ───
  playPageTurn() {
    this.init()
    if (this.pageTurnAudio) {
      this.pageTurnAudio.currentTime = 0
      this.pageTurnAudio.volume = 0.8
      this.pageTurnAudio.play().catch(() => {})
    }
  }

  // ─── HOVER ───
  playHover() {
    if (!this.ctx) this.ctx = new AudioContext()
    if (this.ctx.state === 'suspended') this.ctx.resume()
    const ctx = this.ctx
    const dur = 0.15
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(500, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + dur)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + dur)
  }
}

export const soundManager = typeof window !== 'undefined' ? new SoundManager() : null
