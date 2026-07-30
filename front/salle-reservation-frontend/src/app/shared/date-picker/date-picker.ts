import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './date-picker.html',
  styleUrls: ['./date-picker.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
})
export class DatePickerComponent implements ControlValueAccessor {
  open = false;
  selectedDate: Date | null = null;
  viewDate: Date = new Date();
  displayValue = '';

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  get year() { return this.viewDate.getFullYear(); }
  get month() { return this.viewDate.getMonth(); }

  monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  dayLabels = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

  get daysInMonth(): number[] {
    const y = this.year;
    const m = this.month;
    const total = new Date(y, m + 1, 0).getDate();
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  get startOffset(): number {
    const firstDay = new Date(this.year, this.month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  }

  prevMonth() {
    this.viewDate = new Date(this.year, this.month - 1, 1);
  }

  nextMonth() {
    this.viewDate = new Date(this.year, this.month + 1, 1);
  }

  isToday(day: number): boolean {
    const d = new Date();
    return d.getFullYear() === this.year && d.getMonth() === this.month && d.getDate() === day;
  }

  isSelected(day: number): boolean {
    if (!this.selectedDate) return false;
    return this.selectedDate.getFullYear() === this.year &&
           this.selectedDate.getMonth() === this.month &&
           this.selectedDate.getDate() === day;
  }

  isPast(day: number): boolean {
    const d = new Date(this.year, this.month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  }

  selectDay(day: number) {
    if (this.isPast(day)) return;
    this.selectedDate = new Date(this.year, this.month, day);
    const y = this.selectedDate.getFullYear();
    const m = (this.selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const d = this.selectedDate.getDate().toString().padStart(2, '0');
    const local = `${y}-${m}-${d}`;
    this.displayValue = `${day.toString().padStart(2, '0')}/${(this.month + 1).toString().padStart(2, '0')}/${this.year}`;
    this.onChange(local);
    this.onTouched();
    this.open = false;
  }

  toggle() {
    this.open = !this.open;
    if (this.open) {
      this.viewDate = this.selectedDate ? new Date(this.selectedDate) : new Date();
    }
  }

  close() {
    this.open = false;
    this.onTouched();
  }

  writeValue(value: string): void {
    if (value) {
      const parts = value.split('-');
      if (parts.length === 3) {
        const y = +parts[0], m = +parts[1] - 1, d = +parts[2];
        const date = new Date(y, m, d);
        if (!isNaN(date.getTime())) {
          this.selectedDate = date;
          this.displayValue = `${d.toString().padStart(2, '0')}/${(m + 1).toString().padStart(2, '0')}/${y}`;
        }
      }
    }
  }

  registerOnChange(fn: (value: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {}
}
