import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user';
import { StatsService } from '../../core/services/stats';
import { AuthService } from '../../core/services/auth';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { SideNavComponent } from '../../shared/side-nav/side-nav';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  imports: [
    CommonModule,
    NavbarComponent,
    SideNavComponent,
    BaseChartDirective,
  ],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  stats: any = {};
  loading = true;
  error: string | null = null;
  isAdmin = false;

  barChartData: ChartData<'bar'> = {
    labels: ['Utilisateurs', 'Salles', 'R&eacute;servations', 'Actives', 'Expir&eacute;es'],
    datasets: [
      {
        label: 'Statistiques',
        data: [0, 0, 0, 0, 0],
        backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#06b6d4', '#ef4444'],
        borderRadius: 4,
      },
    ],
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  logHistory: any[] = [];
  usersList: any[] = [];
  reservationsList: any[] = [];

  constructor(
    private userService: UserService,
    private statsService: StatsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.userService.getProfile().subscribe({
      next: (profile: any) => {
        this.user = profile;

        if (this.isAdmin) {
          this.loadAdminData();
        }

        this.loading = false;
      },
      error: () => {
        this.error = '&Eacute;chec de chargement du profil.';
        this.loading = false;
      },
    });
  }

  loadAdminData() {
    this.statsService.getAdminStats().subscribe({
      next: (s: any) => {
        this.barChartData = {
          labels: ['Utilisateurs', 'Salles', 'R&eacute;servations', 'Actives', 'Expir&eacute;es'],
          datasets: [
            {
              label: 'Statistiques',
              data: [s.users || 0, s.rooms || 0, s.reservations || 0, s.active || 0, s.expired || 0],
              backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#06b6d4', '#ef4444'],
              borderRadius: 4,
            },
          ],
        };
      },
    });

    this.userService.getLogs().subscribe({
      next: (logs: any[]) => (this.logHistory = logs),
      error: () => (this.logHistory = []),
    });

    this.userService.getAllUsers().subscribe({
      next: (users: any[]) => (this.usersList = users),
      error: () => (this.usersList = []),
    });

    this.userService.getAllReservations().subscribe({
      next: (reservations: any[]) => (this.reservationsList = reservations),
      error: () => (this.reservationsList = []),
    });
  }

  goToEditProfile() {
    this.router.navigate(['/profile/edit']);
  }

  cancelReservation(id: number) {
    if (confirm('Voulez-vous vraiment annuler cette r&eacute;servation ?')) {
      this.userService.cancelReservation(id).subscribe({
        next: () => {
          this.reservationsList = this.reservationsList.filter(r => r.id !== id);
        },
        error: () => {
          alert("Erreur lors de l'annulation.");
        },
      });
    }
  }

  getStatusClass(statut: string): string {
    return statut === 'ACTIVE' ? 'status-active' : 'status-expired';
  }
}
