import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { SideNavComponent } from '../../shared/side-nav/side-nav';
import { ReservationService } from '../../core/services/reservation';
import { AuthService } from '../../core/services/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reservation-history',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SideNavComponent],
  templateUrl: './reservation-history.html',
  styleUrls: ['./reservation-history.css'],
})
export class ReservationHistoryComponent implements OnInit {
  reservations: any[] = [];
  loading = true;
  error: string | null = null;
  isAdmin = false;

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.reservationService.getMyReservations().subscribe({
      next: (res: any[]) => {
        this.reservations = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des r&eacute;servations.';
        this.loading = false;
      },
    });
  }

  deleteReservation(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette r&eacute;servation ?')) {
      this.reservationService.deleteReservation(id).subscribe({
        next: () => {
          this.reservations = this.reservations.filter(r => r.id !== id);
        },
        error: () => {
          this.error = '&Eacute;chec de la suppression.';
        },
      });
    }
  }

  editReservation(id: number) {
    this.router.navigate(['/reservations/edit', id]);
  }

  getStatusClass(statut: string): string {
    return statut === 'ACTIVE' ? 'status-active' : 'status-expired';
  }
}
