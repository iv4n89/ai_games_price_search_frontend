import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppraisalResponse, AppraisalRequest } from '../../gamescanner.service';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
})
export class ResultComponent {
  @Input() result!: AppraisalResponse;
  @Input() requestData!: AppraisalRequest;
  @Output() reset = new EventEmitter<void>();

  onReset() {
    this.reset.emit();
  }
}
