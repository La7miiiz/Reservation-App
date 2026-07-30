import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { SideNavComponent } from '../../shared/side-nav/side-nav';
import { UserService } from '../../core/services/user';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SideNavComponent],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  loading = true;
  editModal = false;
  editingUser: any = {};
  roles = ['USER', 'ADMIN'];

  currentUserId: number | null = null;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.currentUserId = this.authService.getUser()?.id ?? null;
  }

  ngOnInit() {
    this.reloadUsers();
  }

  reloadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe(data => {
      this.users = data.filter(u => u.id !== this.currentUserId);
      this.loading = false;
    });
  }

  openEdit(user: any) {
    this.editingUser = { ...user };
    this.editModal = true;
  }

  closeModal() {
    this.editModal = false;
    this.editingUser = {};
  }

  saveUser() {
    this.userService.updateUser(this.editingUser.id, this.editingUser).subscribe({
      next: () => {
        this.closeModal();
        this.reloadUsers();
      },
      error: () => alert('Erreur lors de la mise à jour'),
    });
  }

  deleteUser(user: any) {
    if (confirm(`Voulez-vous vraiment supprimer "${user.nom}" ?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => this.reloadUsers(),
        error: () => alert('Erreur lors de la suppression'),
      });
    }
  }
}
