
class AudioService {
  private context: AudioContext | null = null;

  private async initContext() {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  /**
   * Play a beep sound.
   * @param frequency - The pitch of the sound. Default 1600Hz for a sharper/higher pitch.
   * @param duration - How long the sound lasts.
   */
  public async playBeep(frequency: number = 1600, duration: number = 0.15) {
    await this.initContext();
    if (!this.context) return;

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    // 'sine' is clean, but 'triangle' can be perceived as louder.
    // Keeping sine at 1.0 gain and 1600Hz is very effective.
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
    
    // Maximized volume to 1.0 (full amplitude)
    gainNode.gain.setValueAtTime(1.0, this.context.currentTime);
    
    // Exponential decay to prevent clicking sounds
    gainNode.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.start();
    oscillator.stop(this.context.currentTime + duration);
  }
}

export const audioService = new AudioService();
