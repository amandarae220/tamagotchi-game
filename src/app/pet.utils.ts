import {
  HAPPY_THRESHOLD,
  NEED_DECAY_MAX,
  NEED_DECAY_MIN,
  NEUTRAL_THRESHOLD
} from './pet.config';
import { NeedKey, PetMood, PetNeeds, SpriteFrame } from './pet.types';

export function flattenSprite(frame: SpriteFrame): string[] {
  return frame.join('').split('');
}

export function averageNeeds(needs: PetNeeds, needKeys: NeedKey[]): number {
  const total = needKeys.reduce((sum, key) => sum + needs[key], 0);
  return total / needKeys.length;
}

export function getMoodFromNeeds(needs: PetNeeds, needKeys: NeedKey[]): PetMood {
  const average = averageNeeds(needs, needKeys);

  if (average >= HAPPY_THRESHOLD) return 'happy';
  if (average >= NEUTRAL_THRESHOLD) return 'neutral';
  return 'sad';
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomDecay(): number {
  return randomBetween(NEED_DECAY_MIN, NEED_DECAY_MAX);
}
