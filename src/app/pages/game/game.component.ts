import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PetStateService } from '../../services/pet-state.service';

/* ✅ shared types */
type Theme = 'tan' | 'mint' | 'lavender' | 'peach' | 'sky';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;
  currentImage = new Image();
  intervalId!: any;
  
isPaused = false;

constructor(public pet: PetStateService, private router: Router) {}

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.ctx = ctx;

    this.loadPetImage();
    this.startGameLoop();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  ngOnInit() {
  // 🧠 safety check — ensures data exists
  if (!this.pet.petName) {
    console.warn('Pet name missing — redirecting to setup');
    this.router.navigate(['/']);
  }
}

loadPetImage() {
  this.currentImage = new Image();

  this.currentImage.onload = () => {
    this.render();
  };

  this.currentImage.src = this.pet.getCurrentSpritePath();
}

startGameLoop() {
  this.intervalId = setInterval(() => {

    if (!this.isPaused) {
      this.pet.transition('TIME_TICK');
    }

    this.loadPetImage();

  }, 2000);
}

togglePause() {
  this.isPaused = !this.isPaused;
}

goToSetup() {
  this.router.navigate(['/']);
}

decayNeeds() {
  this.pet.needs.fullness = this.clamp(this.pet.needs.fullness - 2);
  this.pet.needs.energy = this.clamp(this.pet.needs.energy - 1);
  this.pet.needs.joy = this.clamp(this.pet.needs.joy - 1);
  this.pet.needs.clean = this.clamp(this.pet.needs.clean - 1);

  this.render(); 
}

render() {
  const canvas = this.canvasRef.nativeElement;
  const ctx = this.ctx;

  if (!this.currentImage.complete) return;

  // ✅ match setup exactly
  canvas.width = this.currentImage.width;
  canvas.height = this.currentImage.height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.imageSmoothingEnabled = false;

  ctx.drawImage(this.currentImage, 0, 0);
}

  // ✅ keep values between 0–100
  clamp(val: number) {
    return Math.max(0, Math.min(100, val));
  }

  // ✅ actions (match HTML + service)
  feed() { this.pet.transition('FEED'); }
  play() { this.pet.transition('PLAY'); }
  nap() { this.pet.transition('SLEEP'); }
  bathe() { this.pet.transition('BATHE'); }
  cuddle() { this.pet.transition('CUDDLE'); }

  // ✅ theme background (fixes your earlier error)
  getThemeStyle(theme: Theme) {
    const dots: Record<Theme, { bg: string; dot: string }> = {
      tan: { bg: '#fffdf8', dot: '#eadfce' },
      mint: { bg: '#fbfffd', dot: '#d3f5e6' },
      lavender: { bg: '#fdfbff', dot: '#e8e1ff' },
      peach: { bg: '#fffaf6', dot: '#ffd9c2' },
      sky: { bg: '#f9fbff', dot: '#d9eafe' },
    };

    const c = dots[theme];

    return {
      backgroundColor: c.bg,
      backgroundImage: `
        radial-gradient(${c.dot} 1.5px, transparent 2px),
        radial-gradient(${c.dot} 1.5px, transparent 2px)
      `,
      backgroundPosition: '0 0, 12px 12px',
      backgroundSize: '24px 24px',
    };
  }

  getMood(): string {
  const avg =
    (this.pet.needs.fullness +
      this.pet.needs.energy +
      this.pet.needs.joy +
      this.pet.needs.clean) / 4;

  if (avg > 70) return 'happy';
  if (avg > 40) return 'neutral';
  return 'sad';
}

}