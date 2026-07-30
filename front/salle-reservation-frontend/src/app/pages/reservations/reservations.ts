import { Component, inject, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { SideNavComponent } from '../../shared/side-nav/side-nav';
import { ReservationService } from '../../core/services/reservation';
import { RoomsService } from '../../core/services/rooms';
import { DatePickerComponent } from '../../shared/date-picker/date-picker';
import { TimePickerComponent } from '../../shared/time-picker/time-picker';
@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, SideNavComponent, DatePickerComponent, TimePickerComponent],
  templateUrl: './reservations.html',
  styleUrls: ['./reservations.css'],
})
export class ReservationsComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reservationService = inject(ReservationService);
  private roomsService = inject(RoomsService);

  @ViewChild('endPicker') endPicker!: TimePickerComponent;

  rooms: any[] = [];
  reservationForm: FormGroup = this.fb.group({
    room: ['', Validators.required],
    date: ['', Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
  });

  success = false;
  error: string | null = null;
  loading = false;

  ngAfterViewInit() {
    this.reservationForm.get('startTime')?.valueChanges.subscribe(v => {
      this.endPicker?.setMinTime(v || '');
    });
  }

  submitReservation() {
    this.error = null;
    if (this.reservationForm.invalid) return;

    this.loading = true;
    const { date, startTime, endTime, room } = this.reservationForm.value;
    const datetimeDebut = new Date(date + 'T' + startTime);
    const datetimeFin = new Date(date + 'T' + endTime);

    if (datetimeDebut >= datetimeFin) {
      this.error = "L'heure de d\u00e9but doit \u00eatre avant l'heure de fin !";
      this.loading = false;
      return;
    }

    const payload = {
      salleId: Number(room),
      dateDebut: date + 'T' + startTime,
      dateFin: date + 'T' + endTime,
    };

    this.reservationService.createReservation(payload).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        this.reservationForm.reset();
        setTimeout(() => {
          this.success = false;
          this.router.navigate(['/history']);
        }, 2000);
      },
      error: (err) => {
        this.error = err.error?.message || "Erreur lors de la r\u00e9servation.";
        this.loading = false;
      },
    });
  }

  ngOnInit() {
    this.roomsService.getRooms().subscribe(data => {
      this.rooms = data;
      this.route.queryParams.subscribe(params => {
        if (params['room']) {
          const found = this.rooms.find(r => (r.nom || r.name) === params['room']);
          if (found) {
            this.reservationForm.patchValue({ room: found.id });
          }
        }
      });
    });
  }
}
