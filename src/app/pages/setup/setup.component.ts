import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PetStateService } from '../../services/pet-state.service';
import { FormsModule } from '@angular/forms';

/* ✅ ADD THIS */
type Theme = 'tan' | 'mint' | 'lavender' | 'peach' | 'sky';
type PetType = 'duck' | 'dog' | 'penguin';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements AfterViewInit {

  @ViewChild('previewCanvas')
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('nameInput')
  nameInput!: ElementRef<HTMLInputElement>;

  showNameError = false;

  name = '';

  /* ✅ TYPED */
  petType: PetType = 'duck';
  theme: Theme = 'tan'; 

  constructor(
    private router: Router,
    private petState: PetStateService
  ) {}

  ngAfterViewInit() {
    this.renderPreview();
  }

  renderPreview() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0);
    };

    img.src = `assets/pets/${this.petType}/idle.png`;
  }

  startGame() {

    const nameRegex = /^[A-Za-z]+$/;

    if (!this.name || !nameRegex.test(this.name)) {
      this.showNameError = true;

      setTimeout(() => {
        this.nameInput.nativeElement.focus();
      });

      return;
    }

    this.showNameError = false;

    this.petState.petName = this.name;
    this.petState.petType = this.petType;
    this.petState.theme = this.theme;

    this.router.navigate(['/game']);
  }

  /* ✅ TYPED */
  selectPet(type: PetType) {
    this.petType = type;
    this.renderPreview();
  }

  /* ✅ TYPED */
  selectTheme(theme: Theme) {
    this.theme = theme;
  }

  /* ✅ FIXED TYPESCRIPT ERROR HERE */
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
}