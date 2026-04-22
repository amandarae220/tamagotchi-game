import { Injectable } from '@angular/core';
import {
  INITIAL_NEEDS,
  PetEvent,
  PetNeeds,
  PetType,
  PetVisualState,
  Theme
} from '../pet.models';

const STORAGE_KEY = 'petState';
const DEFAULT_BASE_STATE: Extract<PetVisualState, 'happy' | 'idle' | 'sad'> = 'happy';

@Injectable({
  providedIn: 'root'
})
export class PetStateService {
  petName = '';
  petType: PetType = 'duck';
  theme: Theme = 'lavender';

  private baseState: Extract<PetVisualState, 'happy' | 'idle' | 'sad'> = DEFAULT_BASE_STATE;
  private activeState: 'eating' | 'sleeping' | 'bathing' | null = null; 
  private stateTimeout?: ReturnType<typeof setTimeout>;
  needs: PetNeeds = { ...INITIAL_NEEDS };

  get currentState(): PetVisualState {
    return this.activeState ?? this.baseState;
  }

  get mood(): 'happy' | 'neutral' | 'sad' {
    const average =
      (this.needs.fullness + this.needs.energy + this.needs.joy + this.needs.clean) / 4;

    if (average >= 70) {
      return 'happy';
    }

    if (average >= 40) {
      return 'neutral';
    }

    return 'sad';
  }

  setProfile(name: string, petType: PetType, theme: Theme): void {
    this.petName = name;
    this.petType = petType;
    this.theme = theme;
  }

  reset(): void {
    this.needs = { ...INITIAL_NEEDS };
    this.baseState = DEFAULT_BASE_STATE;
    this.activeState = null;
    this.save();
  }

  transition(event: PetEvent): void {
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

  private triggerTemporaryState(
    state: 'eating' | 'sleeping' | 'bathing',
    duration: number
  ): void {
    clearTimeout(this.stateTimeout);
    this.activeState = state;
    this.stateTimeout = setTimeout(() => {
      this.activeState = null;
    }, duration);
  }

  private decayNeeds(): void {
    this.needs.fullness = this.clamp(this.needs.fullness - 2);
    this.needs.energy = this.clamp(this.needs.energy - 1);
    this.needs.joy = this.clamp(this.needs.joy - 1);
    this.needs.clean = this.clamp(this.needs.clean - 1);
  }

  private applyMoodState(): void {
    const average =
      (this.needs.fullness + this.needs.energy + this.needs.joy + this.needs.clean) / 4;

    if (average >= 70) {
      this.baseState = 'happy';
      return;
    }

    if (average >= 30) {
      this.baseState = 'idle';
      return;
    }

    this.baseState = 'sad';
  }

  private clamp(val: number): number {
    return Math.max(0, Math.min(100, val));
  }

  getCurrentSpritePath(): string {
    return `assets/pets/${this.petType}/${this.currentState}.png`;
  }

  save(): void {
    const data = {
      petName: this.petName,
      petType: this.petType,
      theme: this.theme,
      needs: this.needs,
      baseState: this.baseState
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  load(): void {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return;
    }

    try {
      const parsed = JSON.parse(data);

      this.petName = parsed.petName ?? '';
      this.petType = parsed.petType ?? 'duck';
      this.theme = parsed.theme ?? 'lavender';
      this.baseState = parsed.baseState ?? DEFAULT_BASE_STATE;
      this.activeState = null;

      if (parsed.needs) {
        this.needs = {
          fullness: parsed.needs.fullness ?? INITIAL_NEEDS.fullness,
          energy: parsed.needs.energy ?? INITIAL_NEEDS.energy,
          joy: parsed.needs.joy ?? INITIAL_NEEDS.joy,
          clean: parsed.needs.clean ?? INITIAL_NEEDS.clean
        };
      }
    } catch {
      this.reset();
    }
  }
}
