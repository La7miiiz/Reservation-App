import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-nav.html',
  styleUrls: ['./side-nav.css'],
})
export class SideNavComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  isAdmin = false;
  currentPath = '';

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.currentPath = this.router.url;
  }

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }

  goTo(section: string) {
    this.router.navigateByUrl('/' + section);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
