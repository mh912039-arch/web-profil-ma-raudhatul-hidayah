/**
 * Utility untuk memutar nada dering notifikasi merdu menggunakan Web Audio API.
 * Murni client-side, zero bundle overhead, tanpa unduh file eksternal (anti gagal/CORS/offline),
 * dan langsung memutar suara chime berkualitas tinggi saat aksi admin atau notifikasi masuk.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function playNotificationSound(type: 'success' | 'alert' | 'pop' = 'success'): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'success') {
      // Melodic three-tone chime (E5 -> G#5 -> B5, selaras dengan nada notifikasi smartphone)
      const notes = [
        { freq: 659.25, time: 0, duration: 0.12 },     // E5
        { freq: 830.61, time: 0.08, duration: 0.18 },   // G#5
        { freq: 987.77, time: 0.16, duration: 0.35 },   // B5
      ];

      notes.forEach(({ freq, time, duration }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        // Lembutkan amplifikasi (envelope)
        gain.gain.setValueAtTime(0.0001, now + time);
        gain.gain.exponentialRampToValueAtTime(0.22, now + time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + time + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + duration);
      });
    } else if (type === 'alert') {
      // Nada peringatan lembut (A4 -> F4)
      const notes = [
        { freq: 440.0, time: 0, duration: 0.15 },
        { freq: 349.23, time: 0.12, duration: 0.25 },
      ];

      notes.forEach(({ freq, time, duration }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.0001, now + time);
        gain.gain.exponentialRampToValueAtTime(0.25, now + time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + time + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + duration);
      });
    } else {
      // Pop feedback pendek
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch {
    // Abaikan jika browser memblokir audio autoplay sebelum interaksi
  }
}
