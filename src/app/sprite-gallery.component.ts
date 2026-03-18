import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
//import { PET_LIBRARY } from './pet-sprites';
import { flattenSprite } from './pet.utils';
import { PetMood } from './pet.types';

type AnimationKey = 'idle' | 'blink' | 'eating' | 'sleeping';

@Component({
  selector: 'app-sprite-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="gallery">
      <div class="pet-section" *ngFor="let pet of pets">
        <h2>{{ pet.name }}</h2>
        <p>{{ pet.description }}</p>

        <div class="mood-section" *ngFor="let mood of moods">
          <h3>{{ mood | titlecase }}</h3>

          <div class="animation-row" *ngFor="let anim of animations">
            <div
              class="frame-card"
              *ngFor="let frame of pet.moods[mood][anim]; let i = index"
            >
              <div class="frame-label">
                {{ anim }} · frame {{ i + 1 }}
              </div>

              <div
                class="pixel-art"
                [style.--cols]="frame[0].length"
                [style.--rows]="frame.length"
              >
                <div
                  *ngFor="let pixel of flatten(frame)"
                  class="px"
                  [style.background]="pet.palette[pixel] ?? '#ffffff'"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gallery {
      display: grid;
      gap: 32px;
      padding: 24px;
    }

    .pet-section {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      padding: 20px;
    }

    .pet-section h2 {
      margin: 0 0 6px;
    }

    .pet-section p {
      margin: 0 0 20px;
      color: #667085;
    }

    .mood-section {
      margin-bottom: 24px;
    }

    .mood-section h3 {
      margin: 0 0 12px;
    }

    .animation-row {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 16px;
    }

    .frame-card {
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 12px;
      background: #fbfcff;
    }

    .frame-label {
      font-size: 13px;
      margin-bottom: 8px;
      color: #475467;
      font-weight: 600;
    }

    .pixel-art {
      display: grid;
      grid-template-columns: repeat(var(--cols), 6px);
      grid-template-rows: repeat(var(--rows), 6px);
      image-rendering: pixelated;
      background: #fff;
    }

    .px {
      width: 6px;
      height: 6px;
    }
  `]
})
export class SpriteGalleryComponent {
  pets = PET_LIBRARY;
  moods: PetMood[] = ['happy', 'neutral', 'sad'];
  animations: AnimationKey[] = ['idle', 'blink', 'eating', 'sleeping'];

  flatten(frame: string[]): string[] {
    return flattenSprite(frame);
  }
}