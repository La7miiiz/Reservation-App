import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { SideNavComponent } from '../../shared/side-nav/side-nav';
import { RoomsService } from '../../core/services/rooms';

@Component({
  selector: 'app-edit-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, SideNavComponent],
  templateUrl: './edit-room.html',
  styleUrls: ['./edit-room.css'],
})
export class EditRoomComponent implements OnInit {
  roomForm: FormGroup;
  success = false;
  error: string | null = null;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private roomsService: RoomsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.roomForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      capacite: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.roomsService.getRoom(+id).subscribe({
        next: (room) => {
          this.roomForm.patchValue(room);
          this.loading = false;
        },
        error: () => {
          this.error = 'Impossible de charger la salle.';
          this.loading = false;
        },
      });
    }
  }

  submitRoom() {
    if (this.roomForm.valid) {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.roomsService.updateRoom(id, this.roomForm.value).subscribe({
        next: () => {
          this.success = true;
          setTimeout(() => this.router.navigate(['/rooms']), 1200);
        },
        error: () => {
          this.error = 'Erreur lors de la modification.';
        },
      });
    }
  }
}
