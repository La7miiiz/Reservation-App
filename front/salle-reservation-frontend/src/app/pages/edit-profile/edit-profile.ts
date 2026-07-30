import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { SideNavComponent } from '../../shared/side-nav/side-nav';
import { UserService } from '../../core/services/user';
import { AvatarPickerComponent } from '../../avatar-picker/avatar-picker';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.css'],
  imports: [ReactiveFormsModule, CommonModule, NavbarComponent, SideNavComponent, AvatarPickerComponent],
})
export class EditProfileComponent implements OnInit {
  editForm!: FormGroup;
  successMessage: string | null = null;
  error: string | null = null;
  loading = true;
  avatarSeed = '';
  showAvatarPicker = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getProfile().subscribe({
      next: (user: any) => {
        this.avatarSeed = user.avatarSeed || `${user.nom || 'user'}-0`;
        this.editForm = this.fb.group({
          nom: [user.nom, Validators.required],
          email: [user.email, [Validators.required, Validators.email]],
          oldPassword: [''],
          newPassword: [''],
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger le profil.';
        this.loading = false;
      },
    });
  }

  onAvatarSelected(seed: string) {
    this.avatarSeed = seed;
    this.showAvatarPicker = false;
  }

  saveProfile() {
    if (this.editForm.valid) {
      this.userService
        .updateProfile({
          nom: this.editForm.value.nom,
          email: this.editForm.value.email,
          avatarSeed: this.avatarSeed,
          oldPassword: this.editForm.value.oldPassword,
          newPassword: this.editForm.value.newPassword,
        })
        .subscribe({
          next: () => {
            this.successMessage = 'Profil modifi\u00e9 avec succ\u00e8s !';
            setTimeout(() => {
              this.router.navigate(['/profile']);
            }, 2000);
          },
          error: () => {
            this.error = '\u00c9chec de la modification du profil.';
          },
        });
    }
  }

  cancelEdit() {
    this.router.navigate(['/profile']);
  }
}
