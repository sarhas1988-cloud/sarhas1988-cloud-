class SoundManager {
  private ambientAudio: HTMLAudioElement | null = null
  private pageTurnAudio: HTMLAudioElement | null = null
  private _ambientPlaying = false
  private _autoStarted = false

  get ambientPlaying() { return this._ambientPlaying }

  constructor() {
    // Auto-start ambient on first user interaction
    const startOnInteraction = () => {
      if (this._autoStarted) return
      this._autoStarted = true
      this.startAmbient()
      document.removeEventListener('click', startOnInteraction)
      document.removeEventListener('scroll', startOnInteraction)
      document.removeEventListener('keydown', startOnInteraction)
      document.removeEventListener('touchstart', startOnInteraction)
    }
    document.addEventListener('click', startOnInteraction, { once: false })
    document.addEventListener('scroll', startOnInteraction, { once: false, passive: true })
    document.addEventListener('keydown', startOnInteraction, { once: false })
    document.addEventListener('touchstart', startOnInteraction, { once: false })
  }

  // ─── AMBIENT HORROR ───
  startAmbient() {
    if (this._ambientPlaying) return
    this._ambientPlaying = true

    if (!this.ambientAudio) {
      this.ambientAudio = new Audio('/sounds/ambient-horror.mp3')
      this.ambientAudio.loop = true
    }
    this.ambientAudio.currentTime = 0
    this.ambientAudio.volume = 0
    this.ambientAudio.play().catch(() => { this._ambientPlaying = false })

    // Fade in
    let vol = 0
    const fade = setInterval(() => {
      vol += 0.02
      if (vol >= 0.5) { vol = 0.5; clearInterval(fade) }
      if (this.ambientAudio) this.ambientAudio.volume = vol
    }, 60)
  }

  stopAmbient() {
    if (!this._ambientPlaying || !this.ambientAudio) return
    this._ambientPlaying = false
    const audio = this.ambientAudio
    let vol = audio.volume
    const fade = setInterval(() => {
      vol -= 0.03
      if (vol <= 0) { vol = 0; clearInterval(fade); audio.pause() }
      audio.volume = vol
    }, 50)
  }

  toggleAmbient() {
    if (this._ambientPlaying) this.stopAmbient()
    else this.startAmbient()
    return this._ambientPlaying
  }

  // ─── PAGE TURN — one shot, no repeat ───
  playPageTurn() {
    if (!this.pageTurnAudio) {
      this.pageTurnAudio = new Audio('/sounds/page-turn.mp3')
      this.pageTurnAudio.loop = false
    }
    this.pageTurnAudio.currentTime = 0
    this.pageTurnAudio.volume = 0.85
    this.pageTurnAudio.play().catch(() => {})
  }
}

export const soundManager = typeof window !== 'undefined' ? new SoundManager() : null
