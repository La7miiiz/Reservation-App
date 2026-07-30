import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { SideNavComponent } from '../../shared/side-nav/side-nav';
import { RoomsService } from '../../core/services/rooms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, SideNavComponent],
  templateUrl: './create-room.html',
  styleUrls: ['./create-room.css'],
})
export class CreateRoomComponent {
  roomForm;
  success = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private roomsService: RoomsService,
    private router: Router
  ) {
    this.roomForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      capacite: ['', [Validators.required, Validators.min(1)]],
    });
  }

  submitRoom() {
    if (this.roomForm.valid) {
      this.roomsService.createRoom(this.roomForm.value).subscribe({
        next: () => {
          this.success = true;
          setTimeout(() => this.router.navigate(['/rooms']), 1200);
        },
        error: () => {
          this.error = 'Erreur lors de la cr&eacute;ation de la salle.';
        },
      });
    }
  }
}
