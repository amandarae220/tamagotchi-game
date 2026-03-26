import { Component, OnInit } from '@angular/core';
import { PetStateService } from './services/pet-state.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(private pet: PetStateService) {}

  ngOnInit() {
    this.pet.load();
  }
}