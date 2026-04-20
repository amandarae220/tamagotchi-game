import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PET_OPTIONS, PetType, THEME_OPTIONS, THEME_STYLES, Theme } from '../../pet.models';
import { PetStateService } from '../../services/pet-state.service';
import { SpriteLoaderService } from '../../services/sprite-loader.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements AfterViewInit {
  @ViewChild('previewCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('nameInput') nameInput!: ElementRef<HTMLInputElement>;

  showNameError = false;
  name = '';
  petType: PetType = 'duck';
  theme: Theme = 'tan';
  readonly petOptions = PET_OPTIONS;
  readonly themeOptions = THEME_OPTIONS;
  private readonly nameRegex = /^[A-Za-z]+$/;

  constructor(
    private router: Router,
    private petState: PetStateService,
    private spriteLoader: SpriteLoaderService
  ) {}

  ngAfterViewInit(): void {
    void this.renderPreview();
  }

  get selectedThemeStyle(): Record<string, string> {
    return THEME_STYLES[this.theme];
  }

  async renderPreview(): Promise<void> {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    try {
      const sprite = await this.spriteLoader.loadSprite(`assets/pets/${this.petType}/idle.png`);
      canvas.width = sprite.width;
      canvas.height = sprite.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(sprite, 0, 0);
    } catch {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  startGame(): void {
    if (!this.name || !this.nameRegex.test(this.name)) {
      this.showNameError = true;
      setTimeout(() => {
        this.nameInput.nativeElement.focus();
      });
      return;
    }

    this.showNameError = false;
    this.petState.setProfile(this.name, this.petType, this.theme);
    this.petState.save();
    this.router.navigate(['/game']);
  }

  selectPet(type: PetType): void {
    this.petType = type;
    void this.renderPreview();
  }

  selectTheme(theme: Theme): void {
    this.theme = theme;
  }
}
