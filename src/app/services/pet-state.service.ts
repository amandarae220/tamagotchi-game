import { Injectable } from '@angular/core';

/* ✅ shared types */
export type Theme = 'tan' | 'mint' | 'lavender' | 'peach' | 'sky';
export type PetType = 'duck' | 'dog' | 'penguin';

export type PetVisualState =
  | 'idle'
  | 'eating'
  | 'sleeping'
  | 'bathing'
  | 'happy'
  | 'sad';

export type PetEvent =
  | 'FEED'
  | 'PLAY'
  | 'SLEEP'
  | 'BATHE'
  | 'CUDDLE'
  | 'TIME_TICK';

export interface PetNeeds {
  fullness: number;
  energy: number;
  joy: number;
  clean: number;
}

@Injectable({
  providedIn: 'root'
})
export class PetStateService {

  petName: string = '';
  petType: PetType = 'duck';
  theme: Theme = 'tan';

  private baseState: 'happy' | 'idle' | 'sad' = 'happy';
  private activeState: 'eating' | 'sleeping' | 'bathing' | null = null; 

  private stateTimeout: any;

  needs: PetNeeds = {
    fullness: 100,
    energy: 100,
    joy: 100,
    clean: 100
  };

  get currentState(): PetVisualState {
  return this.activeState ?? this.baseState;
}

private triggerTemporaryState(
  state: 'eating' | 'sleeping' | 'bathing',
  duration: number
) {
  // ✅ clear ONLY here (not in transition)
  clearTimeout(this.stateTimeout);

  this.activeState = state;

  this.stateTimeout = setTimeout(() => {
    this.activeState = null;
  }, duration);
}

  /* ---------------- RESET ---------------- */

  reset() {
    this.needs = {
      fullness: 100,
      energy: 100,
      joy: 100,
      clean: 100
    };

    this.baseState = 'happy';
    this.activeState = null;

    this.save();
  }

  /* ---------------- STATE MACHINE ---------------- */

transition(event: PetEvent) {

  switch (event) {

    case 'FEED':
      this.needs.fullness = this.clamp(this.needs.fullness + 15);
      this.triggerTemporaryState('eating', 1200);
      this.baseState = 'happy';
      break;

    case 'PLAY':
      this.needs.joy = this.clamp(this.needs.joy + 15);
      this.needs.energy = this.clamp(this.needs.energy - 5);
      this.baseState = 'happy';
      break;

    case 'SLEEP':
      this.needs.energy = this.clamp(this.needs.energy + 20);
      this.triggerTemporaryState('sleeping', 2000);
      break;

    case 'BATHE':
      this.needs.clean = this.clamp(this.needs.clean + 20);
      this.triggerTemporaryState('bathing', 1200);
      break;

    case 'CUDDLE':
      this.needs.joy = this.clamp(this.needs.joy + 10);
      this.baseState = 'happy';
      break;

    case 'TIME_TICK':
      this.decayNeeds();
      this.applyMoodState();
      break;
  }

  this.save();
}

  /* ---------------- NEEDS ---------------- */

  private decayNeeds() {
    this.needs.fullness = this.clamp(this.needs.fullness - 2);
    this.needs.energy = this.clamp(this.needs.energy - 1);
    this.needs.joy = this.clamp(this.needs.joy - 1);
    this.needs.clean = this.clamp(this.needs.clean - 1);
  }

private applyMoodState() {
  const avg =
    (this.needs.fullness +
      this.needs.energy +
      this.needs.joy +
      this.needs.clean) / 4;

  if (avg >= 70) {
    this.baseState = 'happy';
  } else if (avg >= 30) {
    this.baseState = 'idle';
  } else {
    this.baseState = 'sad';
  }
}

  clamp(val: number) {
    return Math.max(0, Math.min(100, val));
  }

  /* ---------------- SPRITES ---------------- */

  getCurrentSpritePath(): string {
    return `assets/pets/${this.petType}/${this.currentState}.png`;
  }

  /* ---------------- STORAGE ---------------- */

save() {
  const data = {
    petName: this.petName,
    petType: this.petType,
    theme: this.theme,
    needs: this.needs,
    baseState: this.baseState
  };

  localStorage.setItem('petState', JSON.stringify(data));
}

load() {
  const data = localStorage.getItem('petState');
  if (!data) return;

  try {
    const parsed = JSON.parse(data);

    this.petName = parsed.petName ?? '';
    this.petType = parsed.petType ?? 'duck';
    this.theme = parsed.theme ?? 'tan';

    // ✅ validate needs
    if (parsed.needs) {
      this.needs = {
        fullness: parsed.needs.fullness ?? 100,
        energy: parsed.needs.energy ?? 100,
        joy: parsed.needs.joy ?? 100,
        clean: parsed.needs.clean ?? 100,
      };
    }

  this.baseState = parsed.baseState ?? 'happy';
  this.activeState = null;

  } catch {
    console.warn('Invalid saved state, resetting...');
    this.reset();
  }
}

  
}