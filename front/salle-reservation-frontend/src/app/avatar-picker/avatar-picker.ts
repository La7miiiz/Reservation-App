import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar-picker',
  standalone: true,
  templateUrl: './avatar-picker.html',
  styleUrls: ['./avatar-picker.css'],
  imports: [CommonModule],
})
export class AvatarPickerComponent {
  @Input() username = '';
  @Output() avatarSelected = new EventEmitter<string>();
  @Output() closePicker = new EventEmitter<void>();

  avatarSeeds: string[] = [];

  ngOnInit() {
    this.avatarSeeds = Array.from({ length: 6 }, (_, i) => `${this.username || 'user'}-${i}`);
  }

  selectAvatar(seed: string) {
    this.avatarSelected.emit(seed);
    this.closePicker.emit();
  }

  close() {
    this.closePicker.emit();
  }
}
