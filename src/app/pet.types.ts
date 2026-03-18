export type PetMood = 'happy' | 'neutral' | 'sad';
export type PetActivity = 'idle' | 'eating' | 'sleeping';
export type NeedKey = 'feed' | 'bathe' | 'nap' | 'play';
export type PetId = 'blob' | 'cat' | 'duck' | 'dog';

export type SpriteFrame = string[];
export type SpriteAnimation = SpriteFrame[];

export interface MoodSpriteSet {
  idle: SpriteAnimation;
  blink: SpriteAnimation;
  eating: SpriteAnimation;
  sleeping: SpriteAnimation;
}

export interface PetDefinition {
  id: PetId;
  name: string;
  description: string;
  palette: Record<string, string>;
  moods: Record<PetMood, MoodSpriteSet>;
}

export interface PetNeeds {
  fullness: number;
  energy: number;
  joy: number;
  clean: number;
}

export interface PetState {
  id: PetId;
  name: string;
  description: string;
  mood: PetMood;
  activity: PetActivity;
  needs: PetNeeds;
  currentPixels: string[];
  message: string;
  isReacting: boolean;
}
