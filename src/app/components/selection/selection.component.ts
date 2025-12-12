import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameCandidate } from '../../gamescanner.service';

@Component({
  selector: 'app-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css'],
})
export class SelectionComponent {
  @Input() candidates: GameCandidate[] = [];
  @Output() select = new EventEmitter<GameCandidate>();
  @Output() cancel = new EventEmitter<void>();

  onSelect(candidate: GameCandidate) {
    this.select.emit(candidate);
  }

  onCancel() {
    this.cancel.emit();
  }
}
