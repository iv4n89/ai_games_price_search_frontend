import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService, IdentificationResponse, AppraisalResponse, AppraisalRequest, GameCandidate } from './gamescanner.service';

type AppStep = 'upload' | 'scanning' | 'selection' | 'verify' | 'result' | 'error';

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.2; 
    this.vy = (Math.random() - 0.5) * 0.2;
    this.size = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.3 + 0.1;
    this.color = Math.random() > 0.8 ? '188, 19, 254' : '255, 255, 255';
  }

  update(width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements AfterViewInit, OnDestroy {
  @ViewChild('bgCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private animationFrameId!: number;
  private particles: Particle[] = [];
  
  step: AppStep = 'upload';
  scanningMessage = 'INICIANDO SENSORES...';
  previewImage: string | null = null;
  isLoading = false;

  // Actualizado: Array de objetos GameCandidate
  candidates: GameCandidate[] = [];
  
  formData: AppraisalRequest = {
    title: '',
    platform: '',
    region: 'PAL ESP',
    condition: 'CIB'
  };

  resultData: AppraisalResponse | null = null;

  constructor(private gameService: GameService, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.initParticles();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  initParticles() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    this.particles = Array.from({ length: 80 }, () => new Particle(canvas.width, canvas.height));
    this.animate();
  }

  resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  animate() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.particles.forEach(p => {
      p.update(canvas.width, canvas.height);
      this.ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      this.ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target?.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);

      this.step = 'scanning';
      this.scanningMessage = 'IDENTIFICANDO JUEGO...';
      
      this.gameService.identifyGame(file).subscribe({
        next: (res) => {
          console.log('Respuesta recibida:', res);
          if (res.multiple_detected && res.candidates.length > 0) {
            console.log('Múltiples detectados');
            this.candidates = res.candidates;
            this.step = 'selection';
            this.cdr.detectChanges();
          } else if (res.found) {
            console.log('Juego encontrado');
            this.populateForm(res.data);
            this.step = 'verify';
            this.cdr.detectChanges();
          } else {
            alert('No se detectó ningún juego claro. Intenta otra foto.');
            this.step = 'upload';
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error(err);
          this.step = 'upload';
          alert('Error conectando con la IA');
          this.cdr.detectChanges();
        }
      });
    }
  }

  selectCandidate(candidate: GameCandidate) {
    this.formData.title = candidate.title;
    this.formData.platform = candidate.platform;
    if (candidate.condition_guess) this.formData.condition = candidate.condition_guess;
    this.step = 'verify';
  }

  populateForm(data: any) {
    this.formData.title = data.title;
    this.formData.platform = data.platform;
    if (data.region_guess !== 'UNKNOWN') this.formData.region = data.region_guess;
    if (data.condition_guess) this.formData.condition = data.condition_guess;
  }

  submitForAppraisal() {
    this.isLoading = true;
    this.gameService.getAppraisal(this.formData).subscribe({
      next: (res) => {
        this.resultData = res;
        this.step = 'result';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert('Error tasando el juego');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  reset() {
    this.step = 'upload';
    this.previewImage = null;
    this.resultData = null;
    this.formData = { title: '', platform: '', region: 'PAL ESP', condition: 'CIB' };
  }
}