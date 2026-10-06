/**
 * Romantic Wedding Audio Engine
 * Uses HTML5 Audio API to play local MP4 audio file
 * from 0:00 to 1:30 (90 seconds).
 */

class RomanticAudioEngine {
  constructor() {
    this.isPlaying = false;
    this.initialized = false;

    // Create hidden audio element with standard mobile-friendly attributes
    this.audio = document.createElement("audio");
    this.audio.setAttribute("playsinline", "");
    this.audio.setAttribute("webkit-playsinline", "");
    this.audio.preload = "auto";
    this.audio.loop = true;
    this.audio.volume = 0.6;
    this.audio.style.display = "none";

    // Set source - using clean filename with fallback type
    const source = document.createElement("source");
    source.src = "wedding_music.mp3";
    source.type = "audio/mpeg";
    this.audio.appendChild(source);

    // Fallback source pointing to original file if needed
    const fallbackSource = document.createElement("source");
    fallbackSource.src = encodeURI("WhatsApp Audio 2026-10-05 at 9.49.08 PM.mpeg");
    fallbackSource.type = "audio/mpeg";
    this.audio.appendChild(fallbackSource);

    document.body.appendChild(this.audio);

    // Add listeners to sync state accurately on mobile
    this.audio.addEventListener("play", () => {
      this.isPlaying = true;
      this.updateUI();
    });

    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
      this.updateUI();
    });

    this.audio.addEventListener("ended", () => {
      this.isPlaying = false;
      this.updateUI();
    });

    // Listen for the first touch/click across the document to unlock audio context if autoplay was blocked
    const unlockAudio = () => {
      if (!this.initialized) {
        this.audio.load();
        this.initialized = true;
      }
    };
    window.addEventListener("touchstart", unlockAudio, { once: true, passive: true });
    window.addEventListener("click", unlockAudio, { once: true, passive: true });
  }

  play() {
    this.initialized = true;
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.isPlaying = true;
        this.updateUI();
      }).catch((err) => {
        console.warn("Audio playback delayed or blocked:", err);
        this.isPlaying = false;
        this.updateUI();
      });
    }
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updateUI();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  updateUI() {
    const btn = document.getElementById("music-toggle-btn");
    const waves = document.getElementById("music-waves");
    const statusText = document.getElementById("music-status");
    if (!btn) return;

    if (this.isPlaying) {
      btn.classList.add("playing");
      btn.setAttribute("aria-label", "Pause romantic background music");
      if (statusText) statusText.textContent = "Music Playing";
      if (waves) waves.classList.remove("paused");
    } else {
      btn.classList.remove("playing");
      btn.setAttribute("aria-label", "Play romantic background music");
      if (statusText) statusText.textContent = "Play Music";
      if (waves) waves.classList.add("paused");
    }
  }
}

window.romanticAudio = new RomanticAudioEngine();


