import { Injectable } from '@angular/core';

/* ✅ shared types */
export type Theme = 'tan' | 'mint' | 'lavender' | 'peach' | 'sky';
export type PetType = 'duck' | 'dog' | 'penguin';
export type PetVisualState = 'idle' | 'eat' | 'sleep' | 'bath' | 'happy';

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

  /* ✅ strongly typed */
  petName: string = '';
  petType: PetType = 'duck';  
  theme: Theme = 'tan';  
  currentState: PetVisualState = 'idle';
  private stateTimeout: any;     

  needs: PetNeeds = {
    fullness: 100,
    energy: 100,
    joy: 100,
    clean: 100
  };

reset() {
  const target = { fullness: 100, energy: 100, joy: 100, clean: 100 };

  Object.keys(this.needs).forEach((key) => {
    const k = key as keyof PetNeeds;
    this.needs[k] = target[k];
  });
}

setState(state: PetVisualState, duration = 1200) {
  this.currentState = state;

  clearTimeout(this.stateTimeout);

  this.stateTimeout = setTimeout(() => {
    this.currentState = 'idle';
  }, duration);
}

getCurrentSpritePath(): string {
  return `assets/pets/${this.petType}/${this.currentState}.png`;
}

clamp(val: number) {
  return Math.max(0, Math.min(100, val));
}

feed() {
  this.needs.fullness = this.clamp(this.needs.fullness + 15);
  this.setState('eat');
}

play() {
  this.needs.joy = this.clamp(this.needs.joy + 15);
  this.needs.energy = this.clamp(this.needs.energy - 5);
  this.setState('happy');
}

nap() {
  this.needs.energy = this.clamp(this.needs.energy + 20);
  this.setState('sleep', 2000);
}

bathe() {
  this.needs.clean = this.clamp(this.needs.clean + 20);
  this.setState('bath');
}

cuddle() {
  this.needs.joy = this.clamp(this.needs.joy + 10);
  this.setState('happy');
}

}