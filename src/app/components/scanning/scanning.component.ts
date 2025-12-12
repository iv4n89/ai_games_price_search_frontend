import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scanning',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scanning.component.html',
  styleUrls: ['./scanning.component.css'],
})
export class ScanningComponent {
  @Input() message: string = 'ESCANEANDO...';
  @Input() image: string | null = null;
}
