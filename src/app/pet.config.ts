import { NeedKey, PetNeeds } from './pet.types';

export const NEED_KEYS: NeedKey[] = ['fullness', 'energy', 'joy', 'clean'];

export const INITIAL_NEEDS: PetNeeds = {
  fullness: 100,
  energy: 100,
  joy: 100,
  clean: 100
};

export const ANIMATION_INTERVAL_MS = 380;
export const DECAY_INTERVAL_MS = 3200;
export const BLINK_MIN_MS = 2500;
export const BLINK_MAX_MS = 5500;
export const NEED_BOOST_AMOUNT = 24;
export const NEED_DECAY_MIN = 4;
export const NEED_DECAY_MAX = 10;
export const HAPPY_THRESHOLD = 70;
export const NEUTRAL_THRESHOLD = 40;
export const EATING_DURATION_MS = 1500;
export const SLEEPING_DURATION_MS = 2300;
