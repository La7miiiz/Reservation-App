import { Routes } from '@angular/router';
import { provideHttpClient, withRequestsMadeViaParent } from '@angular/common/http';
import { AuthGuard } from './core/guards/auth.guard';


export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent),
    providers: [
      provideHttpClient(withRequestsMadeViaParent()),
    ]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register/register').then(m => m.RegisterComponent)
  },
  {
  path: 'profile',
  canActivate: [AuthGuard], 
  loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent)
  },
  {
  path: 'profile/edit',
  canActivate: [AuthGuard],
  loadComponent: () => import('./pages/edit-profile/edit-profile').then(m => m.EditProfileComponent)
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'rooms',
    canActivate: [AuthGuard],
    loadComponent: () =>import('./pages/rooms-list/rooms-list').then(m => m.RoomsListComponent),
    
  },
   {
    path: 'reservations', 
    canActivate: [AuthGuard], 
    loadComponent: () => import('./pages/reservations/reservations').then(m => m.ReservationsComponent)
  },
  
  {
  path: 'history',
  canActivate: [AuthGuard], 
  loadComponent: () => import('./pages/reservation-history/reservation-history').then(m => m.ReservationHistoryComponent)
  },
  {
  path: 'reservations/edit/:id',
  canActivate: [AuthGuard],
  loadComponent: () => import('./pages/reservation-edit/reservation-edit')
    .then(m => m.ReservationEditComponent)
  },
  {
  path: 'rooms/create',
  canActivate: [AuthGuard], 
  loadComponent: () => import('./pages/create-room/create-room').then(m => m.CreateRoomComponent),
  },
  {
  path: 'rooms/edit/:id',
  canActivate: [AuthGuard], 
  loadComponent: () => import('./pages/edit-room/edit-room').then(m => m.EditRoomComponent)
  },
  {
  path: 'users',
  canActivate: [AuthGuard],
  loadComponent: () => import('./pages/users/users').then(m => m.UsersComponent)
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
