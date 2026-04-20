import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PetEvent, STAT_OPTIONS, StatOption, THEME_STYLES } from '../../pet.models';
import { PetStateService } from '../../services/pet-state.service';
import { SpriteLoaderService } from '../../services/sprite-loader.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  isPaused = false;
  readonly stats = STAT_OPTIONS;
  private ctx?: CanvasRenderingContext2D;
  private intervalId?: ReturnType<typeof setInterval>;

  constructor(
    public pet: PetStateService,
    private router: Router,
    private spriteLoader: SpriteLoaderService
  ) {}

  ngOnInit(): void {
    if (!this.pet.petName) {
      this.router.navigate(['/']);
    }
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    this.ctx = ctx;
    void this.renderCurrentSprite();
    this.startGameLoop();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  get themeStyle(): Record<string, string> {
    return THEME_STYLES[this.pet.theme];
  }

  performAction(event: PetEvent): void {
    this.pet.transition(event);
    void this.renderCurrentSprite();
  }

  trackStat(_: number, stat: StatOption): string {
    return stat.key;
  }

  togglePause(): void {
    this.isPaused = !this.isPaused;
  }

  goToSetup(): void {
    this.router.navigate(['/']);
  }

  resetPet(): void {
    this.pet.reset();
    void this.renderCurrentSprite();
  }

  private startGameLoop(): void {
    this.intervalId = setInterval(() => {
      if (this.isPaused) {
        return;
      }

      this.pet.transition('TIME_TICK');
      void this.renderCurrentSprite();
    }, 2000);
  }

  private async renderCurrentSprite(): Promise<void> {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    if (!ctx) {
      return;
    }

    try {
      const sprite = await this.spriteLoader.loadSprite(this.pet.getCurrentSpritePath());
      canvas.width = sprite.width;
      canvas.height = sprite.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(sprite, 0, 0);
    } catch {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
}
