import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { SideNavComponent } from '../../shared/side-nav/side-nav';
import { RoomsService } from '../../core/services/rooms';
import { AuthService } from '../../core/services/auth';
@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SideNavComponent],
  templateUrl: './rooms-list.html',
  styleUrls: ['./rooms-list.css'],
})
export class RoomsListComponent implements OnInit {
  rooms: any[] = [];
  isAdmin = false;
  loading = true;

  constructor(
    private router: Router,
    private roomsService: RoomsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.reloadRooms();
  }

  editRoom(salle: any) {
    this.router.navigate(['/rooms/edit', salle.id]);
  }

  deleteRoom(salle: any) {
    if (confirm(`Voulez-vous vraiment supprimer "${salle.nom}" ?`)) {
      this.roomsService.deleteRoom(salle.id).subscribe({
        next: () => this.reloadRooms(),
        error: () => alert('Erreur lors de la suppression'),
      });
    }
  }

  reloadRooms() {
    this.loading = true;
    this.roomsService.getRooms().subscribe(data => {
      this.rooms = data;
      this.loading = false;
    });
  }

  reserveRoom(room: any) {
    this.router.navigate(['/reservations'], { queryParams: { room: room.nom || room.name } });
  }

  goToCreateRoom() {
    this.router.navigate(['/rooms/create']);
  }
}
