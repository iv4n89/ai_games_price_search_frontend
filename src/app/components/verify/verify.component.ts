import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppraisalRequest } from '../../gamescanner.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
})
export class VerifyComponent {
  @Input() formData!: AppraisalRequest;
  @Input() isLoading: boolean = false;
  @Output() submitForm = new EventEmitter<void>();

  regions = [
    { code: 'PAL ESP', label: 'PAL ESP', sub: 'España', flag: '🇪🇸' },
    { code: 'PAL EUR', label: 'PAL EUR', sub: 'Genérico', flag: '🇪🇺' },
    { code: 'NTSC U', label: 'NTSC U', sub: 'USA', flag: '🇺🇸' },
    { code: 'NTSC J', label: 'NTSC J', sub: 'Japón', flag: '🇯🇵' }
  ];

  onSubmit() {
    this.submitForm.emit();
  }
}
