import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './time-picker.html',
  styleUrls: ['./time-picker.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true,
    },
  ],
})
export class TimePickerComponent implements ControlValueAccessor {
  @Input() label = '';

  open = false;
  selectedTime: string | null = null;
  displayValue = '';
  minTime = '';

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  times: string[] = [];
  filteredTimes: string[] = [];
  searchTerm = '';

  constructor() {
    const slots: string[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        slots.push(
          `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
        );
      }
    }
    this.times = slots;
    this.filteredTimes = [...slots];
  }

  setMinTime(time: string) {
    this.minTime = time;
    this.applyFilters();
    if (this.selectedTime && time && this.selectedTime <= time) {
      this.selectedTime = null;
      this.displayValue = '';
      this.onChange('');
    }
  }

  private applyFilters() {
    let result = [...this.times];
    if (this.minTime) {
      result = result.filter(t => t > this.minTime);
    }
    if (this.searchTerm) {
      result = result.filter(t => t.includes(this.searchTerm));
    }
    this.filteredTimes = result;
  }

  toggle() {
    this.open = !this.open;
    this.searchTerm = '';
    this.applyFilters();
  }

  filterResults() {
    this.applyFilters();
  }

  selectTime(time: string) {
    this.selectedTime = time;
    this.displayValue = time;
    this.onChange(time);
    this.onTouched();
    this.open = false;
  }

  close() {
    this.open = false;
    this.onTouched();
  }

  writeValue(value: string): void {
    if (value) {
      this.selectedTime = value;
      this.displayValue = value;
    }
  }

  registerOnChange(fn: (value: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {}
}
