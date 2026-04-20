import { Routes } from '@angular/router';
import { SetupComponent } from './pages/setup/setup.component';
import { GameComponent } from './pages/game/game.component';

export const routes: Routes = [
  { path: '', component: SetupComponent, title: 'Create Your Pet' },
  { path: 'game', component: GameComponent, title: 'Your Pet' }
];
