import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { SideNavComponent } from '../../shared/side-nav/side-nav';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SideNavComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {
  userName = '';
  isAdmin = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getUser();
    this.userName = user?.nom || 'Utilisateur';
    this.isAdmin = this.authService.isAdmin();
  }

  goToRooms() {
    this.router.navigateByUrl('/rooms');
  }

  goToReservations() {
    this.router.navigateByUrl('/reservations');
  }

  goToHistory() {
    this.router.navigateByUrl('/history');
  }

  goToCreateRoom() {
    this.router.navigateByUrl('/rooms/create');
  }

  goToProfile() {
    this.router.navigateByUrl('/profile');
  }
}
