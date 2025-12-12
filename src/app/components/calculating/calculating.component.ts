import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calculating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calculating.component.html',
  styleUrls: ['./calculating.component.css']
})
export class CalculatingComponent implements OnInit, OnDestroy {
  messages = [
    "Consultando eBay Sold Listings...",
    "Filtrando especulación y outliers...",
    "Verificando regiones (PAL/NTSC)...",
    "Calculando mediana de mercado...",
    "Generando informe final..."
  ];
  
  currentMessage = this.messages[0];
  private intervalId: any;

  ngOnInit() {
    let index = 0;
    this.intervalId = setInterval(() => {
      index = (index + 1) % this.messages.length;
      this.currentMessage = this.messages[index];
    }, 2000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
